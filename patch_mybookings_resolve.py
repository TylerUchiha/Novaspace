import os

file_path = "components/MyBookingsPage.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_filter = """  const previousBookings = userReservations.filter(r => {
    // Show declined/cancelled reservations OR approved reservations that are in the past
    if (r.status === 'declined' || r.status === 'cancelled') return true;
    if (r.status === 'approved') return isReservationInPast(r, simulatedTimeMs || now);
    return false;
  }).sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));"""

new_filter = """  const previousBookings = userReservations.filter(r => {
    // Show declined/cancelled reservations OR approved reservations that are in the past
    if (r.status === 'declined' || r.status === 'cancelled' || r.status === 'resolved') return true;
    if (r.status === 'approved') return isReservationInPast(r, simulatedTimeMs || now);
    return false;
  }).sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));"""

content = content.replace(old_filter, new_filter)

old_opacity = """        : res.status === 'declined' || res.status === 'cancelled'
          ? 'border-slate-100 opacity-60' 
          : 'border-slate-100 shadow-sm'"""

new_opacity = """        : res.status === 'declined' || res.status === 'cancelled' || res.status === 'resolved'
          ? 'border-slate-100 opacity-60' 
          : 'border-slate-100 shadow-sm'"""

content = content.replace(old_opacity, new_opacity)

old_pill = """        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${res.status === 'approved' ? 'bg-emerald-500 text-white' : res.status === 'pending' ? 'bg-amber-500 text-white' : res.status === 'cancelled' || res.status === 'declined' ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-500'}`}>
          {isPendingInstapay ? 'awaiting payment' : res.status}
        </div>"""

new_pill = """        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${res.status === 'approved' ? 'bg-emerald-500 text-white' : res.status === 'pending' ? 'bg-amber-500 text-white' : res.status === 'cancelled' || res.status === 'declined' || res.status === 'resolved' ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-500'}`}>
          {isPendingInstapay ? 'awaiting payment' : res.status === 'resolved' ? 'cancelled' : res.status}
        </div>"""

content = content.replace(old_pill, new_pill)


with open(file_path, "w") as f:
    f.write(content)

print("MyBookingsPage resolve patched.")
