import re

with open('App.tsx', 'r') as f:
    content = f.read()

pattern = r"""              <div className="flex items-center gap-4 px-6 py-3 rounded-2xl group transition-all">
                <img src=\{selectedVendor\?\.logo\} className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                <div className="flex flex-col items-start"><span className="text-sm font-black text-slate-900">\{selectedVendor\?\.name\}</span><span className="text-\[10px\] font-bold text-slate-400 uppercase tracking-wider">Network Console</span></div>
             </div>"""

replacement = """              <button onClick={() => setActiveTab('credits')} className="flex items-center gap-4 px-6 py-3 rounded-2xl group transition-all hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer text-left">
                <img src={selectedVendor?.logo} className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                <div className="flex flex-col items-start"><span className="text-sm font-black text-slate-900">{selectedVendor?.name}</span><span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{userProfile?.credits?.toLocaleString() || 0} Nova Points</span></div>
             </button>"""

content = re.sub(pattern, replacement, content)

with open('App.tsx', 'w') as f:
    f.write(content)

