import re

with open('App.tsx', 'r') as f:
    content = f.read()

global_gateway_code = """
  if (postLoginAction === 'global_gateway') {
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
            <button onClick={() => setPostLoginAction('code_credentials')} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:border-emerald-200 transition-all group flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <KeyRound size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Credentials</h2>
              <p className="text-slate-500 font-medium">View branch access codes</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (postLoginAction === 'code_credentials') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-['Inter']">
        <div className="max-w-4xl w-full">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setPostLoginAction('global_gateway')} className="p-3 bg-white rounded-full text-slate-400 hover:text-slate-900 shadow-sm hover:shadow-md transition-all">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Branch Credentials</h1>
              <p className="text-slate-500 font-medium">Access codes for your network</p>
            </div>
          </div>
          
          <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100">
            <div className="space-y-6">
              {allLocations.map((loc) => (
                <div key={loc.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-200/60">
                  <div className="flex items-center gap-6">
                    <img src={loc.image} alt={loc.name} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                    <div>
                      <h3 className="font-black text-slate-900 text-lg">{loc.name}</h3>
                      <p className="text-sm font-bold text-slate-400">{loc.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Employee Code</p>
                      <code className="px-4 py-2 bg-white rounded-xl text-sm font-black text-slate-900 shadow-sm border border-slate-200">
                        {loc.staffAccessCode}
                      </code>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Owner Code</p>
                      <code className="px-4 py-2 bg-emerald-50 rounded-xl text-sm font-black text-emerald-700 shadow-sm border border-emerald-100">
                        OWNER-{loc.staffAccessCode}
                      </code>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vendor Code</p>
                      <code className="px-4 py-2 bg-blue-50 rounded-xl text-sm font-black text-blue-700 shadow-sm border border-blue-100">
                        OWNER-ALL-{loc.staffAccessCode}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
"""

content = content.replace("  if (postLoginAction === 'edit_profile' && userRole !== 'employee') {", global_gateway_code + "\n  if (postLoginAction === 'edit_profile' && userRole !== 'employee') {")

with open('App.tsx', 'w') as f:
    f.write(content)
