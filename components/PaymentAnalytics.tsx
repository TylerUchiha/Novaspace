import React, { useState, useMemo } from 'react';
import { Reservation, LocationData } from '../types';
import { Calendar, CreditCard, Download, ArrowRight, Activity, Wallet, Coins, Landmark, Banknote } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { AnalyticsExportModal, ExportFilterOptions } from './AnalyticsExportModal';

interface PaymentAnalyticsProps {
  locations: LocationData[];
  reservations: Reservation[];
  userRole: 'owner' | 'manager' | 'employee' | 'customer';
  currentLocationId?: string;
}

export const PaymentAnalytics: React.FC<PaymentAnalyticsProps> = ({ locations, reservations, userRole, currentLocationId }) => {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  const defaultStartDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  }, []);

  const [startDate, setStartDate] = useState<string>(defaultStartDate);
  const [endDate, setEndDate] = useState<string>(todayStr);
  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    userRole === 'owner' ? 'all' : (currentLocationId || 'all')
  );

  const [showPdfExportModal, setShowPdfExportModal] = useState(false);
  const [pdfStartDate, setPdfStartDate] = useState(defaultStartDate);
  const [pdfEndDate, setPdfEndDate] = useState(todayStr);

  const startMs = useMemo(() => startDate ? new Date(startDate).setHours(0, 0, 0, 0) : 0, [startDate]);
  const endMs = useMemo(() => endDate ? new Date(endDate).setHours(23, 59, 59, 999) : Infinity, [endDate]);

  const targetReservations = useMemo(() => {
    return reservations.filter(res => {
      // Allow confirmed bookings
      if (res.status !== 'approved') return false;

      // Ensure reservation is within the selected range (uses createdAt)
      if (res.createdAt < startMs || res.createdAt > endMs) return false;

      // Filter by location if specified
      if (selectedLocationId !== 'all') {
        if (res.locationId !== selectedLocationId) return false;
      }

      return true;
    });
  }, [reservations, startMs, endMs, selectedLocationId]);

  const paymentStats = useMemo(() => {
    let cash = 0;
    let cardApp = 0;
    let cardInstore = 0;
    let instapay = 0;
    let novapoints = 0;

    targetReservations.forEach(res => {
      let resPrice = 0;
      if (res.totalPrice !== undefined) {
        resPrice = res.totalPrice;
      } else {
        const loc = locations.find(l => l.id === res.locationId);
        const floor = loc?.floors.find(f => f.id === res.floorId);
        const room = floor?.rooms.find(r => r.id === res.roomId);
        if (room) {
          resPrice += room.pricePerHour * res.duration;
        }
      }

      const method = res.paymentMethod?.toLowerCase() || 'unknown';
      if (method === 'cash') cash += resPrice;
      else if (method === 'card' || method === 'pos') {
        if (res.origin === 'instore') cardInstore += resPrice;
        else cardApp += resPrice;
      }
      else if (method === 'instapay') instapay += resPrice;
      else if (method === 'novapoints' || method === 'credits') novapoints += resPrice;
    });

    return {
      cash,
      cardApp,
      cardInstore,
      instapay,
      novapoints,
      total: cash + cardApp + cardInstore + instapay + novapoints
    };
  }, [targetReservations, locations]);

  const handleAnalyticsExport = (options: ExportFilterOptions) => {
    const exportRes = reservations.filter(res => {
      if (res.status !== 'approved') return false;
      if (selectedLocationId !== 'all' && res.locationId !== selectedLocationId) return false;
      
      const rDate = res.date || new Date(res.createdAt).toISOString().split('T')[0];
      if (options.selectionType === 'specific') {
        return options.selectedDays.includes(rDate);
      } else {
        return rDate >= options.startDate && rDate <= options.endDate;
      }
    });

    let cash = 0, card = 0, instapay = 0, novapoints = 0;
    exportRes.forEach(res => {
      let resPrice = res.totalPrice || 0;
      if (!resPrice) {
        const loc = locations.find(l => l.id === res.locationId);
        const room = loc?.floors.find(f => f.id === res.floorId)?.rooms.find(r => r.id === res.roomId);
        if (room) resPrice = room.pricePerHour * res.duration;
      }
      const method = res.paymentMethod?.toLowerCase() || '';
      if (method === 'cash') cash += resPrice;
      else if (method === 'card' || method === 'pos') card += resPrice;
      else if (method === 'instapay') instapay += resPrice;
      else if (method === 'novapoints' || method === 'credits') novapoints += resPrice;
    });

    const total = cash + card + instapay + novapoints;

    if (options.format === 'csv') {
      let csv = "Payment Method,Revenue (EGP)\n";
      csv += `"Instapay",${instapay}\n`;
      csv += `"Cash",${cash}\n`;
      csv += `"Card / POS",${card}\n`;
      csv += `"NovaPoints",${novapoints}\n`;
      csv += `"Total",${total}\n`;
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payment_analytics_${options.startDate}_to_${options.endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const doc = new jsPDF();
    let y = 20;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); 
    doc.text("PAYMENT METHODS ANALYTICS", 14, y); y += 8;

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 14, y); y += 6;
    const daysText = options.selectionType === 'specific' ? options.selectedDays.join(', ') : `${options.startDate} to ${options.endDate}`;
    doc.text(`Reporting Period: ${daysText}`, 14, y); y += 12;

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`TOTAL REVENUE: ${total.toLocaleString()} EGP`, 14, y); y += 10;

    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    doc.text(`Instapay: ${instapay.toLocaleString()} EGP`, 14, y); y += 6;
    doc.text(`Cash: ${cash.toLocaleString()} EGP`, 14, y); y += 6;
    doc.text(`Card / POS: ${card.toLocaleString()} EGP`, 14, y); y += 6;
    doc.text(`NovaPoints: ${novapoints.toLocaleString()} EGP`, 14, y); y += 6;

    doc.save(`Novaspace_Payments_Analytics_${options.selectionType === 'specific' ? 'selected_days' : options.startDate + '_to_' + options.endDate}.pdf`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 relative">
      <div className="p-6 md:p-10 border-b border-slate-200 bg-white shadow-sm relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 text-emerald-600">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <CreditCard size={20} strokeWidth={2.5} />
              </div>
              <span className="font-black text-sm uppercase tracking-[0.2em]">Financials</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Payment Methods</h1>
            <p className="text-slate-500 font-bold mt-2">Revenue breakdown by payment method</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1 shadow-inner mr-2">
              <button 
                onClick={() => { setStartDate(todayStr); setEndDate(todayStr); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${startDate === todayStr && endDate === todayStr ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Today
              </button>
              <button 
                onClick={() => { 
                  const d = new Date(); d.setDate(d.getDate() - 7); 
                  setStartDate(d.toISOString().split('T')[0]); 
                  setEndDate(todayStr); 
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${startDate !== todayStr && endDate === todayStr && new Date(startDate).getTime() === new Date().setHours(0,0,0,0) - 7 * 86400000 ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                7 Days
              </button>
              <button 
                onClick={() => { 
                  const d = new Date(); d.setMonth(d.getMonth() - 1); 
                  setStartDate(d.toISOString().split('T')[0]); 
                  setEndDate(todayStr); 
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${startDate !== todayStr && endDate === todayStr && new Date(startDate).getTime() === new Date().setHours(0,0,0,0) - 30 * 86400000 ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                30 Days
              </button>
            </div>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1 shadow-inner">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-700 outline-none px-3 py-2 cursor-pointer"
              />
              <span className="text-slate-300 mx-1"><ArrowRight size={14} /></span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-700 outline-none px-3 py-2 cursor-pointer"
              />
            </div>
            {userRole === 'owner' && (
              <select 
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="bg-white border border-slate-200 text-sm font-bold text-slate-700 rounded-2xl px-4 py-3 outline-none hover:border-slate-300 transition-colors cursor-pointer shadow-sm"
              >
                <option value="all">Global (All Locations)</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            )}
            <button 
              onClick={() => setShowPdfExportModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-bold shadow-md hover:shadow-xl text-sm whitespace-nowrap"
            >
              <Download size={16} /> Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-3 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue in Period</p>
                 <p className="text-4xl font-black text-emerald-600">{paymentStats.total.toLocaleString()} EGP</p>
               </div>
               <div className="w-16 h-16 rounded-[2rem] bg-emerald-50 text-emerald-600 flex items-center justify-center">
                 <Activity size={32} />
               </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                  <Banknote size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-full">Instapay</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{paymentStats.instapay.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">EGP Income</p>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl">
                  <Wallet size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-full">Cash</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{paymentStats.cash.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">EGP Income</p>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <CreditCard size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-full">Card / POS (App)</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{paymentStats.cardApp.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">EGP Income</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <CreditCard size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-full">Card / POS (In-store)</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{paymentStats.cardInstore.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">EGP Income</p>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Coins size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-full">NovaPoints</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{paymentStats.novapoints.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">EGP Income</p>
            </div>
          </div>
        </div>
      </div>

      <AnalyticsExportModal
        isOpen={showPdfExportModal}
        onClose={() => setShowPdfExportModal(false)}
        title="Export Payment Analytics"
        description="Choose single day or date range for payments report"
        onExport={handleAnalyticsExport}
      />
    </div>
  );
};

export default PaymentAnalytics;
