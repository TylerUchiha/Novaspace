import os

file_path = "App.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_buttons = """        <div className="mt-auto space-y-2">
          {(!isStaff || codeLoginType === 'all') && (
            <button 
              onClick={() => setIsLocationConfirmed(false)}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 transition-all"
            >
              <ChevronLeft size={20} />
              <span className="font-black text-sm hidden lg:block">Back to Branches</span>
            </button>
          )}
          <button 
            onClick={handleLogout} 
            className="mt-auto w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-rose-600 transition-all"
          >
            <LogOut size={20} />
            <span className="font-black text-sm hidden lg:block">Exit Network</span>
          </button>
        </div>"""

new_buttons = """        <div className="mt-auto space-y-2">
          {(!isStaff || codeLoginType === 'all' || (userRole === 'owner')) && (
            <button 
              onClick={() => setIsLocationConfirmed(false)}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 transition-all"
            >
              <ChevronLeft size={20} />
              <span className="font-black text-sm hidden lg:block">Return to Branches</span>
            </button>
          )}
          <button 
            onClick={handleLogout} 
            className="mt-auto w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-rose-600 transition-all"
          >
            <LogOut size={20} />
            <span className="font-black text-sm hidden lg:block">Return to Coworking Spaces</span>
          </button>
        </div>"""

content = content.replace(old_buttons, new_buttons)

with open(file_path, "w") as f:
    f.write(content)

print("App buttons patched.")
