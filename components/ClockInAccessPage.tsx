import React from 'react';
import { Clock, ShieldCheck, Power, AlertTriangle, Lock } from 'lucide-react';
import { Employee } from '../types';

interface ClockInAccessPageProps {
  isClockInEnabled: boolean;
  onToggleClockIn: (enabled: boolean) => void;
  allEmployees: Employee[];
}

export default function ClockInAccessPage({
  isClockInEnabled,
  onToggleClockIn,
  allEmployees,
}: ClockInAccessPageProps) {
  return (
    <div className="h-full flex flex-col bg-slate-50/50 font-['Inter']">
      {/* Header */}
      <header className="px-12 py-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Clock In Access Control</h2>
          <p className="text-slate-400 font-bold mt-1 text-xs uppercase tracking-widest font-sans">
            Enable or disable staff terminal clock-in functionality globally
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider">
          <ShieldCheck size={16} />
          <span>Global Access Control</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Main Toggle Card */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/80 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              
              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 shadow-inner transition-colors duration-300 ${
                  isClockInEnabled 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                    : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}>
                  {isClockInEnabled ? <Clock size={32} /> : <Lock size={32} />}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      Clock In Terminal Access
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isClockInEnabled 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-100 text-rose-700 border border-rose-200'
                    }`}>
                      {isClockInEnabled ? 'ACTIVE & ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-500 max-w-lg leading-relaxed">
                    {isClockInEnabled 
                      ? 'Employees can access the Clock In terminal, enter PIN codes, record shift start/end times, and log breaks.' 
                      : 'Clock In functionality is currently disabled. Staff terminal access will be locked until re-enabled by an administrator.'}
                  </p>
                </div>
              </div>

              {/* Interactive Toggle Switch */}
              <div className="flex flex-col items-end shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  type="button"
                  onClick={() => onToggleClockIn(!isClockInEnabled)}
                  className={`relative inline-flex h-12 w-24 shrink-0 cursor-pointer rounded-full border-4 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shadow-md ${
                    isClockInEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                  role="switch"
                  aria-checked={isClockInEnabled}
                >
                  <span className="sr-only">Toggle Clock In Access</span>
                  <span
                    className={`pointer-events-none inline-block h-10 w-10 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out flex items-center justify-center ${
                      isClockInEnabled ? 'translate-x-12 text-emerald-600' : 'translate-x-0 text-slate-400'
                    }`}
                  >
                    <Power size={18} strokeWidth={3} />
                  </span>
                </button>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
                  Click to {isClockInEnabled ? 'Disable' : 'Enable'}
                </span>
              </div>

            </div>

            {/* Warning Banner when disabled */}
            {!isClockInEnabled && (
              <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center gap-4 text-amber-900 animate-in fade-in">
                <AlertTriangle size={20} className="text-amber-600 shrink-0" />
                <p className="text-xs font-bold leading-relaxed">
                  Notice: Disabling Clock In Access prevents employees from clocking in or out. Active shifts will remain open until access is re-enabled or manually ended in Staff Management.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
