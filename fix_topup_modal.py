import sys

with open('App.tsx', 'r') as f:
    content = f.read()

find_str = """              </div>

              <div className="flex gap-4">"""

replacement_str = """              </div>

                <div className="pt-4 pb-6 border-t border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 text-center">Payment Method</label>
                  <div className="flex justify-center gap-3 w-full">
                    {currentLocation?.acceptedPaymentMethods?.card !== false && (
                    <button 
                      onClick={() => setTopUpPaymentMethod('card')}
                      className={`w-28 p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${topUpPaymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 text-blue-600 font-black shadow-lg shadow-blue-100' : 'border-slate-100 text-slate-400 hover:border-slate-200 bg-white'}`}
                    >
                      <CreditCard size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-center mt-1">Card</span>
                    </button>
                    )}
                    {currentLocation?.acceptedPaymentMethods?.instapay !== false && (
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

              <div className="flex gap-4">"""

idx = content.find("Top Up Modal")
if idx != -1:
    idx_end = content.find(find_str, idx)
    if idx_end != -1:
        content = content[:idx_end] + replacement_str + content[idx_end + len(find_str):]
        with open('App.tsx', 'w') as f:
            f.write(content)
        print("Replaced!")
    else:
        print("find_str not found")
else:
    print("Top Up Modal not found")

