import sys

with open('App.tsx', 'r') as f:
    content = f.read()

# Add topUpStep state
content = content.replace(
    "const [isTopUpOpen, setIsTopUpOpen] = useState(false);",
    "const [isTopUpOpen, setIsTopUpOpen] = useState(false);\n  const [topUpStep, setTopUpStep] = useState<'amount' | 'checkout'>('amount');\n  const [topUpCardDetails, setTopUpCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });\n  const [topUpReceipt, setTopUpReceipt] = useState('');\n  const [topUpPayer, setTopUpPayer] = useState('');"
)

# Update isTopUpOpen usages to reset state when closed
content = content.replace(
    "onClick={() => setIsTopUpOpen(true)}",
    "onClick={() => { setIsTopUpOpen(true); setTopUpStep('amount'); }}"
)

content = content.replace(
    "onClick={() => setIsTopUpOpen(false)}",
    "onClick={() => { setIsTopUpOpen(false); setTopUpStep('amount'); }}"
)

# Update handleTopUp logic
content = content.replace(
    "const handleTopUp = () => {\n    if (topUpAmount < 200) {\n      setBookingError(\"Minimum deposit is 200 EGP\");\n      setTimeout(() => setBookingError(null), 3000);\n      return;\n    }\n    const newBalance = userProfile.credits + topUpAmount;\n    handleUpdateProfile({ ...userProfile, credits: newBalance });\n    setTransactions(prev => [{\n      id: `tx-${Date.now()}`,\n      type: 'credit',\n      amount: topUpAmount,\n      description: 'Account Top-Up',\n      date: new Date().toISOString().split('T')[0]\n    }, ...prev]);\n    setIsTopUpOpen(false);\n    setShowBookingSuccess(true);\n    setTimeout(() => setShowBookingSuccess(false), 3000);\n  };",
    """const handleTopUp = () => {
    if (topUpAmount < 200) {
      setBookingError("Minimum deposit is 200 EGP");
      setTimeout(() => setBookingError(null), 3000);
      return;
    }
    if (topUpStep === 'amount') {
      setTopUpStep('checkout');
      return;
    }
    
    // Process checkout
    if (topUpPaymentMethod === 'card') {
      if (!topUpCardDetails.number || !topUpCardDetails.expiry || !topUpCardDetails.cvc || !topUpCardDetails.name) {
        setBookingError("Please fill all card details");
        setTimeout(() => setBookingError(null), 3000);
        return;
      }
    } else {
      if (!topUpPayer || !topUpReceipt) {
        setBookingError("Please provide sender address and receipt");
        setTimeout(() => setBookingError(null), 3000);
        return;
      }
    }

    const newBalance = userProfile.credits + topUpAmount;
    handleUpdateProfile({ ...userProfile, credits: newBalance });
    setTransactions(prev => [{
      id: `tx-${Date.now()}`,
      type: 'credit',
      amount: topUpAmount,
      description: 'Account Top-Up',
      date: new Date().toISOString().split('T')[0]
    }, ...prev]);
    setIsTopUpOpen(false);
    setTopUpStep('amount');
    setShowBookingSuccess(true);
    setTimeout(() => setShowBookingSuccess(false), 3000);
  };"""
)

# Update the Top Up modal UI
old_modal_content = """              <div className="space-y-6 mb-10">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (EGP)</label>
                  <div className="relative group">
                    <Coins className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input 
                      type="number" 
                      min="200"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(Number(e.target.value))}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all font-black text-2xl text-slate-900"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {[200, 500, 1000].map(amt => (
                    <button 
                      key={amt} 
                      onClick={() => setTopUpAmount(amt)}
                      className={`py-3 rounded-xl font-black text-xs transition-all border-2 ${topUpAmount === amt ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'}`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

                <div className="pt-4 pb-6 border-t border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 text-center">Payment Method</label>
                  <div className="flex justify-center gap-3 w-full">
                    {selectedVendor?.acceptedPaymentMethods?.card !== false && (
                    <button 
                      onClick={() => setTopUpPaymentMethod('card')}
                      className={`w-28 p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${topUpPaymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 text-blue-600 font-black shadow-lg shadow-blue-100' : 'border-slate-100 text-slate-400 hover:border-slate-200 bg-white'}`}
                    >
                      <CreditCard size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-center mt-1">Card</span>
                    </button>
                    )}
                    {selectedVendor?.acceptedPaymentMethods?.instapay !== false && (
                    <button 
                      onClick={() => setTopUpPaymentMethod('instapay')}
                      className={`w-28 p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${topUpPaymentMethod === 'instapay' ? 'border-amber-500 bg-amber-50 text-amber-600 font-black shadow-lg shadow-amber-100' : 'border-slate-100 text-slate-400 hover:border-slate-200 bg-white'}`}
                    >
                      <Banknote size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-center mt-1">Instapay</span>
                    </button>
                    )}
                  </div>
                </div>

              <div className="flex gap-4">
                <button onClick={() => { setIsTopUpOpen(false); setTopUpStep('amount'); }} className="flex-1 py-4 bg-slate-50 text-slate-400 font-black rounded-2xl uppercase tracking-widest text-xs">Cancel</button>
                <button onClick={handleTopUp} className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-blue-100">Confirm Deposit</button>
              </div>"""

new_modal_content = """              {topUpStep === 'amount' ? (
                <>
                  <div className="space-y-6 mb-10">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (EGP)</label>
                      <div className="relative group">
                        <Coins className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input 
                          type="number" 
                          min="200"
                          value={topUpAmount}
                          onChange={(e) => setTopUpAmount(Number(e.target.value))}
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all font-black text-2xl text-slate-900"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {[200, 500, 1000].map(amt => (
                        <button 
                          key={amt} 
                          onClick={() => setTopUpAmount(amt)}
                          className={`py-3 rounded-xl font-black text-xs transition-all border-2 ${topUpAmount === amt ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'}`}
                        >
                          {amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 pb-6 border-t border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 text-center">Payment Method</label>
                    <div className="flex justify-center gap-3 w-full">
                      {selectedVendor?.acceptedPaymentMethods?.card !== false && (
                      <button 
                        onClick={() => setTopUpPaymentMethod('card')}
                        className={`w-28 p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${topUpPaymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 text-blue-600 font-black shadow-lg shadow-blue-100' : 'border-slate-100 text-slate-400 hover:border-slate-200 bg-white'}`}
                      >
                        <CreditCard size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-center mt-1">Card</span>
                      </button>
                      )}
                      {selectedVendor?.acceptedPaymentMethods?.instapay !== false && (
                      <button 
                        onClick={() => setTopUpPaymentMethod('instapay')}
                        className={`w-28 p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${topUpPaymentMethod === 'instapay' ? 'border-amber-500 bg-amber-50 text-amber-600 font-black shadow-lg shadow-amber-100' : 'border-slate-100 text-slate-400 hover:border-slate-200 bg-white'}`}
                      >
                        <Banknote size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-center mt-1">Instapay</span>
                      </button>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => { setIsTopUpOpen(false); setTopUpStep('amount'); }} className="flex-1 py-4 bg-slate-50 text-slate-400 font-black rounded-2xl uppercase tracking-widest text-xs">Cancel</button>
                    <button onClick={handleTopUp} className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-blue-100">Continue to Checkout</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</p>
                      <p className="text-2xl font-black text-slate-900">{topUpAmount.toLocaleString()} EGP</p>
                    </div>
                    {topUpPaymentMethod === 'card' ? (
                      <div className="bg-blue-100 text-blue-600 p-3 rounded-xl"><CreditCard size={24} /></div>
                    ) : (
                      <div className="bg-amber-100 text-amber-600 p-3 rounded-xl"><Banknote size={24} /></div>
                    )}
                  </div>
                  
                  {topUpPaymentMethod === 'card' ? (
                    <div className="space-y-4 mb-8">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono text-sm" value={topUpCardDetails.number} onChange={e => setTopUpCardDetails({...topUpCardDetails, number: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Expiry</label>
                          <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono text-sm" value={topUpCardDetails.expiry} onChange={e => setTopUpCardDetails({...topUpCardDetails, expiry: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">CVC</label>
                          <input type="text" placeholder="123" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono text-sm" value={topUpCardDetails.cvc} onChange={e => setTopUpCardDetails({...topUpCardDetails, cvc: e.target.value})} />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Cardholder Name</label>
                        <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm font-black text-slate-900" value={topUpCardDetails.name} onChange={e => setTopUpCardDetails({...topUpCardDetails, name: e.target.value})} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 mb-8">
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/50 mb-4">
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Send payment to</p>
                        <p className="text-lg font-black text-amber-700 font-mono">{selectedVendor?.instapayAccount || 'novaspace@instapay'}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Your Instapay Address / Phone</label>
                        <input type="text" placeholder="e.g. user@instapay or 01xxxxxxxxx" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-500 font-mono text-sm" value={topUpPayer} onChange={e => setTopUpPayer(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Transfer Receipt Image</label>
                        <label className="w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all">
                          <Upload className="text-slate-400 mb-2" size={20} />
                          <span className="text-xs font-bold text-slate-500">{topUpReceipt ? 'Receipt uploaded!' : 'Click to upload receipt'}</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                            if (e.target.files?.[0]) setTopUpReceipt(URL.createObjectURL(e.target.files[0]));
                          }} />
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button onClick={() => setTopUpStep('amount')} className="flex-1 py-4 bg-slate-50 text-slate-400 font-black rounded-2xl uppercase tracking-widest text-xs">Back</button>
                    <button onClick={handleTopUp} className={`flex-[2] py-4 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl ${topUpPaymentMethod === 'card' ? 'bg-blue-600 shadow-blue-100 hover:bg-blue-700' : 'bg-amber-500 shadow-amber-100 hover:bg-amber-600'}`}>Complete Top Up</button>
                  </div>
                </>
              )}"""

content = content.replace(old_modal_content, new_modal_content)

with open('App.tsx', 'w') as f:
    f.write(content)

