import os

file_path = "App.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_progress = """                  {room.type === 'SharedDesk' && room.totalSeats !== undefined && (
                    <div className="absolute inset-y-0 left-0 transition-all duration-500 z-0 opacity-30 rounded-xl" style={{ 
                      width: `${(room.occupiedSeats || 0) / room.totalSeats * 100}%`, 
                      backgroundColor: (room.occupiedSeats || 0) > 0 ? `rgb(${Math.round(234 + (244 - 234) * ((room.occupiedSeats || 0) / room.totalSeats))}, ${Math.round(179 + (63 - 179) * ((room.occupiedSeats || 0) / room.totalSeats))}, ${Math.round(8 + (94 - 8) * ((room.occupiedSeats || 0) / room.totalSeats))})` : 'transparent'
                    }}></div>
                  )}"""

new_progress = """                  {room.type === 'SharedDesk' && room.totalSeats !== undefined && (
                    <div className="absolute inset-0 rounded-xl overflow-hidden z-0 pointer-events-none">
                      <div className="absolute inset-y-0 left-0 transition-all duration-500 opacity-30" style={{ 
                        width: `${(room.occupiedSeats || 0) / room.totalSeats * 100}%`, 
                        backgroundColor: (room.occupiedSeats || 0) > 0 ? `rgb(${Math.round(234 + (244 - 234) * ((room.occupiedSeats || 0) / room.totalSeats))}, ${Math.round(179 + (63 - 179) * ((room.occupiedSeats || 0) / room.totalSeats))}, ${Math.round(8 + (94 - 8) * ((room.occupiedSeats || 0) / room.totalSeats))})` : 'transparent'
                      }}></div>
                    </div>
                  )}"""

content = content.replace(old_progress, new_progress)

with open(file_path, "w") as f:
    f.write(content)

print("Progress bar overflow patched.")
