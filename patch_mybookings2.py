import os

file_path = "components/MyBookingsPage.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Fix opacity classes
old_opacity = """        : res.status === 'declined' 
          ? 'border-slate-100 opacity-60' 
          : 'border-slate-100 shadow-sm'"""
          
new_opacity = """        : res.status === 'declined' || res.status === 'cancelled'
          ? 'border-slate-100 opacity-60' 
          : 'border-slate-100 shadow-sm'"""

content = content.replace(old_opacity, new_opacity)

# Fix icon colors
old_icon_bg = """          <div className={`p-2 rounded-xl ${res.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : res.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>"""
new_icon_bg = """          <div className={`p-2 rounded-xl ${res.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : res.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>"""

# the text
old_pill_text = """        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${res.status === 'approved' ? 'bg-emerald-500 text-white' : res.status === 'pending' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
          {isPendingInstapay ? 'awaiting payment' : res.status}
        </div>"""

new_pill_text = """        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${res.status === 'approved' ? 'bg-emerald-500 text-white' : res.status === 'pending' ? 'bg-amber-500 text-white' : res.status === 'cancelled' || res.status === 'declined' ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-500'}`}>
          {isPendingInstapay ? 'awaiting payment' : res.status}
        </div>"""

content = content.replace(old_pill_text, new_pill_text)

# Fix cancel button condition
old_btn = """      {(isCurrent || res.status === 'pending') && res.status !== 'declined' && ("""
new_btn = """      {(isCurrent || res.status === 'pending') && res.status !== 'declined' && res.status !== 'cancelled' && ("""
content = content.replace(old_btn, new_btn)


with open(file_path, "w") as f:
    f.write(content)

print("MyBookingsPage 2 patched.")
