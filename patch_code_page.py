import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Replace button in global gateway
old_button = """            <button onClick={() => setPostLoginAction('code_credentials')} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:border-emerald-200 transition-all group flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wallet size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Financial Data</h2>
              <p className="text-slate-500 font-medium">InstaPay details and global finance info</p>
            </button>"""

new_button = """            <button onClick={() => setPostLoginAction('code_credentials')} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:border-emerald-200 transition-all group flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Key size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Code Credentials</h2>
              <p className="text-slate-500 font-medium">Manage access codes for spaces and branches</p>
            </button>"""
content = content.replace(old_button, new_button)

# Find start of code_credentials page
start_str = "  if (postLoginAction === 'code_credentials') {"
end_str = "  if (isLoggedIn && !postLoginAction && userRole !== 'employee') {"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    # replace the entire page
    new_page = """  if (postLoginAction === 'code_credentials') {
    return (
      <div className="min-h-screen bg-slate-50 p-10 font-['Inter']">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <button onClick={() => setPostLoginAction('global_gateway')} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-colors">
            <ArrowLeft size={16} /> Back to Gateway
          </button>
          
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Code Credentials Directory</h2>
            <p className="text-slate-500 font-medium mb-8">Directory tree of all space and branch access codes.</p>
            
            <div className="space-y-6">
              {allVendors.map(vendor => {
                const vendorLocs = allLocations.filter(loc => loc.vendorId === vendor.id);
                if (vendorLocs.length === 0) return null;
                const masterCode = vendorLocs[0].staffAccessCode ? `OWNER-ALL-${vendorLocs[0].staffAccessCode.toUpperCase()}` : 'N/A';
                
                return (
                  <div key={vendor.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900">{vendor.name}</h3>
                        <p className="text-sm font-bold text-slate-500">Space Master Access</p>
                      </div>
                    </div>
                    
                    <div className="mb-6 pl-4 border-l-2 border-indigo-200 ml-6 space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Master Code (Access All Branches)</label>
                        <div className="flex items-center gap-2">
                          <code className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-mono text-sm font-bold shadow-inner">
                            {masterCode}
                          </code>
                        </div>
                    </div>

                    <div className="space-y-4 pl-4 border-l-2 border-slate-200 ml-6">
                      <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest">Branches Directory</h4>
                      {vendorLocs.map((loc, idx) => (
                        <div key={loc.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm relative">
                          <div className="absolute -left-[1.1rem] top-8 w-4 h-[2px] bg-slate-200"></div>
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h5 className="font-bold text-slate-900">{loc.name}</h5>
                                <p className="text-xs font-medium text-slate-500">{loc.address}</p>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Branch Owner Code</span>
                                <code className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-mono text-sm font-bold">
                                  {loc.staffAccessCode ? `OWNER-${loc.staffAccessCode.toUpperCase()}` : 'N/A'}
                                </code>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Staff Access Code</span>
                                <code className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg font-mono text-xs font-bold">
                                  {loc.staffAccessCode ? loc.staffAccessCode.toUpperCase() : 'N/A'}
                                </code>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {allVendors.length === 0 && (
                <div className="text-center py-10 text-slate-500 font-bold">
                  No spaces found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

"""
    content = content[:start_idx] + new_page + content[end_idx:]

with open('App.tsx', 'w') as f:
    f.write(content)
