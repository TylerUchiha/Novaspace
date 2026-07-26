import sys

# ROOM DETAIL
with open('components/RoomDetail.tsx', 'r') as f:
    content = f.read()

user_payment = """<div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setPaymentMethod('card')}
                  disabled={!isMethodAllowed('card')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                  <CreditCard size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-center">Card</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('instapay')}
                  disabled={!isMethodAllowed('instapay')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${paymentMethod === 'instapay' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                  <Banknote size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-center">Instapay</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('credits')}
                  disabled={!isMethodAllowed('credits') || userProfile.credits < totalPrice}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${paymentMethod === 'credits' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                  <Coins size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-center">Nova Balance</span>
                </button>
              </div>"""

new_user_payment = """<div className="flex justify-center gap-3 w-full">
                {isMethodAllowed('card') && (
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                  <CreditCard size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-center">Card</span>
                </button>
                )}
                {isMethodAllowed('instapay') && (
                <button 
                  onClick={() => setPaymentMethod('instapay')}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'instapay' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                  <Banknote size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-center">Instapay</span>
                </button>
                )}
                {isMethodAllowed('credits') && (
                <button 
                  onClick={() => setPaymentMethod('credits')}
                  disabled={userProfile.credits < totalPrice}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${paymentMethod === 'credits' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                  <Coins size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-center">Nova Balance</span>
                </button>
                )}
              </div>"""

staff_payment = """<div className="grid grid-cols-3 gap-3">
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      disabled={!isMethodAllowed('card')}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 font-black' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      <CreditCard size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-center">Card</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('instapay')}
                      disabled={!isMethodAllowed('instapay')}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${paymentMethod === 'instapay' ? 'border-amber-500 bg-amber-50 text-amber-600 font-black' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      <Banknote size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-center">Instapay</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('credits')}
                      disabled={!isMethodAllowed('credits') || staffMode !== 'select' || !selectedStaffUser || selectedStaffUser.credits < totalPrice}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${paymentMethod === 'credits' ? 'border-emerald-500 bg-emerald-50 text-emerald-600 font-black' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      <Coins size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-center">Nova Points</span>
                    </button>
                  </div>"""

new_staff_payment = """<div className="flex justify-center gap-3 w-full">
                   {isMethodAllowed('card') && (
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 font-black' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      <CreditCard size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-center">Card</span>
                    </button>
                   )}
                   {isMethodAllowed('instapay') && (
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('instapay')}
                      className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'instapay' ? 'border-amber-500 bg-amber-50 text-amber-600 font-black' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      <Banknote size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-center">Instapay</span>
                    </button>
                   )}
                   {isMethodAllowed('credits') && (
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('credits')}
                      disabled={staffMode !== 'select' || !selectedStaffUser || selectedStaffUser.credits < totalPrice}
                      className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${paymentMethod === 'credits' ? 'border-emerald-500 bg-emerald-50 text-emerald-600 font-black' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      <Coins size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-center">Nova Points</span>
                    </button>
                   )}
                  </div>"""

content = content.replace(user_payment, new_user_payment)
content = content.replace(staff_payment, new_staff_payment)

with open('components/RoomDetail.tsx', 'w') as f:
    f.write(content)


# MENU CONFIG
with open('components/MenuConfig.tsx', 'r') as f:
    content = f.read()

menu_payment = """<div className="grid grid-cols-3 gap-2">
                    <button 
                      type="button"
                      onClick={() => setOrderPaymentMethod('card')}
                      disabled={!isMethodAllowed('card')}
                      className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${orderPaymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 text-blue-600 font-black' : 'border-slate-100 text-slate-400'}`}
                    >
                      <CreditCard size={16} />
                      <span className="text-[9px] uppercase tracking-widest">Card</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setOrderPaymentMethod('instapay')}
                      disabled={!isMethodAllowed('instapay')}
                      className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${orderPaymentMethod === 'instapay' ? 'border-amber-600 bg-amber-50 text-amber-600 font-black' : 'border-slate-100 text-slate-400'}`}
                    >
                      <Banknote size={16} />
                      <span className="text-[9px] uppercase tracking-widest">Instapay</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setOrderPaymentMethod('credits')}
                      disabled={!isMethodAllowed('credits') || userMode !== 'select' || !selectedCustomerId || !allUsers.find(u => u.email === selectedCustomerId) || (allUsers.find(u => u.email === selectedCustomerId)?.credits || 0) < totalValue}
                      className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${orderPaymentMethod === 'credits' ? 'border-emerald-600 bg-emerald-50 text-emerald-600 font-black' : 'border-slate-100 text-slate-400'}`}
                    >
                      <Coins size={16} />
                      <span className="text-[9px] uppercase tracking-widest">Nova Points</span>
                    </button>
                  </div>"""

new_menu_payment = """<div className="flex justify-center gap-2 w-full">
                    {isMethodAllowed('card') && (
                    <button 
                      type="button"
                      onClick={() => setOrderPaymentMethod('card')}
                      className={`flex-1 p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${orderPaymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 text-blue-600 font-black' : 'border-slate-100 text-slate-400'}`}
                    >
                      <CreditCard size={16} />
                      <span className="text-[9px] uppercase tracking-widest">Card</span>
                    </button>
                    )}
                    {isMethodAllowed('instapay') && (
                    <button 
                      type="button"
                      onClick={() => setOrderPaymentMethod('instapay')}
                      className={`flex-1 p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${orderPaymentMethod === 'instapay' ? 'border-amber-600 bg-amber-50 text-amber-600 font-black' : 'border-slate-100 text-slate-400'}`}
                    >
                      <Banknote size={16} />
                      <span className="text-[9px] uppercase tracking-widest">Instapay</span>
                    </button>
                    )}
                    {isMethodAllowed('credits') && (
                    <button 
                      type="button"
                      onClick={() => setOrderPaymentMethod('credits')}
                      disabled={userMode !== 'select' || !selectedCustomerId || !allUsers.find(u => u.email === selectedCustomerId) || (allUsers.find(u => u.email === selectedCustomerId)?.credits || 0) < totalValue}
                      className={`flex-1 p-3 rounded-xl border transition-all flex flex-col items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${orderPaymentMethod === 'credits' ? 'border-emerald-600 bg-emerald-50 text-emerald-600 font-black' : 'border-slate-100 text-slate-400'}`}
                    >
                      <Coins size={16} />
                      <span className="text-[9px] uppercase tracking-widest">Nova Points</span>
                    </button>
                    )}
                  </div>"""

content = content.replace(menu_payment, new_menu_payment)

with open('components/MenuConfig.tsx', 'w') as f:
    f.write(content)

print("Methods fixed")
