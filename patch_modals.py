import re

with open('components/LandingPage.tsx', 'r') as f:
    content = f.read()

# 1. Restore handleOwnerSubmit
old_owner_submit = """  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onCodeLogin(ownerCode);
    if (success) {
      setIsOwnerModalOpen(false);
    } else {
      setOwnerCodeError(true);
      setTimeout(() => setOwnerCodeError(false), 2000);
    }
  };"""

new_owner_submit = """  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ownerCode === 'Global Access') {
      onLogin('owner');
      setIsOwnerModalOpen(false);
    } else {
      setOwnerCodeError(true);
      setTimeout(() => setOwnerCodeError(false), 2000);
    }
  };"""

content = content.replace(old_owner_submit, new_owner_submit)

# 2. Add isOwnerAccessModalOpen state
if "const [isOwnerAccessModalOpen" not in content:
    content = content.replace(
        "const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);",
        "const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);\n  const [isOwnerAccessModalOpen, setIsOwnerAccessModalOpen] = useState(false);\n  const [ownerAccessCode, setOwnerAccessCode] = useState('');\n  const [ownerAccessCodeError, setOwnerAccessCodeError] = useState(false);"
    )

# 3. Add handleOwnerAccessSubmit
if "const handleOwnerAccessSubmit" not in content:
    content = content.replace(
        "  const handleOwnerSubmit = async",
        "  const handleOwnerAccessSubmit = async (e: React.FormEvent) => {\n    e.preventDefault();\n    const success = await onCodeLogin(ownerAccessCode);\n    if (success) {\n      setIsOwnerAccessModalOpen(false);\n    } else {\n      setOwnerAccessCodeError(true);\n      setTimeout(() => setOwnerAccessCodeError(false), 2000);\n    }\n  };\n\n  const handleOwnerSubmit = async"
    )

# 4. Change Manager Access button to Owner Access button that opens the modal
manager_btn = """                    <button 
                      type="button"
                      onClick={() => onLogin('manager')}
                      className="w-full py-4 rounded-2xl font-black text-sm text-emerald-600 bg-white border-2 border-emerald-100 hover:bg-emerald-50 transition-all active:scale-[0.98] mt-3 flex items-center justify-center gap-3 shadow-sm"
                    >
                      Manager Access
                      <Crown size={18} className="text-amber-400" />
                    </button>"""

owner_access_btn = """                    <button 
                      type="button"
                      onClick={() => setIsOwnerAccessModalOpen(true)}
                      className="w-full py-4 rounded-2xl font-black text-sm text-emerald-600 bg-white border-2 border-emerald-100 hover:bg-emerald-50 transition-all active:scale-[0.98] mt-3 flex items-center justify-center gap-3 shadow-sm"
                    >
                      Owner Access
                      <Crown size={18} className="text-amber-400" />
                    </button>"""

content = content.replace(manager_btn, owner_access_btn)

# 5. Inject the new modal HTML right before the Global Access Modal
owner_access_modal = """      {/* Owner Access Modal */}
      {isOwnerAccessModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsOwnerAccessModalOpen(false)}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-sm bg-white rounded-[3rem] shadow-2xl p-10 overflow-hidden"
          >
            <button 
              onClick={() => setIsOwnerAccessModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-4 mb-8">
              <div className="w-16 h-16 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 mx-auto">
                <Crown size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Owner Access</h3>
                <p className="text-sm font-bold text-slate-400 mt-1">Enter owner authorization code</p>
              </div>
            </div>

            <form onSubmit={handleOwnerAccessSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="relative group">
                  <Crown className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${ownerAccessCodeError ? 'text-rose-500' : 'text-slate-300 group-focus-within:text-emerald-500'}`} size={20} />
                  <input 
                    type="password" 
                    placeholder="e.g. OWNER-NS-SF-88"
                    value={ownerAccessCode}
                    onChange={(e) => setOwnerAccessCode(e.target.value)}
                    autoFocus
                    className={`w-full pl-14 pr-6 py-4.5 bg-slate-50 border rounded-2xl outline-none focus:bg-white focus:ring-4 transition-all font-bold tracking-widest ${
                      ownerAccessCodeError 
                        ? 'border-rose-400 focus:border-rose-400 ring-rose-50 text-rose-600' 
                        : 'border-slate-100 focus:border-emerald-400 ring-emerald-50 text-slate-900 shadow-sm'
                    }`}
                  />
                </div>
                {ownerAccessCodeError && (
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">Invalid owner code</p>
                )}
              </div>

              <button 
                type="submit"
                className="w-full py-5 rounded-2xl font-black text-lg text-white bg-slate-900 shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                Authenticate
                <ArrowRight size={22} />
              </button>
            </form>
          </motion.div>
        </div>
      )}
"""

content = content.replace("{/* Owner Global Access Modal */}", owner_access_modal + "\n      {/* Owner Global Access Modal */}")

with open('components/LandingPage.tsx', 'w') as f:
    f.write(content)

