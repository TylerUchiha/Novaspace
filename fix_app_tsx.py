with open("App.tsx", "r") as f:
    content = f.read()

old_content = """          <button 
            onClick={() => { setSelectedVendor(null); setIsLocationConfirmed(false); }} 
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 transition-all"
          >
            <Building size={20} />
            <span className="font-black text-sm hidden lg:block">Return to Coworking Spaces</span>
          </button>"""

new_content = """          {(!isStaff || codeLoginType === 'all' || (userRole === 'owner')) && (
            <button 
              onClick={() => { setSelectedVendor(null); setIsLocationConfirmed(false); }} 
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 transition-all"
            >
              <Building size={20} />
              <span className="font-black text-sm hidden lg:block">Return to Coworking Spaces</span>
            </button>
          )}"""

content = content.replace(old_content, new_content)

with open("App.tsx", "w") as f:
    f.write(content)

