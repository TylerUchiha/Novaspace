import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Add codeEditModal state
state_old = "const [postLoginAction, setPostLoginAction] = useState"
state_new = "const [codeEditModal, setCodeEditModal] = useState<{ type: 'master' | 'branch', id: string, currentCode: string } | null>(null);\n  const [postLoginAction, setPostLoginAction] = useState"
if "const [codeEditModal" not in content:
    content = re.sub(r"  const \[postLoginAction, setPostLoginAction\] = useState.*", state_new + r"<'select_network' | 'edit_profile' | 'create_space' | 'privacy' | 'terms' | 'support' | 'api_status' | 'global_gateway' | 'code_credentials' | null>(null);", content)

# Remove window.prompt buttons and add ones that set modal state
master_button_old = """                          <button 
                            onClick={() => {
                              const newCodeRaw = window.prompt('Enter new base code (will automatically prefix with OWNER-ALL-). This also updates the primary branch code:', vendorLocs[0].staffAccessCode || '');
                              if (newCodeRaw !== null && newCodeRaw.trim() !== '') {
                                handleUpdateLocationMeta(vendorLocs[0].id, { staffAccessCode: newCodeRaw.trim() });
                              }
                            }}
                            className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          >
                            <Edit size={16} />
                          </button>"""

master_button_new = """                          <button 
                            onClick={() => setCodeEditModal({ type: 'master', id: vendor.id, currentCode: vendorLocs[0].staffAccessCode || '' })}
                            className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          >
                            <Edit size={16} />
                          </button>"""
content = content.replace(master_button_old, master_button_new)

branch_button_old = """                                  <button onClick={() => {
                                      const newCodeRaw = window.prompt('Enter new base code for this branch (will automatically prefix with OWNER-):', loc.staffAccessCode || '');
                                      if (newCodeRaw !== null && newCodeRaw.trim() !== '') {
                                        handleUpdateLocationMeta(loc.id, { staffAccessCode: newCodeRaw.trim() });
                                      }
                                  }} className="text-indigo-400 hover:text-indigo-600 transition-colors"><Edit size={12}/></button>"""

branch_button_new = """                                  <button onClick={() => setCodeEditModal({ type: 'branch', id: loc.id, currentCode: loc.staffAccessCode || '' })} className="text-indigo-400 hover:text-indigo-600 transition-colors"><Edit size={12}/></button>"""
content = content.replace(branch_button_old, branch_button_new)

# Add the modal UI inside the code_credentials page, right after the main container ends.
modal_ui = """
      {/* Code Edit Modal */}
      {codeEditModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setCodeEditModal(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl p-8 overflow-hidden"
          >
            <button 
              onClick={() => setCodeEditModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col space-y-6 mt-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    Edit {codeEditModal.type === 'master' ? 'Master' : 'Branch'} Code
                  </h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    {codeEditModal.type === 'master' 
                      ? 'Updates access code for all branches in this space.' 
                      : 'Updates access code for this specific branch only.'}
                  </p>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">New Base Code</label>
                    <input 
                      id="edit-code-input"
                      type="text" 
                      placeholder="e.g. NS-SF-88"
                      defaultValue={codeEditModal.currentCode}
                      autoFocus
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white font-mono text-sm font-bold text-slate-900 transition-all"
                    />
                </div>
                
                <button 
                  onClick={() => {
                      const input = document.getElementById('edit-code-input') as HTMLInputElement;
                      const val = input.value.trim();
                      if (val) {
                          if (codeEditModal.type === 'master') {
                              const vendorLocs = allLocations.filter(l => l.vendorId === codeEditModal.id);
                              vendorLocs.forEach(l => {
                                  handleUpdateLocationMeta(l.id, { staffAccessCode: val });
                              });
                          } else {
                              handleUpdateLocationMeta(codeEditModal.id, { staffAccessCode: val });
                          }
                          setCodeEditModal(null);
                      }
                  }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
                >
                  Save Changes
                </button>
            </div>
          </motion.div>
        </div>
      )}
"""

page_end_old = """              {allVendors.length === 0 && (
                <div className="text-center py-10 text-slate-500 font-bold">
                  No spaces found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }"""

page_end_new = """              {allVendors.length === 0 && (
                <div className="text-center py-10 text-slate-500 font-bold">
                  No spaces found.
                </div>
              )}
            </div>
          </div>
        </div>
        """ + modal_ui + """
      </div>
    );
  }"""

content = content.replace(page_end_old, page_end_new)

with open('App.tsx', 'w') as f:
    f.write(content)

