import os

file_path = "App.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_content = """                  <div className="px-4 py-2 mb-4 mt-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{userRole === 'owner' ? 'Branch Management' : 'Manager Access'}</p>
                  </div>
                  
                  <button onClick={() => setActiveTab('menu_config')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'menu_config' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Utensils size={20} /><span className="font-black text-sm hidden lg:block text-left">Customize Categories & Menu Items</span></button>
                  <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Store size={20} /><span className="font-black text-sm hidden lg:block">Store Analytics</span></button>
                  <button onClick={() => setActiveTab('payment_analytics')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'payment_analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><div className="flex items-center -space-x-1"><BarChart3 size={20} /><DollarSign size={14} /></div><span className="font-black text-sm hidden lg:block">Payment Analytics</span></button>
                  <button onClick={() => setActiveTab('shift_summary')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'shift_summary' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Users size={20} /><span className="font-black text-sm hidden lg:block">Staff Analytics</span></button>
                  
                  {userRole === 'owner' && (codeLoginType === 'global' || !codeLoginType) && ("""

new_content = """                  <div className="px-4 py-2 mb-4 mt-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{userRole === 'owner' ? 'Branch Management' : 'Manager Access'}</p>
                  </div>
                  
                  <button onClick={() => setActiveTab('payment_analytics')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'payment_analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><div className="flex items-center -space-x-1"><BarChart3 size={20} /><DollarSign size={14} /></div><span className="font-black text-sm hidden lg:block">Payment Analytics</span></button>
                  
                  {userRole === 'owner' && (codeLoginType === 'global' || !codeLoginType) && ("""

if old_content in content:
    content = content.replace(old_content, new_content)
    with open(file_path, "w") as f:
        f.write(content)
    print("Menus removed.")
else:
    print("Could not find the block to remove.")

