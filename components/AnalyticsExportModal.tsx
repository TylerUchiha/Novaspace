import React, { useState, useMemo } from 'react';
import { Download, Calendar, Check, X, FileText, FileSpreadsheet, Clock, CalendarDays } from 'lucide-react';

export interface ExportFilterOptions {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  selectedDays: string[]; // List of YYYY-MM-DD date strings when in 'specific' mode
  selectionType: 'range' | 'specific';
  format: 'pdf' | 'csv';
}

interface AnalyticsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onExport: (options: ExportFilterOptions) => void;
}

export function AnalyticsExportModal({
  isOpen,
  onClose,
  title = "Export Analytics Report",
  description = "Select the day or days you want to export report for",
  onExport,
}: AnalyticsExportModalProps) {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const defaultStartDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  }, []);

  const [selectionType, setSelectionType] = useState<'range' | 'specific'>('range');
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(todayStr);
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');

  // Multi-day selection state
  const [selectedDays, setSelectedDays] = useState<string[]>([todayStr]);
  const [customDayInput, setCustomDayInput] = useState('');

  // Generate recent 14 days list for quick specific day toggles
  const recentDays = useMemo(() => {
    const days: { dateStr: string; label: string; dayOfWeek: string }[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });
      days.push({ dateStr, label, dayOfWeek });
    }
    return days;
  }, []);

  if (!isOpen) return null;

  const handleToggleSpecificDay = (dateStr: string) => {
    if (selectedDays.includes(dateStr)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== dateStr));
      }
    } else {
      setSelectedDays([...selectedDays, dateStr].sort());
    }
  };

  const handleAddCustomDay = () => {
    if (customDayInput && !selectedDays.includes(customDayInput)) {
      setSelectedDays([...selectedDays, customDayInput].sort());
      setCustomDayInput('');
    }
  };

  const applyPreset = (preset: 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth') => {
    const today = new Date();
    if (preset === 'today') {
      const dateStr = today.toISOString().split('T')[0];
      setStartDate(dateStr);
      setEndDate(dateStr);
      setSelectedDays([dateStr]);
    } else if (preset === 'yesterday') {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      const dateStr = y.toISOString().split('T')[0];
      setStartDate(dateStr);
      setEndDate(dateStr);
      setSelectedDays([dateStr]);
    } else if (preset === 'last7') {
      const d = new Date(today);
      d.setDate(d.getDate() - 7);
      const sStr = d.toISOString().split('T')[0];
      setStartDate(sStr);
      setEndDate(todayStr);

      // Populate selected days for last 7 days
      const daysArr: string[] = [];
      for (let i = 0; i <= 7; i++) {
        const cur = new Date(today);
        cur.setDate(cur.getDate() - i);
        daysArr.push(cur.toISOString().split('T')[0]);
      }
      setSelectedDays(daysArr);
    } else if (preset === 'last30') {
      const d = new Date(today);
      d.setDate(d.getDate() - 30);
      setStartDate(d.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (preset === 'thisMonth') {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setStartDate(first.toISOString().split('T')[0]);
      setEndDate(last.toISOString().split('T')[0]);
    }
  };

  const handleExportClick = () => {
    onExport({
      startDate,
      endDate,
      selectedDays,
      selectionType,
      format
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] border border-slate-100 shadow-2xl p-6 sm:p-8 relative max-h-[90vh] flex flex-col">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-all"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pr-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black shrink-0 shadow-sm">
            <Download size={26} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
            <p className="text-xs font-bold text-slate-400 mt-0.5">{description}</p>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">

          {/* Quick Presets */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
              Quick Date Presets
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset('today')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black transition-all"
              >
                Today (1 Day)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('yesterday')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black transition-all"
              >
                Yesterday (1 Day)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('last7')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black transition-all"
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => applyPreset('last30')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black transition-all"
              >
                Last 30 Days
              </button>
            </div>
          </div>

          {/* Selection Mode Tabs */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
              Select Export Day Method
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setSelectionType('range')}
                className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  selectionType === 'range' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Calendar size={14} />
                <span>Date Range / Single Day</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectionType('specific')}
                className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  selectionType === 'specific' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <CalendarDays size={14} />
                <span>Choose Specific Day(s)</span>
              </button>
            </div>
          </div>

          {/* Mode 1: Date Range or Single Day Picker */}
          {selectionType === 'range' ? (
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {startDate === endDate ? (
                <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-xl text-[11px] font-bold flex items-center gap-2">
                  <Clock size={14} />
                  <span>Single Day Export: <strong>{startDate}</strong></span>
                </div>
              ) : (
                <div className="px-3 py-2 bg-slate-200/60 text-slate-700 rounded-xl text-[11px] font-bold flex items-center gap-2">
                  <Calendar size={14} />
                  <span>Exporting range from <strong>{startDate}</strong> to <strong>{endDate}</strong></span>
                </div>
              )}
            </div>
          ) : (
            /* Mode 2: Specific Days Picker */
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <p className="text-xs font-bold text-slate-500">
                Tap days to toggle selection for export:
              </p>

              {/* Day chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {recentDays.map(({ dateStr, label, dayOfWeek }) => {
                  const isSelected = selectedDays.includes(dateStr);
                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => handleToggleSpecificDay(dateStr)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider opacity-80">{dayOfWeek}</p>
                        <p className="text-xs font-black">{label}</p>
                      </div>
                      {isSelected && <Check size={14} className="shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Specific Day */}
              <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2">
                <input
                  type="date"
                  value={customDayInput}
                  onChange={(e) => setCustomDayInput(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomDay}
                  disabled={!customDayInput}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-black text-xs rounded-xl transition-all"
                >
                  + Add Day
                </button>
              </div>

              <div className="text-[11px] font-bold text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                Selected Day(s): <span className="text-blue-600 font-black">{selectedDays.join(', ')}</span> ({selectedDays.length} day{selectedDays.length > 1 ? 's' : ''})
              </div>
            </div>
          )}

          {/* Export Format Option */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
              Export File Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                  format === 'pdf' 
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${format === 'pdf' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <FileText size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black">PDF Document</p>
                  <p className="text-[10px] font-bold text-slate-400">Formatted Report</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                  format === 'csv' 
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${format === 'csv' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <FileSpreadsheet size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black">CSV Spreadsheet</p>
                  <p className="text-[10px] font-bold text-slate-400">Raw Data Export</p>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-100 flex items-center gap-3 mt-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl border border-slate-200 text-slate-700 font-black text-xs hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExportClick}
            className="flex-1 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Download size={16} />
            <span>Generate & Export</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default AnalyticsExportModal;
