import React, { useState, useEffect } from 'react';
import { LocationData, Vendor } from '../types';
import { CreditCard, Banknote, Coins, ShieldCheck, Building2, AlertCircle } from 'lucide-react';

interface GlobalConfigPageProps {
  userRole?: 'owner' | 'manager' | 'customer' | 'employee' | null;
  vendor: Vendor; // currently active vendor in main app
  locations: LocationData[]; // current active vendor locations
  allVendors: Vendor[]; // all vendors in the system
  allLocations: LocationData[]; // all locations in the system
  onUpdateVendor: (vendorId: string, updates: Partial<Vendor>) => void;
  onUpdateLocation: (locId: string, updates: Partial<LocationData>) => void;
}

const GlobalConfigPage: React.FC<GlobalConfigPageProps> = ({
  vendor,
  locations,
  allLocations,
  onUpdateLocation,
  onUpdateVendor,
}) => {
  // Toggle Global (Vendor) payment settings
  const handleToggleGlobalPayment = (method: 'card' | 'instapay' | 'novaPoints') => {
    const current = vendor.acceptedPaymentMethods || { card: true, instapay: true, novaPoints: true };
    const newValue = !current[method];

    onUpdateVendor(vendor.id, {
      acceptedPaymentMethods: { ...current, [method]: newValue }
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-50/50">
      {/* Header */}
      <header className="px-12 py-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Branch Payment Controls</h2>
          <p className="text-slate-400 font-bold mt-1 text-xs uppercase tracking-widest font-sans">Toggle accepted payment options per individual branch location</p>
        </div>
        <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider">
          <ShieldCheck size={16} />
          <span>Global configuration mode</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          

            <div className="space-y-8">
              {/* Global Title Badge */}
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[9px] font-black text-purple-600 uppercase tracking-[0.2em]">Global Payment Configuration</span>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-0.5">{vendor.name}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">These settings apply to the entire network</p>
              </div>

              {/* Configure methods */}
              <div className="space-y-6">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest font-sans">Accepted Payment Channels</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Credit Card Button */}
                  {(() => {
                    const isEnabled = vendor.acceptedPaymentMethods ? vendor.acceptedPaymentMethods.card !== false : true;
                    return (
                      <button
                        onClick={() => handleToggleGlobalPayment('card')}
                        className={`text-left p-8 rounded-[2rem] border-2 transition-all duration-200 flex flex-col justify-between min-h-[220px] relative group hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                          isEnabled 
                            ? 'border-blue-600 bg-blue-50/20 text-blue-950 shadow-sm shadow-blue-100' 
                            : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className={`p-4 rounded-2xl transition-colors ${isEnabled ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <CreditCard size={24} />
                          </div>
                          <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${isEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}>
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-200 ${isEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                          </div>
                        </div>
                        <div className="mt-8">
                          <span className={`font-black text-base block transition-colors ${isEnabled ? 'text-blue-900' : 'text-slate-700'}`}>
                            Credit / Debit Card
                          </span>
                          <span className="text-xs font-semibold text-slate-400 mt-1 block leading-relaxed">
                            Accept instant card payments online
                          </span>
                        </div>
                      </button>
                    );
                  })()}

                  {/* Instapay Button */}
                  {(() => {
                    const isEnabled = vendor.acceptedPaymentMethods ? vendor.acceptedPaymentMethods.instapay !== false : true;
                    return (
                      <button
                        onClick={() => handleToggleGlobalPayment('instapay')}
                        className={`text-left p-8 rounded-[2rem] border-2 transition-all duration-200 flex flex-col justify-between min-h-[220px] relative group hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                          isEnabled 
                            ? 'border-emerald-600 bg-emerald-50/20 text-emerald-950 shadow-sm shadow-emerald-100' 
                            : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className={`p-4 rounded-2xl transition-colors ${isEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <Banknote size={24} />
                          </div>
                          <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${isEnabled ? 'bg-emerald-600' : 'bg-slate-200'}`}>
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-200 ${isEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                          </div>
                        </div>
                        <div className="mt-8">
                          <span className={`font-black text-base block transition-colors ${isEnabled ? 'text-emerald-900' : 'text-slate-700'}`}>
                            Instapay Payment
                          </span>
                          <span className="text-xs font-semibold text-slate-400 mt-1 block leading-relaxed">
                            Accept instant Instapay transfer at front desk
                          </span>
                        </div>
                      </button>
                    );
                  })()}

                  {/* Nova Points Button */}
                  {(() => {
                    const isEnabled = vendor.acceptedPaymentMethods ? vendor.acceptedPaymentMethods.novaPoints !== false : true;
                    return (
                      <button
                        onClick={() => handleToggleGlobalPayment('novaPoints')}
                        className={`text-left p-8 rounded-[2rem] border-2 transition-all duration-200 flex flex-col justify-between min-h-[220px] relative group hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                          isEnabled 
                            ? 'border-amber-600 bg-amber-50/20 text-amber-950 shadow-sm shadow-amber-100' 
                            : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className={`p-4 rounded-2xl transition-colors ${isEnabled ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <Coins size={24} />
                          </div>
                          <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${isEnabled ? 'bg-amber-600' : 'bg-slate-200'}`}>
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-200 ${isEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                          </div>
                        </div>
                        <div className="mt-8">
                          <span className={`font-black text-base block transition-colors ${isEnabled ? 'text-amber-900' : 'text-slate-700'}`}>
                            Nova Points Wallet
                          </span>
                          <span className="text-xs font-semibold text-slate-400 mt-1 block leading-relaxed">
                            Accept member wallet credits
                          </span>
                        </div>
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default GlobalConfigPage;
