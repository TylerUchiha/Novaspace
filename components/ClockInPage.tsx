import React, { useState, useEffect, useMemo, useRef } from 'react';
import { KeyRound, ShieldAlert, Coffee, LogOut, StopCircle, Clock, CheckCircle2, UserPlus, Users, ArrowRight, Camera, Upload, X, Image as ImageIcon, Check } from 'lucide-react';
import { UserProfile, Employee, EmployeeShift } from '../types';
import ClockOutPhotoModal from './ClockOutPhotoModal';

interface ClockInPageProps {
  userProfile?: UserProfile | null;
  allEmployees: Employee[];
  setAllEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  isClockInEnabled?: boolean;
}

const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function ClockInPage({ userProfile, allEmployees, setAllEmployees, isClockInEnabled = true }: ClockInPageProps) {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  
  // The currently selected active employee ID being viewed on terminal
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);

  // Clock Out Photo Upload Modal State
  const [showClockOutModal, setShowClockOutModal] = useState(false);
  const [clockOutPhotoUrl, setClockOutPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global second ticker
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper to calculate exact unique shift stats for any employee
  const getEmployeeShiftStats = (emp: Employee) => {
    const shift = emp.shifts.find(s => s.endTime === null);
    if (!shift) return { workedTime: 0, breakTime: 0, isOnBreak: false, shift: null };

    const lastBreak = shift.breaks[shift.breaks.length - 1];
    const isOnBreak = Boolean(lastBreak && lastBreak.end === null);

    let breakTime = 0;
    shift.breaks.forEach(b => {
      if (b.end) {
        breakTime += (b.end - b.start);
      } else {
        breakTime += (now - b.start);
      }
    });

    const workedTime = Math.max(0, now - shift.startTime - breakTime);
    return { workedTime, breakTime, isOnBreak, shift };
  };

  // Employees who currently have an active shift (clocked in)
  const clockedInEmployees = useMemo(() => {
    return allEmployees.filter(emp => emp.shifts.some(s => s.endTime === null));
  }, [allEmployees]);

  const activeEmployee = useMemo(() => allEmployees.find(e => e.id === activeEmployeeId), [allEmployees, activeEmployeeId]);
  
  const activeStats = useMemo(() => {
    if (!activeEmployee) return null;
    return getEmployeeShiftStats(activeEmployee);
  }, [activeEmployee, allEmployees, now]);

  const activeShift = activeStats?.shift;
  const isOnBreak = activeStats?.isOnBreak || false;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = allEmployees.find(e => e.pinCode === pinInput);
    if (emp) {
      setPinError(false);
      
      // Play subtle confirmation sound
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
        oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1); 
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.25);
      } catch (error) {
        console.warn("Audio Context not available");
      }

      setActiveEmployeeId(emp.id);
      
      // If employee doesn't have an open shift, start one with current timestamp
      const hasActive = emp.shifts.find(s => s.endTime === null);
      if (!hasActive) {
        const newShift: EmployeeShift = {
          id: `shift-${Date.now()}`,
          startTime: Date.now(),
          endTime: null,
          breaks: []
        };
        setAllEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, shifts: [...e.shifts, newShift] } : e));
      }
      setPinInput('');
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const handleToggleBreak = () => {
    if (!activeShift || !activeEmployee) return;
    setAllEmployees(prev => prev.map(emp => {
      if (emp.id !== activeEmployee.id) return emp;
      return {
        ...emp,
        shifts: emp.shifts.map(s => {
          if (s.id !== activeShift.id) return s;
          const breaks = [...s.breaks];
          if (isOnBreak) {
            breaks[breaks.length - 1].end = Date.now();
          } else {
            breaks.push({ start: Date.now(), end: null });
          }
          return { ...s, breaks };
        })
      };
    }));
  };

  const handleClockOut = () => {
    if (!activeShift || !activeEmployee) return;
    setShowClockOutModal(true);
  };

  const handleConfirmClockOut = (photoUrl: string) => {
    if (!activeShift || !activeEmployee) return;
    setAllEmployees(prev => prev.map(emp => {
      if (emp.id !== activeEmployee.id) return emp;
      return {
        ...emp,
        shifts: emp.shifts.map(s => {
          if (s.id !== activeShift.id) return s;
          const breaks = [...s.breaks];
          if (isOnBreak) {
            breaks[breaks.length - 1].end = Date.now();
          }
          return { ...s, breaks, endTime: Date.now(), clockOutPhoto: photoUrl };
        })
      };
    }));
    setShowClockOutModal(false);
    setActiveEmployeeId(null);
  };

  return (
    <div className="flex-1 relative flex flex-col min-h-0 overflow-y-auto custom-scrollbar bg-slate-50 p-6 sm:p-10">
      <div className="max-w-5xl mx-auto w-full flex flex-col gap-8">
        
        {!isClockInEnabled && (
          <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-6 flex items-center gap-4 text-rose-900 shadow-sm animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="font-black text-base">Clock In Access Disabled</h3>
              <p className="text-xs font-semibold text-rose-700/80 mt-0.5">
                The global owner has temporarily disabled clock-in terminal access. Please contact management if you need assistance.
              </p>
            </div>
          </div>
        )}
        
        {/* Header with Title & Currently Clocked In Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                <Clock size={22} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Staff Clock-In Terminal</h1>
            </div>
            <p className="text-xs font-bold text-slate-400 mt-1">
              Enter your 4-digit PIN to clock in, log breaks, or manage active shifts
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeEmployeeId && (
              <button
                onClick={() => setActiveEmployeeId(null)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 text-white font-black text-xs hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95"
              >
                <UserPlus size={16} />
                <span>Clock In Another Staff</span>
              </button>
            )}
          </div>
        </div>

        {/* Currently Clocked-In Staff Quick Selector Bar */}
        {clockedInEmployees.length > 0 && (
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Users size={14} className="text-blue-500" />
                Currently On Shift ({clockedInEmployees.length})
              </span>
              {!activeEmployeeId && (
                <span className="text-xs font-bold text-slate-400">Select staff member to view timer</span>
              )}
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {clockedInEmployees.map((emp) => {
                const isActive = emp.id === activeEmployeeId;
                const stats = getEmployeeShiftStats(emp);
                return (
                  <button
                    key={emp.id}
                    onClick={() => setActiveEmployeeId(emp.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border text-xs font-black transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-blue-50 border-blue-200 text-blue-700 ring-2 ring-blue-500/20 shadow-sm' 
                        : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <img src={emp.pfp} alt={emp.name} className="w-7 h-7 rounded-xl object-cover" />
                    <span>{emp.name}</span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-lg bg-slate-200/70 text-slate-800 font-bold">
                      {formatTime(stats.workedTime)}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${stats.isOnBreak ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Terminal Area */}
        {!activeEmployee ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-200/80 p-10 sm:p-14 shadow-sm flex flex-col items-center text-center max-w-lg mx-auto w-full relative overflow-hidden">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-blue-100">
              <KeyRound size={36} />
            </div>
            
            <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Staff Access</h3>
            <p className="text-xs font-bold text-slate-400 mb-8 max-w-xs">
              Enter your assigned 4-digit PIN to clock in or manage active shift
            </p>
            
            <form onSubmit={handlePinSubmit} className="flex flex-col items-center gap-5 w-full">
              <input 
                type="password" 
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••"
                className={`w-full text-center text-4xl font-black tracking-[0.5em] py-5 rounded-2xl border-2 outline-none transition-all placeholder:text-slate-300 ${
                  pinError 
                    ? 'border-rose-400 bg-rose-50 text-rose-600' 
                    : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:bg-white'
                }`}
                maxLength={4}
                autoFocus
              />
              {pinError && (
                <p className="text-xs font-black text-rose-500 uppercase tracking-wider flex items-center gap-1.5 animate-bounce">
                  <ShieldAlert size={15}/> Invalid Staff PIN
                </p>
              )}
              
              <button 
                type="submit"
                disabled={pinInput.length < 4}
                className="w-full bg-slate-900 text-white font-black text-sm py-4 rounded-2xl hover:bg-slate-800 active:scale-98 transition-all disabled:opacity-40 disabled:hover:bg-slate-900 shadow-md mt-1"
              >
                CLOCK IN / ENTER
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-8 sm:p-10 shadow-sm flex flex-col w-full">
            
            {/* Active Employee Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <img src={activeEmployee.pfp} alt={activeEmployee.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm" />
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{activeEmployee.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Clocked In & Active</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shift Timers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Timer */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-6 bg-blue-100 text-blue-600 font-bold">
                    <Clock size={24} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Total Time Worked
                  </p>
                  <div className="text-5xl sm:text-6xl font-black font-mono tracking-tighter text-slate-900">
                    {formatTime(activeStats?.workedTime || 0)}
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Shift Started</span>
                  <span>{new Date(activeShift?.startTime || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Break Timer & Actions */}
              <div className="flex flex-col gap-6">
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 flex flex-col justify-between flex-1">
                  <div>
                    <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-6 bg-amber-100 text-amber-600 font-bold">
                      <Coffee size={24} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Total Break Duration
                    </p>
                    <div className="text-4xl sm:text-5xl font-black font-mono tracking-tighter text-slate-900">
                      {formatTime(activeStats?.breakTime || 0)}
                    </div>
                  </div>
                  {isOnBreak && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-700 text-xs font-black">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      Currently on Break
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleToggleBreak}
                    className={`font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs border ${
                      isOnBreak 
                        ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600 shadow-sm' 
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Coffee size={18} />
                    {isOnBreak ? "End Break" : "Take Break"}
                  </button>
                  <button 
                    onClick={handleClockOut}
                    className="bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    <LogOut size={18} />
                    Clock Out
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        )}

      </div>

      {/* Clock-Out Verification Photo Upload Modal */}
      <ClockOutPhotoModal 
        isOpen={showClockOutModal}
        onClose={() => setShowClockOutModal(false)}
        onConfirm={handleConfirmClockOut}
      />
    </div>
  );
}
