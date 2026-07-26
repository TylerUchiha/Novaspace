import sys

with open('App.tsx', 'r') as f:
    content = f.read()

# 1. Update the top up balance button area
old_buttons = """                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => { setIsTopUpOpen(true); setTopUpStep('amount'); }} className="bg-blue-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">TOP UP BALANCE</button>
                    <button onClick={() => setIsTransactionsOpen(true)} className="bg-slate-900 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">VIEW TRANSACTIONS</button>
                  </div>"""

new_buttons = """                  <div className="w-full">
                    <button onClick={() => { setIsTopUpOpen(true); setTopUpStep('amount'); }} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">TOP UP BALANCE</button>
                  </div>"""

content = content.replace(old_buttons, new_buttons)

# 2. Add transaction history right below the balance card
old_structure = """              </div>

            </div>

            <div className="space-y-8">"""

new_structure = """              </div>

              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl relative overflow-hidden">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Transaction History</h3>
                <div className="space-y-4">
                  {transactions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-400 font-bold">No transactions yet.</p>
                    </div>
                  ) : (
                    transactions.map(tx => (
                      <div key={tx.id} className="flex flex-col p-5 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {tx.type === 'credit' ? <Plus size={20} /> : <X size={20} />}
                            </div>
                            <div>
                              <p className="text-base font-black text-slate-900">{tx.description}</p>
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                {new Date(tx.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                              </p>
                            </div>
                          </div>
                          <p className={`text-lg font-black ${tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {tx.type === 'credit' ? '+' : '-'}{tx.amount.toLocaleString()} EGP
                          </p>
                        </div>
                        {tx.isReservation && (
                          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Space</span>
                              <span className="font-semibold text-slate-700">{tx.roomName}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch</span>
                              <span className="font-semibold text-slate-700">{tx.locationName}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Area</span>
                              <span className="font-semibold text-slate-700">{tx.floorName}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</span>
                              <span className="font-semibold text-slate-700">{tx.duration} Hour{tx.duration !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Method</span>
                              <span className="font-semibold text-slate-700">{tx.paymentMethod === 'credits' ? 'Nova Credit' : tx.paymentMethod}</span>
                            </div>
                            {tx.hasInstorePurchases && (
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">In-Store Purchases</span>
                                <span className="font-semibold text-slate-700">Yes</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            <div className="space-y-8">"""

content = content.replace(old_structure, new_structure)

# 3. Delete the transaction modal
old_modal = """        {/* Transactions Modal */}
        {isTransactionsOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsTransactionsOpen(false)} />
            <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 flex flex-col max-h-[80vh] animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Transaction History</h3>
                <button onClick={() => setIsTransactionsOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400"><X size={24} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {transactions.map(tx => (
                  <div key={tx.id} className="flex flex-col p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {tx.type === 'credit' ? <Plus size={20} /> : <X size={20} />}
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900">{tx.description}</p>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            {new Date(tx.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        </div>
                      </div>
                      <p className={`text-lg font-black ${tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.type === 'credit' ? '+' : '-'}{tx.amount.toLocaleString()} EGP
                      </p>
                    </div>
                    {tx.isReservation && (
                      <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Space</span>
                          <span className="font-semibold text-slate-700">{tx.roomName}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch</span>
                          <span className="font-semibold text-slate-700">{tx.locationName}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Area</span>
                          <span className="font-semibold text-slate-700">{tx.floorName}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</span>
                          <span className="font-semibold text-slate-700">{tx.duration} Hour{tx.duration !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Method</span>
                          <span className="font-semibold text-slate-700">{tx.paymentMethod === 'credits' ? 'Nova Credit' : tx.paymentMethod}</span>
                        </div>
                        {tx.hasInstorePurchases && (
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">In-Store Purchases</span>
                            <span className="font-semibold text-slate-700">Yes</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}"""

content = content.replace(old_modal, "")

with open('App.tsx', 'w') as f:
    f.write(content)

