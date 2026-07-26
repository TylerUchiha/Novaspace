const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const startStr = "{userRole !== 'owner' && (";
const endStr = "Synced & Active\n              </div>";

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr) + endStr.length;

if (startIdx !== -1 && endIdx !== -1) {
  const newBlock = `{userRole !== 'owner' && (
                <div className="w-full p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group mb-8">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Instapay Destination</span>
                  
                  {userRole === 'manager' ? (
                    <div className="flex flex-col w-full gap-3">
                      <select 
                        value={currentLocation.instapayType || 'account'} 
                        onChange={(e) => handleUpdateLocationMeta(currentLocation.id, { instapayType: e.target.value as any })}
                        className="w-full text-center text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl p-2 outline-none focus:border-emerald-300"
                      >
                        <option value="account">Instapay Account (@instapay)</option>
                        <option value="phone">Phone Number</option>
                        <option value="wallet">Mobile Wallet</option>
                      </select>
                      <input
                        type="text"
                        value={currentLocation.instapayAddress || ''}
                        onChange={(e) => handleUpdateLocationMeta(currentLocation.id, { instapayAddress: e.target.value })}
                        className="w-full text-center text-lg font-bold text-emerald-600 bg-transparent outline-none border-b-2 border-emerald-100 focus:border-emerald-400 transition-colors placeholder:text-emerald-200"
                        placeholder={currentLocation.instapayType === 'account' ? "example@instapay" : "Phone number"}
                      />
                      {(!currentLocation.instapayType || currentLocation.instapayType === 'account') && (
                        <div className="mt-2 text-center">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">QR Code</label>
                          {currentLocation.instapayQrCode ? (
                            <div className="relative inline-block group/qr">
                              <img src={currentLocation.instapayQrCode} alt="QR Code" className="w-32 h-32 object-contain bg-white rounded-xl shadow-sm border border-slate-100" />
                              <button onClick={() => handleUpdateLocationMeta(currentLocation.id, { instapayQrCode: undefined })} className="absolute top-1 right-1 p-1 bg-white/90 text-rose-500 rounded-lg opacity-0 group-hover/qr:opacity-100 transition-opacity shadow-sm"><X size={14} /></button>
                            </div>
                          ) : (
                             <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors text-xs font-bold shadow-sm">
                               <Upload size={14} /> Upload QR
                               <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                 const file = e.target.files?.[0];
                                 if (file) {
                                   const reader = new FileReader();
                                   reader.onload = (e) => handleUpdateLocationMeta(currentLocation.id, { instapayQrCode: e.target?.result as string });
                                   reader.readAsDataURL(file);
                                 }
                               }} />
                             </label>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      {currentLocation.instapayType && (
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded-full border border-slate-100">
                          {currentLocation.instapayType === 'account' ? 'Instapay Account' : currentLocation.instapayType === 'wallet' ? 'Mobile Wallet' : 'Phone Number'}
                        </span>
                      )}
                      <span className="text-xl font-black text-emerald-600 select-all cursor-copy">
                        {currentLocation.instapayAddress || 'NOT SET'}
                      </span>
                      {(!currentLocation.instapayType || currentLocation.instapayType === 'account') && currentLocation.instapayQrCode && (
                        <div className="mt-3 p-2 bg-white rounded-2xl shadow-sm border border-slate-100">
                          <img src={currentLocation.instapayQrCode} alt="QR Code" className="w-40 h-40 object-contain" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-3 py-3 px-6 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100">
                <Check size={16} strokeWidth={3} />
                Synced & Active
              </div>`;

  content = content.substring(0, startIdx) + newBlock + content.substring(endIdx);
  fs.writeFileSync('App.tsx', content, 'utf8');
  console.log("Fixed!");
} else {
  console.log("Could not find blocks.");
}
