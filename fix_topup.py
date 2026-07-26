import sys

with open('App.tsx', 'r') as f:
    content = f.read()

# Add topUpPaymentMethod state
state_str = "  const [topUpAmount, setTopUpAmount] = useState<number>(200);"
new_state_str = state_str + "\n  const [topUpPaymentMethod, setTopUpPaymentMethod] = useState<'card' | 'instapay'>('card');"
content = content.replace(state_str, new_state_str)

# Modify the Top Up Modal
modal_start = """                <div className="grid grid-cols-3 gap-2">
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
              <div className="flex gap-4">"""

modal_end = """                <div className="grid grid-cols-3 gap-2">
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

                <div className="pt-4 border-t border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Payment Method</label>
                  <div className="flex justify-center gap-3 w-full">
                    {currentLocation?.acceptedPaymentMethods?.card !== false && (
                    <button 
                      onClick={() => setTopUpPaymentMethod('card')}
                      className={`flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${topUpPaymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 text-blue-600 font-black' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      <CreditCard size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-center">Card</span>
                    </button>
                    )}
                    {currentLocation?.acceptedPaymentMethods?.instapay !== false && (
                    <button 
                      onClick={() => setTopUpPaymentMethod('instapay')}
                      className={`flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${topUpPaymentMethod === 'instapay' ? 'border-amber-500 bg-amber-50 text-amber-600 font-black' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      <Banknote size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-center">Instapay</span>
                    </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">"""

content = content.replace(modal_start, modal_end)

# Also ensure setTopUpPaymentMethod is valid by importing Banknote if not imported
if "Banknote" not in content[:1000]:
    content = content.replace("CreditCard, Edit,", "CreditCard, Edit, Banknote,")

with open('App.tsx', 'w') as f:
    f.write(content)

print("Top up modified")
