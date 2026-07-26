import React, { useState, useEffect } from 'react';
import { Clock, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Vendor } from '../types';

interface WorkingTimesPageProps {
  vendor: Vendor | null;
  onUpdateVendor: (vendorId: string, updates: Partial<Vendor>) => void;
  isGlobalAccess?: boolean;
}

const TIME_OPTIONS = [
  '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM',
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
];

// Shortened versions for clean rendering e.g. "9 AM", "1 AM"
const formatShortTime = (timeStr: string) => {
  if (!timeStr) return '';
  if (timeStr === 'Full 24/7' || timeStr === '24/7') return 'Full 24/7';
  // convert e.g. "09:00 AM" -> "9 AM"
  return timeStr.replace(/^0/, '').replace(':00', '');
};

export default function WorkingTimesPage({
  vendor,
  onUpdateVendor,
  isGlobalAccess = false
}: WorkingTimesPageProps) {
  const [openingTime, setOpeningTime] = useState<string>('09:00 AM');
  const [closingTime, setClosingTime] = useState<string>('01:00 AM');
  const [is247, setIs247] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Parse existing access string on mount / vendor change
  useEffect(() => {
    if (vendor?.access) {
      if (vendor.access === 'Full 24/7' || vendor.access === '24/7' || vendor.access.toLowerCase().includes('24/7')) {
        setIs247(true);
      } else {
        setIs247(false);
        const parts = vendor.access.split(/-->|->|-/).map(s => s.trim());
        if (parts.length >= 2) {
          // Normalize parts to match 12-hour format options if possible
          const normalize = (t: string) => {
            let u = t.toUpperCase();
            if (/^\d{1,2}\s*(AM|PM)$/.test(u)) {
              const num = parseInt(u);
              const ampm = u.includes('PM') ? 'PM' : 'AM';
              const padded = num < 10 ? `0${num}:00 ${ampm}` : `${num}:00 ${ampm}`;
              return padded;
            }
            return u;
          };
          setOpeningTime(normalize(parts[0]) || '09:00 AM');
          setClosingTime(normalize(parts[1]) || '01:00 AM');
        }
      }
    }
  }, [vendor]);

  const formattedDisplay = `${formatShortTime(openingTime)} --> ${formatShortTime(closingTime)}`;

  const handleSave = () => {
    if (!vendor) return;
    onUpdateVendor(vendor.id, {
      access: formattedDisplay
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="min-h-full flex flex-col bg-slate-50/50 font-['Inter'] pb-12">
      {/* Top Banner Header */}
      <div className="bg-white border-b border-slate-200/80 px-8 py-6 shadow-2xs">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                <Clock size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Working Times & Hours</h2>
                <p className="text-xs font-bold text-slate-400 mt-0.5">
                  Configure operational hours for {vendor?.name || 'this workspace'}. Automatically updates customer discovery cards and branch metadata.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSaved && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200 animate-in fade-in duration-200">
                <Check size={16} />
                <span>Working Hours Saved!</span>
              </div>
            )}
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-5xl mx-auto w-full px-8 pt-8 space-y-8">
        
        {/* Working Hours Editor Box */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/80 shadow-sm space-y-8">
          <div>
            <h3 className="text-lg font-black text-slate-900">Choose Operating Schedule</h3>
            <p className="text-xs font-bold text-slate-400 mt-1">
              Select opening and closing times below or toggle 24/7 availability.
            </p>
          </div>

          {/* Dual Box Working Hours Selector */}
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
              Shift / Opening & Closing Hours
            </label>

            <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-4 bg-blue-50/30 p-6 rounded-3xl border border-blue-100">
              {/* Box 1: Opening Time */}
              <div className="md:col-span-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Opening Time</span>
                </div>
                <div className="relative bg-white border-2 border-slate-200 rounded-2xl p-3 shadow-2xs hover:border-blue-400 transition-colors">
                  <select
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    className="w-full bg-transparent outline-none font-black text-slate-900 text-lg cursor-pointer"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Arrow Connector */}
              <div className="md:col-span-1 flex items-center justify-center py-2 md:py-0">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 font-black">
                  <ArrowRight size={22} />
                </div>
              </div>

              {/* Box 2: Closing Time */}
              <div className="md:col-span-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Closing Time</span>
                </div>
                <div className="relative bg-white border-2 border-slate-200 rounded-2xl p-3 shadow-2xs hover:border-blue-400 transition-colors">
                  <select
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    className="w-full bg-transparent outline-none font-black text-slate-900 text-lg cursor-pointer"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
