import sys

with open('components/PropertyConfig.tsx', 'r') as f:
    content = f.read()

# 1. Remove from brand metadata
old_brand_contact = """                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                             <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
                                <div className="relative">
                                   <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                   <input 
                                     type="email" 
                                     readOnly={!isOwner}
                                     value={vendor.contactEmail || ''} 
                                     onChange={(e) => onUpdateVendor(vendor.id, { contactEmail: e.target.value })}
                                     placeholder="e.g. support@domain.com"
                                     className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-emerald-400 focus:bg-white transition-all shadow-sm"
                                   />
                                </div>
                             </div>
                             <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                                <div className="relative">
                                   <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                   <input 
                                     type="text" 
                                     readOnly={!isOwner}
                                     value={vendor.contactPhone || ''} 
                                     onChange={(e) => onUpdateVendor(vendor.id, { contactPhone: e.target.value })}
                                     placeholder="e.g. +1 (555) 0199"
                                     className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-emerald-400 focus:bg-white transition-all shadow-sm"
                                   />
                                </div>
                             </div>
                          </div>

                          <div className="flex flex-col gap-2 animate-in fade-in duration-300">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Notes / Support Hours</label>
                             <textarea 
                               readOnly={!isOwner}
                               value={vendor.contactNotes || ''} 
                               onChange={(e) => onUpdateVendor(vendor.id, { contactNotes: e.target.value })}
                               placeholder="e.g. Support hours, emergency contacts..."
                               rows={2}
                               className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-emerald-400 focus:bg-white transition-all shadow-sm resize-none"
                             />
                          </div>"""

content = content.replace(old_brand_contact, "")

# 2. Remove from branch metadata
old_branch_contact = """                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Branch Contact Email</label>
                                   <div className="relative">
                                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                      <input 
                                        type="email" 
                                        readOnly={!isOwner}
                                        value={location.contactEmail || ''} 
                                        onChange={(e) => onUpdateLocationMeta(location.id, { contactEmail: e.target.value })}
                                        placeholder={vendor.contactEmail ? `Inherit: ${vendor.contactEmail}` : "e.g. sf@domain.com"}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                                      />
                                   </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Branch Contact Phone</label>
                                   <div className="relative">
                                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                      <input 
                                        type="text" 
                                        readOnly={!isOwner}
                                        value={location.contactPhone || ''} 
                                        onChange={(e) => onUpdateLocationMeta(location.id, { contactPhone: e.target.value })}
                                        placeholder={vendor.contactPhone ? `Inherit: ${vendor.contactPhone}` : "e.g. +1 (415) ..."}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                                      />
                                   </div>
                                </div>
                             </div>

                             <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Branch Contact Notes / Specific Hours</label>
                                <textarea 
                                  readOnly={!isOwner}
                                  value={location.contactNotes || ''} 
                                  onChange={(e) => onUpdateLocationMeta(location.id, { contactNotes: e.target.value })}
                                  placeholder={vendor.contactNotes ? `Inherit: ${vendor.contactNotes}` : "e.g. Monday-Friday 8 AM - 8 PM..."}
                                  rows={2}
                                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-blue-400 focus:bg-white transition-all shadow-sm resize-none"
                                />
                             </div>"""

content = content.replace(old_branch_contact, "")

with open('components/PropertyConfig.tsx', 'w') as f:
    f.write(content)

