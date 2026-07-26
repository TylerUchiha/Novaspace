import React, { useState, useMemo } from 'react';
import { 
  Store, 
  DollarSign, 
  ShoppingBag, 
  Calendar, 
  TrendingUp, 
  Building, 
  Utensils, 
  CreditCard, 
  ChevronDown, 
  BarChart3, 
  PieChart, 
  Filter, 
  Layout, 
  ArrowUpRight,
  ArrowRight,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Reservation, LocationData, Vendor, Room } from '../types';
import { AnalyticsExportModal, ExportFilterOptions } from './AnalyticsExportModal';

interface StoreAnalyticsProps {
  locations: LocationData[];
  reservations: Reservation[];
  userRole: 'owner' | 'manager';
  currentLocationId?: string;
  vendors?: Vendor[];
}

type DateFilterType = 'today' | '7days' | '30days' | 'custom';
type BreakdownTabType = 'room' | 'menu';

const formatDateYYYYMMDD = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getTodayStr = () => formatDateYYYYMMDD(new Date());

const getDaysAgoStr = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return formatDateYYYYMMDD(d);
};

export const StoreAnalytics: React.FC<StoreAnalyticsProps> = ({
  locations,
  reservations,
  userRole,
  currentLocationId,
  vendors = []
}) => {
  const [dateFilter, setDateFilter] = useState<DateFilterType>('7days');
  const [customFromDate, setCustomFromDate] = useState<string>(() => getDaysAgoStr(7));
  const [customToDate, setCustomToDate] = useState<string>(() => getTodayStr());
  const [selectedLocationId, setSelectedLocationId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<BreakdownTabType>('room');
  const [showExportModal, setShowExportModal] = useState(false);

  const handleStoreExport = (options: ExportFilterOptions) => {
    const exportRes = reservations.filter(res => {
      if (selectedLocationId !== 'all' && res.locationId !== selectedLocationId) return false;
      const rDate = res.date || new Date(res.createdAt).toISOString().split('T')[0];
      if (options.selectionType === 'specific') {
        return options.selectedDays.includes(rDate);
      } else {
        return rDate >= options.startDate && rDate <= options.endDate;
      }
    });

    let totalRevenue = 0;
    exportRes.forEach(r => totalRevenue += (r.totalPrice || 0));

    if (options.format === 'csv') {
      let csv = "Reservation ID,Date,Location,Status,Total Price (EGP)\n";
      exportRes.forEach(r => {
        const locName = locations.find(l => l.id === r.locationId)?.name || r.locationId;
        csv += `"${r.id}","${r.date}","${locName}","${r.status}",${r.totalPrice || 0}\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `store_analytics_${options.startDate}_to_${options.endDate}.csv`);
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
    doc.text("STORE ANALYTICS REPORT", 14, y); y += 8;

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 14, y); y += 6;
    const daysText = options.selectionType === 'specific' ? options.selectedDays.join(', ') : `${options.startDate} to ${options.endDate}`;
    doc.text(`Reporting Period: ${daysText}`, 14, y); y += 12;

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`TOTAL STORE REVENUE: ${totalRevenue.toLocaleString()} EGP`, 14, y); y += 8;
    doc.setFontSize(11);
    doc.setFont("Helvetica", "normal");
    doc.text(`Total Bookings Processed: ${exportRes.length}`, 14, y); y += 12;

    doc.save(`store_analytics_${options.selectionType === 'specific' ? 'selected_days' : options.startDate + '_to_' + options.endDate}.pdf`);
  };

  // Filter reservations by selected location and date filter
  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      // Location filter
      if (selectedLocationId !== 'all' && res.locationId !== selectedLocationId) {
        return false;
      }

      // Date range filter
      const rDate = res.date || (res.createdAt ? new Date(res.createdAt).toISOString().split('T')[0] : '');
      if (customFromDate && rDate < customFromDate) return false;
      if (customToDate && rDate > customToDate) return false;
      return true;
    });
  }, [reservations, selectedLocationId, customFromDate, customToDate]);

  // All rooms map across locations
  const allRoomsMap = useMemo(() => {
    const map = new Map<string, { room: Room; locationName: string }>();
    locations.forEach(loc => {
      loc.floors.forEach(fl => {
        fl.rooms.forEach(rm => {
          map.set(rm.id, { room: rm, locationName: loc.name });
        });
      });
    });
    return map;
  }, [locations]);

  // All menu items map
  const allMenuItemsMap = useMemo(() => {
    const map = new Map<string, { name: string; price: number; category: string; image?: string }>();
    
    // Check vendors menu
    vendors.forEach(v => {
      v.menu?.forEach(m => {
        map.set(m.id, { name: m.name, price: m.price, category: m.category, image: m.image });
      });
    });

    // Check locations menu
    locations.forEach(loc => {
      loc.menu?.forEach(m => {
        map.set(m.id, { name: m.name, price: m.price, category: m.category, image: m.image });
      });
    });

    return map;
  }, [vendors, locations]);

  // Overall Financial & Booking Summary
  const totals = useMemo(() => {
    let totalIncome = 0;
    let roomIncome = 0;
    let menuIncome = 0;
    let totalBookings = filteredReservations.length;

    filteredReservations.forEach(res => {
      // Total price
      const price = res.totalPrice || 0;
      totalIncome += price;

      // Menu purchases
      let resMenuPrice = 0;
      if (res.selectedMenuItems && res.selectedMenuItems.length > 0) {
        res.selectedMenuItems.forEach(item => {
          const mMeta = allMenuItemsMap.get(item.itemId);
          const itemUnitPrice = mMeta?.price || 50;
          resMenuPrice += itemUnitPrice * item.quantity;
        });
      }

      menuIncome += resMenuPrice;
      const resRoomPrice = Math.max(0, price - resMenuPrice);
      roomIncome += resRoomPrice;
    });

    const avgBookingValue = totalBookings > 0 ? Math.round(totalIncome / totalBookings) : 0;

    return {
      totalBookings,
      totalIncome,
      roomIncome,
      menuIncome,
      avgBookingValue
    };
  }, [filteredReservations, allMenuItemsMap]);

  // 1. Income Breakdown By Room / Space
  const roomBreakdown = useMemo(() => {
    const roomStatsMap = new Map<string, {
      roomId: string;
      roomName: string;
      locationName: string;
      roomType: string;
      pricePerHour: number;
      bookingCount: number;
      totalHours: number;
      totalRevenue: number;
    }>();

    filteredReservations.forEach(res => {
      const roomMeta = allRoomsMap.get(res.roomId);
      const roomName = roomMeta?.room.name || `Room #${res.roomId.slice(-4)}`;
      const locationName = roomMeta?.locationName || 'Main Branch';
      const roomType = roomMeta?.room.type || 'Desk / Room';
      const pricePerHour = roomMeta?.room.pricePerHour || 50;

      const duration = res.duration || 1;

      // Calculate room component of price
      let resMenuPrice = 0;
      if (res.selectedMenuItems) {
        res.selectedMenuItems.forEach(mi => {
          const itemMeta = allMenuItemsMap.get(mi.itemId);
          resMenuPrice += (itemMeta?.price || 50) * mi.quantity;
        });
      }
      const roomRev = Math.max(0, (res.totalPrice || (pricePerHour * duration)) - resMenuPrice);

      const existing = roomStatsMap.get(res.roomId) || {
        roomId: res.roomId,
        roomName,
        locationName,
        roomType,
        pricePerHour,
        bookingCount: 0,
        totalHours: 0,
        totalRevenue: 0
      };

      existing.bookingCount += 1;
      existing.totalHours += duration;
      existing.totalRevenue += roomRev;

      roomStatsMap.set(res.roomId, existing);
    });

    const items = Array.from(roomStatsMap.values());
    items.sort((a, b) => b.totalRevenue - a.totalRevenue);
    return items;
  }, [filteredReservations, allRoomsMap, allMenuItemsMap]);

  // 2. Income Breakdown By Menu Item
  const menuBreakdown = useMemo(() => {
    const menuStatsMap = new Map<string, {
      itemId: string;
      name: string;
      category: string;
      unitPrice: number;
      quantitySold: number;
      totalRevenue: number;
      image?: string;
    }>();

    filteredReservations.forEach(res => {
      if (res.selectedMenuItems && res.selectedMenuItems.length > 0) {
        res.selectedMenuItems.forEach(item => {
          const meta = allMenuItemsMap.get(item.itemId);
          const name = meta?.name || `Item #${item.itemId.slice(-4)}`;
          const category = meta?.category || 'Menu & F&B';
          const unitPrice = meta?.price || 50;
          const rev = unitPrice * item.quantity;

          const existing = menuStatsMap.get(item.itemId) || {
            itemId: item.itemId,
            name,
            category,
            unitPrice,
            quantitySold: 0,
            totalRevenue: 0,
            image: meta?.image
          };

          existing.quantitySold += item.quantity;
          existing.totalRevenue += rev;
          menuStatsMap.set(item.itemId, existing);
        });
      }
    });

    const items = Array.from(menuStatsMap.values());
    items.sort((a, b) => b.totalRevenue - a.totalRevenue);
    return items;
  }, [filteredReservations, allMenuItemsMap]);

  // Origin & Payment Breakdown
  const originAndPaymentStats = useMemo(() => {
    let appBookings = 0;
    let instoreBookings = 0;
    let cardRev = 0;
    let instapayRev = 0;
    let novaPointsRev = 0;

    filteredReservations.forEach(res => {
      if (res.origin === 'instore' || res.hasInstorePurchases) {
        instoreBookings++;
      } else {
        appBookings++;
      }

      const p = res.totalPrice || 0;
      if (res.paymentMethod === 'instapay') {
        instapayRev += p;
      } else if (res.paymentMethod === 'novapoints' || res.paymentMethod === 'credits') {
        novaPointsRev += p;
      } else {
        cardRev += p;
      }
    });

    return {
      appBookings,
      instoreBookings,
      cardRev,
      instapayRev,
      novaPointsRev
    };
  }, [filteredReservations]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50/60 p-6 md:p-10 font-sans overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-8">

        {/* Top Header & Date / Location Filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                <Store size={24} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Store Revenue & Analytics</h1>
            </div>
            <p className="text-slate-500 text-xs font-medium ml-1">
              Comprehensive breakdown of total bookings, revenue streams, room income vs menu item performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Location Filter */}
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-2xl border border-slate-200 text-xs font-bold">
              <Building size={16} className="text-slate-500" />
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="bg-transparent outline-none text-slate-900 cursor-pointer font-black"
              >
                <option value="all">All Branches</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>

            {/* Date Quick Presets Pill */}
            <div className="flex items-center gap-6 bg-slate-100/90 px-6 py-2.5 rounded-full border border-slate-200/80 text-xs shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setDateFilter('today');
                  setCustomFromDate(getTodayStr());
                  setCustomToDate(getTodayStr());
                }}
                className={`font-black transition-colors cursor-pointer ${
                  dateFilter === 'today' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  setDateFilter('7days');
                  setCustomFromDate(getDaysAgoStr(7));
                  setCustomToDate(getTodayStr());
                }}
                className={`font-black transition-colors cursor-pointer ${
                  dateFilter === '7days' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => {
                  setDateFilter('30days');
                  setCustomFromDate(getDaysAgoStr(30));
                  setCustomToDate(getTodayStr());
                }}
                className={`font-black transition-colors cursor-pointer ${
                  dateFilter === '30days' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                30 Days
              </button>
            </div>

            {/* Date Range Inputs Pill */}
            <div className="flex items-center gap-2 bg-slate-100/90 px-5 py-2 rounded-full border border-slate-200/80 text-xs shadow-2xs">
              <div className="relative flex items-center gap-1">
                <input
                  type="date"
                  value={customFromDate}
                  onChange={(e) => {
                    setCustomFromDate(e.target.value);
                    setDateFilter('custom');
                  }}
                  className="bg-transparent font-black text-slate-800 text-xs cursor-pointer focus:outline-none focus:text-blue-600 font-mono tracking-tight"
                />
              </div>

              <ArrowRight size={14} className="text-slate-400 shrink-0 mx-1" />

              <div className="relative flex items-center gap-1">
                <input
                  type="date"
                  value={customToDate}
                  onChange={(e) => {
                    setCustomToDate(e.target.value);
                    setDateFilter('custom');
                  }}
                  className="bg-transparent font-black text-slate-800 text-xs cursor-pointer focus:outline-none focus:text-blue-600 font-mono tracking-tight"
                />
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Download size={14} />
              <span>Export</span>
            </button>
          </div>
        </div>



        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Bookings</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{totals.totalBookings}</p>
              <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <Calendar size={12} /> Reservations
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Calendar size={22} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Gross Income</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{totals.totalIncome.toLocaleString()} EGP</p>
              <p className="text-[11px] text-blue-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp size={12} /> Combined Revenue
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <DollarSign size={22} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Space / Room Revenue</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{totals.roomIncome.toLocaleString()} EGP</p>
              <p className="text-[11px] text-purple-600 font-bold mt-1 flex items-center gap-1">
                <Layout size={12} /> {totals.totalIncome > 0 ? Math.round((totals.roomIncome / totals.totalIncome) * 100) : 0}% of Total
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Layout size={22} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Menu / F&B Income</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{totals.menuIncome.toLocaleString()} EGP</p>
              <p className="text-[11px] text-amber-600 font-bold mt-1 flex items-center gap-1">
                <Utensils size={12} /> {totals.totalIncome > 0 ? Math.round((totals.menuIncome / totals.totalIncome) * 100) : 0}% of Total
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Utensils size={22} />
            </div>
          </div>
        </div>

        {/* Origin Breakdown Secondary Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <ShoppingBag size={18} className="text-blue-600" />
              Booking Origin
            </h3>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">Channels</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-700">Mobile App Online Bookings</span>
              <span className="font-black text-slate-900 font-mono">{originAndPaymentStats.appBookings} Bookings</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-700">In-Store Counter Purchases</span>
              <span className="font-black text-slate-900 font-mono">{originAndPaymentStats.instoreBookings} Purchases</span>
            </div>
          </div>
        </div>

        {/* ----------------- REVENUE BREAKDOWN SPLIT ----------------- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-sm p-8 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black text-slate-900">Revenue Stream Breakdown</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Inspect income sources categorised specifically by room architecture vs individual menu items.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* SECTION 1: INCOME BY ROOM / SPACE */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Layout size={16} />
                </div>
                <h4 className="font-black text-slate-900 text-sm">Income by Room / Space</h4>
              </div>

              {roomBreakdown.length === 0 ? (
                <div className="py-12 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <Layout size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="font-bold text-xs">No room reservation income recorded.</p>
                </div>
              ) : (
                <div className="max-h-[320px] overflow-y-auto overflow-x-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                      <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-3">Space / Room</th>
                        <th className="py-3 px-3 text-center">Bookings</th>
                        <th className="py-3 px-3 text-center">Hours</th>
                        <th className="py-3 px-3 text-right">Revenue</th>
                        <th className="py-3 px-3 text-right">% Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {roomBreakdown.map((item) => {
                        const pct = totals.roomIncome > 0 ? Math.round((item.totalRevenue / totals.roomIncome) * 100) : 0;
                        return (
                          <tr key={item.roomId} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-3 font-black text-slate-900 flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
                                <Layout size={14} />
                              </div>
                              <span className="truncate">{item.roomName}</span>
                            </td>
                            <td className="py-3.5 px-3 text-center font-bold font-mono text-slate-800">{item.bookingCount}</td>
                            <td className="py-3.5 px-3 text-center font-bold font-mono text-slate-800">{item.totalHours}h</td>
                            <td className="py-3.5 px-3 text-right font-black font-mono text-emerald-600 text-xs">
                              {item.totalRevenue.toLocaleString()} EGP
                            </td>
                            <td className="py-3.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <span className="font-mono font-bold text-slate-500 text-[10px]">{pct}%</span>
                                <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden shrink-0">
                                  <div className="bg-purple-600 h-full" style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* SECTION 2: INCOME BY MENU ITEM */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Utensils size={16} />
                </div>
                <h4 className="font-black text-slate-900 text-sm">Income by Menu Item</h4>
              </div>

              {menuBreakdown.length === 0 ? (
                <div className="py-12 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <Utensils size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="font-bold text-xs">No menu purchases recorded.</p>
                </div>
              ) : (
                <div className="max-h-[320px] overflow-y-auto overflow-x-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                      <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-3">Menu Item</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3 text-center">Sold</th>
                        <th className="py-3 px-3 text-right">Income</th>
                        <th className="py-3 px-3 text-right">% Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {menuBreakdown.map((item) => {
                        const pct = totals.menuIncome > 0 ? Math.round((item.totalRevenue / totals.menuIncome) * 100) : 0;
                        return (
                          <tr key={item.itemId} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-3 font-black text-slate-900 flex items-center gap-2.5">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0" />
                              ) : (
                                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                                  <Utensils size={14} />
                                </div>
                              )}
                              <span className="truncate">{item.name}</span>
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 font-bold text-[10px] border border-amber-200/50">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-center font-black font-mono text-slate-900">{item.quantitySold}</td>
                            <td className="py-3.5 px-3 text-right font-black font-mono text-emerald-600 text-xs">
                              {item.totalRevenue.toLocaleString()} EGP
                            </td>
                            <td className="py-3.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <span className="font-mono font-bold text-slate-500 text-[10px]">{pct}%</span>
                                <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden shrink-0">
                                  <div className="bg-amber-500 h-full" style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <AnalyticsExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Store Analytics"
        description="Choose single day or date range for store performance report"
        onExport={handleStoreExport}
      />
    </div>
  );
};

export default StoreAnalytics;
