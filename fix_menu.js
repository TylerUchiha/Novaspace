const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const oldBlock = `{userRole === 'manager' && (
                <>
                  <button onClick={() => setActiveTab('menu_config')} className={\`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all \${activeTab === 'menu_config' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}\`}><Utensils size={20} /><span className="font-black text-sm hidden lg:block text-left">Customize Categories & Menu Items</span></button>
                  <button onClick={() => setActiveTab('analytics')} className={\`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all \${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}\`}><BarChart3 size={20} /><span className="font-black text-sm hidden lg:block">Store Analytics</span></button>
                  <button onClick={() => setActiveTab('shift_summary')} className={\`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all \${activeTab === 'shift_summary' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}\`}><BarChart3 size={20} /><span className="font-black text-sm hidden lg:block">Staff Analytics</span></button>
                  <button onClick={() => setActiveTab('socials_config')} className={\`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all \${activeTab === 'socials_config' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}\`}><Globe size={20} /><span className="font-black text-sm hidden lg:block">Social Channels</span></button>
                </>
              )}

              <button onClick={() => setActiveTab('payment_analytics')} className={\`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all \${activeTab === 'payment_analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}\`}><CreditCard size={20} /><span className="font-black text-sm hidden lg:block">Payment Analytics</span></button>`;

const startStr = "{userRole === 'manager' && (";
const endStr = "<span className=\"font-black text-sm hidden lg:block\">Payment Analytics</span></button>";

const newBlock = `<button onClick={() => setActiveTab('menu_config')} className={\`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all \${activeTab === 'menu_config' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}\`}><Utensils size={20} /><span className="font-black text-sm hidden lg:block text-left">Customize Categories & Menu Items</span></button>
              <button onClick={() => setActiveTab('analytics')} className={\`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all \${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}\`}><BarChart3 size={20} /><span className="font-black text-sm hidden lg:block">Store Analytics</span></button>
              <button onClick={() => setActiveTab('payment_analytics')} className={\`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all \${activeTab === 'payment_analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}\`}><CreditCard size={20} /><span className="font-black text-sm hidden lg:block">Payment Analytics</span></button>
              <button onClick={() => setActiveTab('shift_summary')} className={\`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all \${activeTab === 'shift_summary' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}\`}><BarChart3 size={20} /><span className="font-black text-sm hidden lg:block">Staff Analytics</span></button>
              <button onClick={() => setActiveTab('socials_config')} className={\`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all \${activeTab === 'socials_config' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}\`}><Globe size={20} /><span className="font-black text-sm hidden lg:block">Social Channels</span></button>`;

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr) + endStr.length;

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + newBlock + content.substring(endIdx);
  fs.writeFileSync('App.tsx', content, 'utf8');
  console.log('Fixed menu order');
} else {
  console.log('Could not find block');
}
