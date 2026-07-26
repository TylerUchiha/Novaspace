import os

file_path = "App.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Fix 1: Calculate remainingSeconds for SharedDesk
old_shared_desk_calc = """        if (room.type === 'SharedDesk' && room.totalSeats) {
          occupiedSeats = overlappingReservations.length;
          if (occupiedSeats >= room.totalSeats) {
            status = RoomStatus.OCCUPIED;
          } else {
            status = RoomStatus.AVAILABLE;
          }
        } else {"""

new_shared_desk_calc = """        if (room.type === 'SharedDesk' && room.totalSeats) {
          occupiedSeats = overlappingReservations.length;
          if (occupiedSeats >= room.totalSeats) {
            status = RoomStatus.OCCUPIED;
          } else {
            status = RoomStatus.AVAILABLE;
          }
          const resEnds = overlappingReservations.map(r => timeToMinutes(r.time) * 60 + (r.duration * 3600));
          const soonestEnd = Math.min(...resEnds);
          remainingSeconds = soonestEnd - selectedSeconds;
        } else {"""
content = content.replace(old_shared_desk_calc, new_shared_desk_calc)

# Fix 2: onClick handler, overflow-hidden removal, and gradient color
# We need to find the room mapping in App.tsx

import re

# Find the onClick block inside the map
old_onclick = """                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (room.type !== 'Service') setSelectedRoomIds(prev => prev.includes(room.id) ? prev.filter(id => id !== room.id) : [...prev, room.id]); 
                  }} """

new_onclick = """                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (room.type === 'Service') return;
                    if (!isStaff && room.status === RoomStatus.OCCUPIED) return;
                    setSelectedRoomIds(prev => prev.includes(room.id) ? prev.filter(id => id !== room.id) : [...prev, room.id]); 
                  }} """

content = content.replace(old_onclick, new_onclick)

# Remove overflow-hidden from className
content = content.replace("cursor-pointer border-2 rounded-xl flex flex-col items-center justify-center text-center shadow-md p-2 overflow-hidden", "cursor-pointer border-2 rounded-xl flex flex-col items-center justify-center text-center shadow-md p-2")

# Fix the gradient and rounded corners for the progress bar
old_progress_bar = """                  {room.type === 'SharedDesk' && room.totalSeats !== undefined && (
                    <div className="absolute inset-y-0 left-0 transition-all duration-500 z-0 opacity-20" style={{ width: `${(room.occupiedSeats || 0) / room.totalSeats * 100}%`, backgroundColor: (room.occupiedSeats || 0) >= room.totalSeats ? '#f43f5e' : ((room.occupiedSeats || 0) > 0 ? '#eab308' : 'transparent') }}></div>
                  )}"""

new_progress_bar = """                  {room.type === 'SharedDesk' && room.totalSeats !== undefined && (
                    <div className="absolute inset-y-0 left-0 transition-all duration-500 z-0 opacity-30 rounded-xl" style={{ 
                      width: `${(room.occupiedSeats || 0) / room.totalSeats * 100}%`, 
                      backgroundColor: (room.occupiedSeats || 0) > 0 ? `rgb(${Math.round(234 + (244 - 234) * ((room.occupiedSeats || 0) / room.totalSeats))}, ${Math.round(179 + (63 - 179) * ((room.occupiedSeats || 0) / room.totalSeats))}, ${Math.round(8 + (94 - 8) * ((room.occupiedSeats || 0) / room.totalSeats))})` : 'transparent'
                    }}></div>
                  )}"""

content = content.replace(old_progress_bar, new_progress_bar)

with open(file_path, "w") as f:
    f.write(content)

print("App.tsx patched successfully!")
