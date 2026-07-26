import re

with open('components/LandingPage.tsx', 'r') as f:
    content = f.read()

# Add state
state_pattern = r"  const \[ownerAccessCodeError, setOwnerAccessCodeError\] = useState\(false\);"
state_addition = """  const [ownerAccessCodeError, setOwnerAccessCodeError] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [ownerCode, setOwnerCode] = useState('');
  const [ownerCodeError, setOwnerCodeError] = useState(false);"""
content = re.sub(state_pattern, state_addition, content)

# Add handleOwnerSubmit
submit_pattern = r"  const handleOwnerAccessSubmit = async \(e: React.FormEvent\) => \{\n    e.preventDefault\(\);\n    const success = await onCodeLogin\(ownerAccessCode\);\n    if \(success\) \{\n      setIsOwnerAccessModalOpen\(false\);\n    \} else \{\n      setOwnerAccessCodeError\(true\);\n      setTimeout\(\(\) => setOwnerAccessCodeError\(false\), 2000\);\n    \}\n  \};"
submit_addition = """  const handleOwnerAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onCodeLogin(ownerAccessCode);
    if (success) {
      setIsOwnerAccessModalOpen(false);
    } else {
      setOwnerAccessCodeError(true);
      setTimeout(() => setOwnerAccessCodeError(false), 2000);
    }
  };

  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ownerCode === 'Global Access') {
      onLogin('owner');
      setIsOwnerModalOpen(false);
    } else {
      setOwnerCodeError(true);
      setTimeout(() => setOwnerCodeError(false), 2000);
    }
  };"""
content = re.sub(submit_pattern, submit_addition, content)

# Add Global Access button
btn_pattern = r"                    <button \n                      type=\"button\"\n                      onClick=\{\(\) => setIsOwnerAccessModalOpen\(true\)\}\n                      className=\"w-full py-4 rounded-2xl font-black text-sm text-emerald-600 bg-white border-2 border-emerald-100 hover:bg-emerald-50 transition-all active:scale-\[0.98\] mt-3 flex items-center justify-center gap-3 shadow-sm\"\n                    >\n                      Owner Access\n                      <Crown size=\{18\} className=\"text-amber-400\" \/>\n                    <\/button>\n                  <\/div>"
btn_addition = """                    <button 
                      type="button"
                      onClick={() => setIsOwnerAccessModalOpen(true)}
                      className="w-full py-4 rounded-2xl font-black text-sm text-emerald-600 bg-white border-2 border-emerald-100 hover:bg-emerald-50 transition-all active:scale-[0.98] mt-3 flex items-center justify-center gap-3 shadow-sm"
                    >
                      Owner Access
                      <Crown size={18} className="text-amber-400" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsOwnerModalOpen(true)}
                      className="w-full py-4 rounded-2xl font-black text-sm text-emerald-600 bg-white border-2 border-emerald-100 hover:bg-emerald-50 transition-all active:scale-[0.98] mt-3 flex items-center justify-center gap-3 shadow-sm"
                    >
                      Global Access
                      <Globe size={18} className="text-blue-500" />
                    </button>
                  </div>"""
content = re.sub(btn_pattern, btn_addition, content)

# Add Global Access Modal
modal_pattern = r"      \{\/\* Owner Access Modal \*\/\}[\s\S]*?<\/div>\n  \);\n\};\n\nexport default LandingPage;"

global_modal_code = """      {/* Owner Global Access Modal */}
      {isOwnerModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsOwnerModalOpen(false)}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-sm bg-white rounded-[3rem] shadow-2xl p-10 overflow-hidden"
          >
            <button 
              onClick={() => setIsOwnerModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-4 mb-8">
              <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto">
                <Globe size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Global Access</h3>
                <p className="text-sm font-bold text-slate-400 mt-1">Enter master authorization code</p>
              </div>
            </div>

            <form onSubmit={handleOwnerSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="relative group">
                  <ShieldCheck className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${ownerCodeError ? 'text-rose-500' : 'text-slate-300 group-focus-within:text-emerald-500'}`} size={20} />
                  <input 
                    type="password" 
                    placeholder="Enter Master Code"
                    value={ownerCode}
                    onChange={(e) => setOwnerCode(e.target.value)}
                    autoFocus
                    className={`w-full pl-14 pr-6 py-4.5 bg-slate-50 border rounded-2xl outline-none focus:bg-white focus:ring-4 transition-all font-bold tracking-widest ${
                      ownerCodeError 
                        ? 'border-rose-400 focus:border-rose-400 ring-rose-50 text-rose-600' 
                        : 'border-slate-100 focus:border-emerald-400 ring-emerald-50 text-slate-900 shadow-sm'
                    }`}
                  />
                </div>
                {ownerCodeError && (
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center">Invalid master access code</p>
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
    </div>
  );
};

export default LandingPage;"""

def replacer(match):
    return match.group(0).replace("    </div>\n  );\n};\n\nexport default LandingPage;", global_modal_code)

content = re.sub(modal_pattern, replacer, content)

with open('components/LandingPage.tsx', 'w') as f:
    f.write(content)

