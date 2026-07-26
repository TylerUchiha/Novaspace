import os

file_path = "App.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_buttons = """          <button 
            onClick={handleLogout} 
            className="mt-auto w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-rose-600 transition-all"
          >
            <LogOut size={20} />
            <span className="font-black text-sm hidden lg:block">Return to Coworking Spaces</span>
          </button>"""

new_buttons = """          <button 
            onClick={() => { setSelectedVendor(null); setIsLocationConfirmed(false); }} 
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 transition-all"
          >
            <Building size={20} />
            <span className="font-black text-sm hidden lg:block">Return to Coworking Spaces</span>
          </button>
          <button 
            onClick={handleLogout} 
            className="mt-auto w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-rose-600 transition-all"
          >
            <LogOut size={20} />
            <span className="font-black text-sm hidden lg:block">Exit Network</span>
          </button>"""

content = content.replace(old_buttons, new_buttons)

# ensure Building is imported
if "Building" not in content[:1500]:
    content = content.replace("import { ", "import { Building, ", 1)

with open(file_path, "w") as f:
    f.write(content)

print("App logout buttons patched.")
