import re

with open('App.tsx', 'r') as f:
    content = f.read()

target = '<div className="flex flex-col items-start"><span className="text-sm font-black text-slate-900">{selectedVendor?.name}</span><span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{userProfile?.credits?.toLocaleString() || 0} Nova Points</span></div>'
replacement = '<div className="flex flex-col items-start"><span className="text-sm font-black text-slate-900">{selectedVendor?.name}</span></div>'

if target in content:
    content = content.replace(target, replacement)
    print("Replaced!")
else:
    print("Target not found.")

with open('App.tsx', 'w') as f:
    f.write(content)
