import sys

with open('App.tsx', 'r') as f:
    content = f.read()

start_str = "{userRole === 'manager' && ("
end_str = "<span className=\"font-black text-sm hidden lg:block\">Payment Analytics</span></button>"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    end_idx += len(end_str)
    new_block = """{userRole !== 'owner' ? (
                <>
                  <button onClick={() => setActiveTab('menu_config')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'menu_config' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Utensils size={20} /><span className="font-black text-sm hidden lg:block text-left">Customize Categories & Menu Items</span></button>
                  <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><BarChart3 size={20} /><span className="font-black text-sm hidden lg:block">Store Analytics</span></button>
                  <button onClick={() => setActiveTab('payment_analytics')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'payment_analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><CreditCard size={20} /><span className="font-black text-sm hidden lg:block">Payment Analytics</span></button>
                  <button onClick={() => setActiveTab('shift_summary')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'shift_summary' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><BarChart3 size={20} /><span className="font-black text-sm hidden lg:block">Staff Analytics</span></button>
                  <button onClick={() => setActiveTab('socials_config')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'socials_config' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Globe size={20} /><span className="font-black text-sm hidden lg:block">Social Channels</span></button>
                </>
              ) : (
                <>
                  <button onClick={() => setActiveTab('menu_config')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'menu_config' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Utensils size={20} /><span className="font-black text-sm hidden lg:block text-left">Customize Categories & Menu Items</span></button>
                  <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><BarChart3 size={20} /><span className="font-black text-sm hidden lg:block">Store Analytics</span></button>
                  <button onClick={() => setActiveTab('payment_analytics')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'payment_analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><CreditCard size={20} /><span className="font-black text-sm hidden lg:block">Payment Analytics</span></button>
                  <button onClick={() => setActiveTab('shift_summary')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'shift_summary' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><BarChart3 size={20} /><span className="font-black text-sm hidden lg:block">Staff Analytics</span></button>
                  <button onClick={() => setActiveTab('socials_config')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'socials_config' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Globe size={20} /><span className="font-black text-sm hidden lg:block">Social Channels</span></button>
                </>
              )}"""
    content = content[:start_idx] + new_block + content[end_idx:]
    with open('App.tsx', 'w') as f:
        f.write(content)
    print("Fixed!")
else:
    print("Could not find blocks.")
