import os

file_path = "components/EmployeeDashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add to props
content = content.replace("  onCancelReservation: (id: string) => void;", "  onCancelReservation: (id: string) => void;\n  onResolveCancellation?: (id: string) => void;")

content = content.replace("  onCancelReservation,\n  onApproveReservation,", "  onCancelReservation,\n  onResolveCancellation,\n  onApproveReservation,")


old_actions = """                            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                              {!isApproved && (firstRes.paymentMethod !== 'instapay' || firstRes.instapayDetails?.verifiedAt) && (
                                <button 
                                  onClick={() => handleApproveAction(resGroup)} 
                                  className="p-2.5 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-all opacity-0 group-hover:opacity-100" 
                                >
                                  <CheckCircle size={20} />
                                </button>
                              )}
                              <button 
                                onClick={() => setCancellingGroup(resGroup)} 
                                className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100" 
                              >
                                <XCircle size={20} />
                              </button>
                              <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-100 transition-all"><MoreHorizontal size={20} /></button>
                            </div>"""

new_actions = """                            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                              {filterStatus === 'cancelled' ? (
                                <button
                                  onClick={() => {
                                    if (onResolveCancellation) {
                                      resGroup.forEach(r => onResolveCancellation(r.id));
                                    }
                                  }}
                                  className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                                >
                                  Resolved
                                </button>
                              ) : (
                                <>
                                  {!isApproved && (firstRes.paymentMethod !== 'instapay' || firstRes.instapayDetails?.verifiedAt) && (
                                    <button 
                                      onClick={() => handleApproveAction(resGroup)} 
                                      className="p-2.5 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-all opacity-0 group-hover:opacity-100" 
                                    >
                                      <CheckCircle size={20} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => setCancellingGroup(resGroup)} 
                                    className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100" 
                                  >
                                    <XCircle size={20} />
                                  </button>
                                  <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-100 transition-all"><MoreHorizontal size={20} /></button>
                                </>
                              )}
                            </div>"""

content = content.replace(old_actions, new_actions)

with open(file_path, "w") as f:
    f.write(content)

print("EmployeeDashboard resolved patched.")
