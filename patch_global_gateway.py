import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Update LandingPage onLogin
old_onLogin = """      onLogin={async (role) => {
        await signIn(role);
        setIsLocationConfirmed(false);
        setPostLoginAction(null);
      }}"""

new_onLogin = """      onLogin={async (role) => {
        await signIn(role);
        setIsLocationConfirmed(false);
        if (role === 'owner') {
          setPostLoginAction('global_gateway');
        } else {
          setPostLoginAction(null);
        }
      }}"""

content = content.replace(old_onLogin, new_onLogin)

global_gateway_code = """  if (postLoginAction === 'global_gateway') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-['Inter']">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Crown size={40} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Global Access Gateway</h1>
            <p className="text-slate-500 font-medium">Where would you like to go?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => setPostLoginAction('select_network')} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:border-emerald-200 transition-all group flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Access Network</h2>
              <p className="text-slate-500 font-medium">Log into working spaces and manage operations</p>
            </button>
            <button onClick={() => setPostLoginAction('instapay_info')} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:border-emerald-200 transition-all group flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wallet size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Financial Data</h2>
              <p className="text-slate-500 font-medium">InstaPay details and global finance info</p>
            </button>
          </div>
          <div className="mt-12 text-center">
            <button onClick={handleLogout} className="text-slate-400 font-bold hover:text-slate-600 transition-colors">Sign Out</button>
          </div>
        </div>
      </div>
    );
  }

  if (postLoginAction === 'instapay_info') {
    return (
      <div className="min-h-screen bg-slate-50 p-10 font-['Inter']">
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <button onClick={() => setPostLoginAction('global_gateway')} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-colors">
            <ArrowLeft size={16} /> Back to Gateway
          </button>
          
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Financial Information</h2>
            <p className="text-slate-500 font-medium mb-8">Global financial configuration and transfer details.</p>
            
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Wallet size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Global InstaPay Account</h3>
                    <p className="text-sm font-bold text-slate-500">Sync one InstaPay handle to all branches</p>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">InstaPay Handle</label>
                    <div className="flex items-center gap-2">
                      <input 
                        id="global-instapay-input"
                        type="text" 
                        placeholder="e.g. novaspace@instapay" 
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono text-sm font-bold text-slate-900 shadow-sm"
                        defaultValue={allVendors[0]?.instapayAccount || ''}
                      />
                      <button 
                        onClick={() => {
                          const input = document.getElementById('global-instapay-input') as HTMLInputElement;
                          if (input.value && allVendors.length > 0) {
                            handleUpdateVendor(allVendors[0].id, { instapayAccount: input.value });
                            alert('Global InstaPay account updated successfully.');
                          }
                        }}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
"""

target = "  if (isLoggedIn && !postLoginAction && userRole !== 'employee') {"
content = content.replace(target, global_gateway_code + "\n" + target)

# Update VendorSelection onBack
vendor_onback_old = """      onBack={() => { 
        if (userRole !== 'employee') {
          setPostLoginAction(null);
        } else {
          handleLogout();
        }
      }}"""

vendor_onback_new = """      onBack={() => { 
        if (userRole === 'owner') {
          setPostLoginAction('global_gateway');
        } else if (userRole === 'manager') {
          setPostLoginAction(null);
        } else if (userRole === 'customer') {
          setPostLoginAction(null);
        } else {
          handleLogout();
        }
      }}"""
content = content.replace(vendor_onback_old, vendor_onback_new)

with open('App.tsx', 'w') as f:
    f.write(content)
