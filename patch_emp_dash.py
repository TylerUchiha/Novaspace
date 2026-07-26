import os

file_path = "components/EmployeeDashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add states
old_states = """  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;"""

new_states = """  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const [selectedCancelledDate, setSelectedCancelledDate] = useState(new Date().toISOString().split('T')[0]);

  const currentWeekDays = useMemo(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
      days.push({ dateStr, label });
    }
    return days;
  }, []);"""

content = content.replace(old_states, new_states)

# Add logic for groupedReservations
old_filter = """      if (filterStatus !== 'cancelled' && res.date !== today) return false;
      if (filterStatus !== 'cancelled' && (res.status === 'cancelled' || res.status === 'declined')) return false;
      if (filterStatus === 'cancelled' && res.status !== 'cancelled' && res.status !== 'declined') return false;"""

new_filter = """      if (filterStatus !== 'cancelled' && res.date !== today) return false;
      if (filterStatus !== 'cancelled' && (res.status === 'cancelled' || res.status === 'declined')) return false;
      if (filterStatus === 'cancelled') {
        if (res.status !== 'cancelled' && res.status !== 'declined') return false;
        if (res.date !== selectedCancelledDate) return false;
      }"""

content = content.replace(old_filter, new_filter)

# Add deps for groupedReservations
content = content.replace("  }, [reservations, searchTerm, filterLocation, allUsers]);", "  }, [reservations, searchTerm, filterLocation, allUsers, selectedCancelledDate, filterStatus]);")

# Render calendar
old_render = """        <div className={`${filterStatus === 'cancelled' ? 'xl:col-span-12' : 'xl:col-span-7'} flex flex-col gap-6`}>
          {currentLocPolicy && currentLocPolicy.trim() !== '' && ("""

new_render = """        <div className={`${filterStatus === 'cancelled' ? 'xl:col-span-12' : 'xl:col-span-7'} flex flex-col gap-6`}>
          {filterStatus === 'cancelled' && (
            <div className="grid grid-cols-2 md:grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              {currentWeekDays.map((day) => (
                <button
                  key={day.dateStr}
                  onClick={() => setSelectedCancelledDate(day.dateStr)}
                  className={`bg-white transition-colors flex flex-col items-center justify-center text-center py-6 px-2 hover:bg-slate-50 relative ${selectedCancelledDate === day.dateStr ? 'z-10' : ''}`}
                >
                  <span className={`text-sm font-bold ${selectedCancelledDate === day.dateStr ? 'text-blue-700' : 'text-slate-700'}`}>{day.label}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${selectedCancelledDate === day.dateStr ? 'text-blue-400' : 'text-slate-400'}`}>WEEKLY</span>
                  {selectedCancelledDate === day.dateStr && (
                    <div className="absolute inset-0 ring-inset ring-2 ring-blue-500 rounded-xl md:rounded-none pointer-events-none"></div>
                  )}
                </button>
              ))}
            </div>
          )}
          {currentLocPolicy && currentLocPolicy.trim() !== '' && ("""

content = content.replace(old_render, new_render)

with open(file_path, "w") as f:
    f.write(content)

print("EmployeeDashboard patched.")
