import os

file_path = "components/EmployeeDashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add ChevronDown to imports if not there
if "ChevronDown" not in content:
    content = content.replace("ChevronLeft,", "ChevronLeft,\n  ChevronDown,")

old_render = """          {filterStatus === 'cancelled' && (
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
          )}"""

new_render = """          {filterStatus === 'cancelled' && (
            <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={18} className="text-blue-500" />
                  Filter by Date
                </h3>
              </div>
              <div className="relative">
                <select
                  value={selectedCancelledDate}
                  onChange={(e) => setSelectedCancelledDate(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 text-slate-900 font-bold py-3 pl-5 pr-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  {currentWeekDays.map(day => (
                    <option key={day.dateStr} value={day.dateStr}>{day.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>
          )}"""

content = content.replace(old_render, new_render)

with open(file_path, "w") as f:
    f.write(content)

print("Dropdown patched.")
