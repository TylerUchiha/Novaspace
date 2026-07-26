import re

with open('components/LandingPage.tsx', 'r') as f:
    content = f.read()

target = """                    <button 
                      type="button"
                      onClick={() => setIsOwnerAccessModalOpen(true)}
                      className="w-full py-4 rounded-2xl font-black text-sm text-emerald-600 bg-white border-2 border-emerald-100 hover:bg-emerald-50 transition-all active:scale-[0.98] mt-3 flex items-center justify-center gap-3 shadow-sm"
                    >
                      Owner Access
                      <Crown size={18} className="text-amber-400" />
                    </button>"""

addition = """
                    <button 
                      type="button"
                      onClick={() => setIsOwnerModalOpen(true)}
                      className="w-full py-4 rounded-2xl font-black text-sm text-blue-600 bg-white border-2 border-blue-100 hover:bg-blue-50 transition-all active:scale-[0.98] mt-3 flex items-center justify-center gap-3 shadow-sm"
                    >
                      Global Access
                      <Globe size={18} className="text-blue-500" />
                    </button>"""

content = content.replace(target, target + addition)

with open('components/LandingPage.tsx', 'w') as f:
    f.write(content)
