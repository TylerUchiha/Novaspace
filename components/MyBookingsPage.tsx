
import React, { useState, useEffect } from 'react';
import { Reservation, LocationData, Vendor } from '../types';
import { Calendar, Clock, MapPin, XCircle, CheckCircle2, History, ShieldCheck, AlertCircle, Upload, Check, Loader2, Banknote, ArrowRight, X } from 'lucide-react';

const formatTimeLeft = (ms: number) => {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

interface MyBookingsPageProps {
  reservations: Reservation[];
  locations: LocationData[];
  vendors: Vendor[];
  userName: string;
  onCancel: (id: string) => void;
  onFinalizeInstapay?: (id: string, payerAddress: string, receiptImage: string, ownerInstapayAccount: string) => void;
  simulatedTimeMs?: number;
}

interface BookingCardProps {
  res: Reservation;
  isCurrent: boolean;
  onCancel: (id: string) => void;
  locationName: string;
  vendor: Vendor | undefined;
  now: number;
  onFinalize: (res: Reservation) => void;
  getMenuItemName: (res: Reservation, itemId: string) => string;
  onClick?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ res, isCurrent, onCancel, locationName, vendor, now, onFinalize, onClick, getMenuItemName }) => {
  const isInstapay = res.paymentMethod === 'instapay';
  const isSubmitted = !!res.instapayDetails?.submittedAt;
  const isPendingInstapay = isInstapay && !isSubmitted && res.status !== 'declined';
  const elapsed = now - res.createdAt;
  const timeLeft = Math.max(0, 180000 - elapsed);

  return (
    <div onClick={onClick} className={`bg-white p-6 rounded-3xl border transition-all hover:shadow-md ${onClick ? 'cursor-pointer' : ''} ${
      isPendingInstapay 
        ? 'border-amber-400 bg-amber-50/10 shadow-[0_0_20px_rgba(245,158,11,0.15)] animate-[pulse_2s_infinite]' 
        : res.status === 'declined' || res.status === 'cancelled' || res.status === 'resolved'
          ? 'border-slate-100 opacity-60' 
          : 'border-slate-100 shadow-sm'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${res.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : res.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
            {res.status === 'approved' ? <CheckCircle2 size={20} /> : res.status === 'pending' ? <Clock size={20} /> : <XCircle size={20} />}
          </div>
          <div>
            <h4 className="font-black text-slate-900 tracking-tight">{locationName}</h4>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <MapPin size={10} />
              Floor {res.floorId.split('-').pop()} • Room {res.roomId.split('-').pop()}
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${res.status === 'approved' ? 'bg-emerald-500 text-white' : res.status === 'pending' ? 'bg-amber-500 text-white' : res.status === 'cancelled' || res.status === 'declined' || res.status === 'resolved' ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-500'}`}>
          {isPendingInstapay ? 'awaiting payment' : res.status === 'resolved' ? 'cancelled' : res.status}
        </div>
      </div>

      {/* Instapay Alert Block */}
      {isPendingInstapay && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200/50 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertCircle size={15} className="shrink-0 animate-bounce" />
            <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Instapay Transfer</span>
          </div>
          <p className="text-[10px] font-bold text-amber-700 leading-snug">
            Please transfer the amount and upload your receipt within 3 minutes, or this reservation will be cancelled.
          </p>
          <div className="flex items-center justify-between mt-1 pt-2 border-t border-amber-200/30">
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Time Remaining:</span>
            <span className="text-xs font-black text-amber-600 font-mono bg-white px-2.5 py-1 rounded-lg border border-amber-200">
              {formatTimeLeft(timeLeft)}
            </span>
          </div>
        </div>
      )}

      {/* Instapay Submitted Block */}
      {isInstapay && isSubmitted && res.status === 'pending' && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest">Receipt Uploaded</span>
          </div>
          <p className="text-[10px] font-bold text-emerald-700 leading-snug">
            We are verifying your transfer. You'll receive a confirmation shortly.
          </p>
          {res.instapayDetails?.payerAddress && (
            <div className="text-[8px] font-black text-slate-400 mt-1 uppercase tracking-wider">
              From: <span className="text-slate-600 font-mono font-black">{res.instapayDetails.payerAddress}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-slate-500">
          <Calendar size={14} className="text-slate-300" />
          <span className="text-xs font-bold">{res.date}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Clock size={14} className="text-slate-300" />
          <span className="text-xs font-bold">{res.time} ({res.duration}h)</span>
        </div>
      </div>

      {res.selectedMenuItems && res.selectedMenuItems.length > 0 && (
        <div className="mb-6 p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Add-ons</p>
          <div className="flex flex-wrap gap-2">
            {res.selectedMenuItems.map((item, idx) => {
              const itemName = getMenuItemName(res, item.itemId);
              return (
                <div key={idx} className="flex flex-col bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-blue-600">{item.quantity}x</span>
                    <span className="text-[10px] font-bold text-slate-700">{itemName}</span>
                  </div>
                  {item.deliveryTime && (
                    <span className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">{item.deliveryTime}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isPendingInstapay && (
        <button 
          onClick={(e) => { e.stopPropagation(); onFinalize(res); }}
          className="w-full mb-2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-widest hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 active:scale-[0.98]"
        >
          <Banknote size={14} />
          Finalize Payment
        </button>
      )}

      {(isCurrent || res.status === 'pending') && res.status !== 'declined' && res.status !== 'cancelled' && (
        <button 
          onClick={(e) => { e.stopPropagation(); onCancel(res.id); }}
          className="w-full py-3 rounded-xl bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <XCircle size={14} />
          Cancel Booking
        </button>
      )}
    </div>
  );
};

const MyBookingsPage: React.FC<MyBookingsPageProps> = ({ reservations, locations, vendors, userName, onCancel, onFinalizeInstapay, simulatedTimeMs }) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  
  // Instapay-specific states
  const [finalizingRes, setFinalizingRes] = useState<Reservation | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [payerAddress, setPayerAddress] = useState('');
  const [receiptImage, setReceiptImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedResDetails, setSelectedResDetails] = useState<Reservation | null>(null);

  // 1-second interval to update 'now' and trigger re-renders for countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Automatic cancellation of pending Instapay bookings after 3 minutes (180,000ms)
  useEffect(() => {
    reservations.forEach(res => {
      const isInstapay = res.paymentMethod === 'instapay';
      const isSubmitted = !!res.instapayDetails?.submittedAt;
      const isPendingInstapay = isInstapay && !isSubmitted && res.status !== 'declined';
      if (isPendingInstapay) {
        const elapsed = now - res.createdAt;
        if (elapsed >= 180000) {
          onCancel(res.id);
        }
      }
    });
  }, [now, reservations, onCancel]);

  const userReservations = reservations.filter(r => r.userName === userName);
  
  const isReservationInPast = (res: Reservation, nowMs: number) => {
    try {
      const [year, month, day] = res.date.split('-').map(Number);
      const [hour, min] = res.time.split(':').map(Number);
      const dateObj = new Date(year, month - 1, day, hour, min);
      const endTimeMs = dateObj.getTime() + (res.duration * 3600000);
      return endTimeMs < nowMs;
    } catch (e) {
      return false;
    }
  };

  const currentBookings = userReservations.filter(r => {
    // Show all pending reservations (awaiting action), and approved reservations that are in the future or present
    if (r.status === 'pending') return true;
    if (r.status === 'approved') return !isReservationInPast(r, simulatedTimeMs || now);
    return false;
  }).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const previousBookings = userReservations.filter(r => {
    // Show declined/cancelled reservations OR approved reservations that are in the past
    if (r.status === 'declined' || r.status === 'cancelled' || r.status === 'resolved') return true;
    if (r.status === 'approved') return isReservationInPast(r, simulatedTimeMs || now);
    return false;
  }).sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

  const getLocationName = (id: string) => locations.find(l => l.id === id)?.name || 'Unknown Location';

  const getMenuItemName = (res: Reservation, itemId: string) => {
    let item = vendors.find(v => v.id === res.vendorId)?.menu?.find(m => m.id === itemId);
    if (!item) {
      item = locations.find(l => l.id === res.locationId)?.menu?.find(m => m.id === itemId);
    }
    if (!item) {
      const loc = locations.find(l => l.id === res.locationId);
      const floor = loc?.floors.find(f => f.id === res.floorId);
      const room = floor?.rooms.find(r => r.id === res.roomId);
      item = room?.menu?.find(m => m.id === itemId);
    }
    return item?.name || 'Item';
  };


  const handleCancelClick = (id: string) => {
    setCancellingId(id);
  };

  const confirmCancel = () => {
    if (cancellingId) {
      onCancel(cancellingId);
      setCancellingId(null);
    }
  };

  const cancellingRes = cancellingId ? reservations.find(r => r.id === cancellingId) : null;
  const cancellingVendor = cancellingRes ? vendors.find(v => v.id === cancellingRes.vendorId) : null;
  const cancellingLocation = cancellingRes ? locations.find(l => l.id === cancellingRes.locationId) : null;
  const currentPolicy = cancellingLocation?.cancellationPolicy || cancellingVendor?.cancellationPolicy;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const useSampleReceipt = () => {
    setIsUploading(true);
    setTimeout(() => {
      setReceiptImage('https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400&h=600');
      setIsUploading(false);
    }, 400);
  };

  const handleDone = () => {
    if (!finalizingRes) return;
    
    // Process payer address: append @instapay if not already present
    let finalAddress = payerAddress.trim();
    if (finalAddress && !finalAddress.toLowerCase().includes('@instapay')) {
      finalAddress = `${finalAddress}@instapay`;
    }
    
    const branch = locations.find(l => l.id === finalizingRes.locationId);
    const ownerInstapay = branch?.instapayAddress || 'payments@instapay';
    
    if (onFinalizeInstapay) {
      onFinalizeInstapay(finalizingRes.id, finalAddress || 'user@instapay', receiptImage || 'sample_receipt.png', ownerInstapay);
    }
    
    setFinalizingRes(null);
    setPayerAddress('');
    setReceiptImage('');
    setShowThankYou(true);
  };

  // Find finalizing res branch instapay destination
  const finalizingBranch = finalizingRes ? locations.find(l => l.id === finalizingRes.locationId) : null;
  const targetInstapayAccount = finalizingBranch?.instapayAddress || 'payments@instapay';

  // Calculate total price for finalizing reservation
  const finalizingTotalPrice = (() => {
    if (!finalizingRes) return 0;
    // Distribute price or get reservation total price
    const resGroup = reservations.filter(r => 
      r.userName === finalizingRes.userName && 
      r.date === finalizingRes.date && 
      r.time === finalizingRes.time && 
      r.createdAt === finalizingRes.createdAt
    );
    const reservationPrice = resGroup.reduce((sum, res) => {
      const loc = locations.find(l => l.id === res.locationId);
      const room = loc?.floors.flatMap(f => f.rooms).find(room => room.id === res.roomId);
      return sum + (room?.pricePerHour || 0) * res.duration;
    }, 0);
    const inStorePrice = resGroup.reduce((sum, res) => {
      const itemsSum = res.selectedMenuItems?.reduce((itemSum, item) => {
        const menuItem = vendors.find(v => v.id === res.vendorId)?.menu?.find(m => m.id === item.itemId) || vendors.flatMap(v => v.menu || []).find(m => m.id === item.itemId);
        return itemSum + (menuItem?.price || 0) * item.quantity;
      }, 0) || 0;
      return sum + itemsSum;
    }, 0);
    return reservationPrice + inStorePrice;
  })();

  return (
    <div className="flex-1 bg-slate-50/30 overflow-y-auto p-10 font-['Inter'] relative">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">My Bookings</h2>
          <p className="text-slate-500 font-medium italic">Manage your workspace reservations across the network.</p>
        </header>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg">
              <Calendar size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Active & Upcoming</h3>
          </div>
          
          {currentBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentBookings.map(res => (
                <BookingCard 
                  key={res.id} 
                  res={res} 
                  isCurrent={true} 
                  onCancel={handleCancelClick} 
                  locationName={getLocationName(res.locationId)} 
                  vendor={vendors.find(v => v.id === res.vendorId)} 
                  now={now}
                  onFinalize={setFinalizingRes}
                  getMenuItemName={getMenuItemName}
                  onClick={() => setSelectedResDetails(res)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} />
              </div>
              <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No active bookings found</p>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-slate-900 p-2 rounded-xl text-white shadow-lg">
              <History size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Booking History</h3>
          </div>

          {previousBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previousBookings.map(res => (
                <BookingCard 
                  key={res.id} 
                  res={res} 
                  isCurrent={false} 
                  onCancel={handleCancelClick} 
                  locationName={getLocationName(res.locationId)} 
                  vendor={vendors.find(v => v.id === res.vendorId)} 
                  now={now}
                  onFinalize={setFinalizingRes}
                  getMenuItemName={getMenuItemName}
                  onClick={() => setSelectedResDetails(res)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-dashed border-slate-200">
              <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No previous bookings</p>
            </div>
          )}
        </section>
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancellingId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setCancellingId(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 text-center animate-in zoom-in-95">
             <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 text-rose-600 bg-rose-50">
                <AlertCircle size={40} />
             </div>
             <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Cancel Booking?</h3>
             <p className="text-slate-500 font-bold mb-6">
               Are you sure you want to cancel your reservation at <span className="text-slate-900">{getLocationName(cancellingRes?.locationId || '')}</span>?
             </p>
             
             <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-left">
               <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <ShieldCheck size={14} />
                 Cancellation Policy
               </p>
               <p className="text-[11px] font-medium text-rose-500 leading-relaxed italic">
                 "{currentPolicy || 'No custom policy set for this branch (inheriting brand-wide fallback)'}"
               </p>
             </div>
             
             <div className="flex gap-4">
                <button onClick={() => setCancellingId(null)} className="flex-1 py-4 bg-slate-50 text-slate-400 font-black rounded-2xl uppercase tracking-widest text-xs">Keep Booking</button>
                <button onClick={confirmCancel} className="flex-[2] py-4 bg-rose-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-rose-100">Confirm Cancellation</button>
             </div>
          </div>
        </div>
      )}

      {/* POPUP 1: Finalize Instapay Payment Modal */}
      {finalizingRes && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setFinalizingRes(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                  <Banknote size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Finalize Instapay</h3>
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-0.5">Secure mobile transfer</p>
                </div>
              </div>
              <button onClick={() => setFinalizingRes(null)} className="text-slate-300 hover:text-slate-600 p-2 transition-colors"><XCircle size={20} /></button>
            </div>

            <div className="space-y-6">
              {/* Destination address */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <ArrowRight size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Instapay Destination</p>
                    {finalizingBranch?.instapayType && (
                      <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">{finalizingBranch.instapayType === 'account' ? 'Instapay Account' : finalizingBranch.instapayType === 'wallet' ? 'Mobile Wallet' : 'Phone Number'}</span>
                    )}
                  </div>
                  <p className="text-sm font-black text-slate-800 mt-1 select-all font-mono">{targetInstapayAccount}</p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Copy this payment address or phone number</p>
                </div>
              </div>

              {(!finalizingBranch?.instapayType || finalizingBranch.instapayType === 'account') && finalizingBranch?.instapayQrCode && (
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Scan to Pay</p>
                  <img src={finalizingBranch.instapayQrCode} alt="Payment QR Code" className="w-32 h-32 object-contain bg-white rounded-xl shadow-sm border border-slate-100 p-2" />
                </div>
              )}

              {/* Amount detail */}
              <div className="flex justify-between items-center py-4 px-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">Total Due Amount</span>
                <span className="text-xl font-black text-emerald-600">{finalizingTotalPrice.toLocaleString()} EGP</span>
              </div>

              {/* Image Receipt Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Upload Transfer Receipt</label>
                {receiptImage ? (
                  <div className="relative group rounded-2xl overflow-hidden border border-slate-100 aspect-video bg-slate-50 flex items-center justify-center shadow-inner">
                    <img src={receiptImage} alt="Receipt preview" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="p-3 bg-white text-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors shadow-lg text-xs font-black uppercase tracking-wider">
                        Change Image
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                      <button onClick={() => setReceiptImage('')} className="p-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors shadow-lg text-xs font-black uppercase tracking-wider">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 transition-all bg-slate-50/50">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 mb-4 group-hover:scale-105 transition-transform">
                        {isUploading ? <Loader2 size={24} className="animate-spin text-blue-500" /> : <Upload size={24} />}
                      </div>
                      <p className="text-xs font-black text-slate-700 uppercase tracking-wider">Select payment receipt</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">PNG, JPG up to 5MB</p>
                      <div className="flex items-center gap-3 mt-4">
                        <label className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all text-[10px] font-black uppercase tracking-wider shadow-sm">
                          Browse File
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                        <button onClick={useSampleReceipt} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all text-[10px] font-black uppercase tracking-wider">
                          Use Sample Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Payer instapay Address */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Your Instapay Address or Number</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={payerAddress}
                    onChange={(e) => setPayerAddress(e.target.value)}
                    placeholder="e.g. 01001234567 or account_username"
                    className="w-full pr-28 pl-4 py-3.5 rounded-2xl border-2 border-slate-100 text-xs font-black uppercase tracking-wider text-slate-800 outline-none focus:border-blue-500 transition-all bg-white"
                  />
                  <span className="absolute right-3 text-[10px] font-black text-slate-400 select-none uppercase tracking-widest pointer-events-none bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                    @instapay
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 italic mt-1">The @instapay address will be validated as standard.</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-50">
                <button onClick={() => setFinalizingRes(null)} className="flex-1 py-4 bg-slate-50 text-slate-400 font-black rounded-2xl uppercase tracking-widest text-xs">Cancel</button>
                <button 
                  onClick={handleDone}
                  disabled={!receiptImage || !payerAddress.trim() || isUploading}
                  className="flex-[2] py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: Thank You and Wait for Confirmation Modal */}
      {showThankYou && (
        <div className="fixed inset-0 z-[260] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowThankYou(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 text-center animate-in zoom-in-95">
            <div className="w-24 h-24 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-inner animate-[pulse_2s_infinite]">
              <Check size={48} className="stroke-[3]" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Thank You!</h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-4">Transfer Receipt Received</p>
            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
              We have successfully received your Instapay transfer information and receipt image. Please wait while our team reviews the details and confirms your reservation.
            </p>
            <button 
              onClick={() => setShowThankYou(false)}
              className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-emerald-100"
            >
              Continue to Bookings
            </button>
          </div>
        </div>
      )}

      {/* Reservation Details Modal */}
      {selectedResDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedResDetails(null)}>
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Booking Details</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {vendors.find(v => v.id === selectedResDetails.vendorId)?.name || 'Coworking Space'} • {getLocationName(selectedResDetails.locationId)}
                </p>
              </div>
              <button onClick={() => setSelectedResDetails(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
              <div className="flex items-center gap-6">
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</span>
                  <div className="flex flex-col text-sm font-black text-slate-900">
                    <span>{selectedResDetails.date}</span>
                    <span>{selectedResDetails.time} ({selectedResDetails.duration} Hours)</span>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room</span>
                  <div className="flex flex-col text-sm font-black text-slate-900">
                    <span>Floor {selectedResDetails.floorId.split('-').pop()}</span>
                    <span>Room {selectedResDetails.roomId.split('-').pop()}</span>
                  </div>
                </div>
              </div>

              {selectedResDetails.selectedMenuItems && selectedResDetails.selectedMenuItems.length > 0 && (
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Ordered Items</span>
                  <div className="space-y-3">
                    {selectedResDetails.selectedMenuItems.map((item, idx) => {
                      const vendor = vendors.find(v => v.id === selectedResDetails.vendorId);
                      const menuItem = vendor?.menu?.find(m => m.id === item.itemId) || locations.find(l => l.id === selectedResDetails.locationId)?.menu?.find(m => m.id === item.itemId) || locations.find(l => l.id === selectedResDetails.locationId)?.floors.find(f => f.id === selectedResDetails.floorId)?.rooms.find(r => r.id === selectedResDetails.roomId)?.menu?.find(m => m.id === item.itemId);
                      const itemName = getMenuItemName(selectedResDetails, item.itemId);
                      return (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black">{item.quantity}x</span>
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-900">{itemName}</span>
                              {item.deliveryTime && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.deliveryTime}</span>}
                            </div>
                          </div>
                          {menuItem?.price && (
                            <span className="text-xs font-black text-slate-900">{menuItem.price * item.quantity} EGP</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6 pt-6 border-t border-slate-100">
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</span>
                  <span className="text-sm font-black text-slate-900 capitalize">{selectedResDetails.paymentMethod === 'instapay' ? 'InstaPay' : (selectedResDetails.paymentMethod || 'N/A')}</span>
                </div>
                
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Cost</span>
                  <span className="text-xl font-black text-blue-600">{selectedResDetails.totalPrice ? `${selectedResDetails.totalPrice.toLocaleString()} EGP` : 'N/A'}</span>
                </div>
              </div>
              
              {selectedResDetails.status !== 'declined' && selectedResDetails.status !== 'approved' && (
                <div className="pt-2">
                   <div className={`px-4 py-2 rounded-xl text-center text-[10px] font-black uppercase tracking-widest ${selectedResDetails.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                      Status: {selectedResDetails.status}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyBookingsPage;
