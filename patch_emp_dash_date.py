import os

file_path = "components/EmployeeDashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_select = """              <div className="relative">
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
              </div>"""

new_date = """              <div className="relative">
                <input
                  type="date"
                  value={selectedCancelledDate}
                  onChange={(e) => setSelectedCancelledDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-900 font-bold py-3 px-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                />
              </div>"""

if old_select in content:
    content = content.replace(old_select, new_date)
else:
    print("Could not find old_select block")

with open(file_path, "w") as f:
    f.write(content)

print("Date input patched.")
