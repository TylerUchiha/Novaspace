import os

file_path = "App.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_onclick = """                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (room.type === 'Service') return;
                    if (room.status === RoomStatus.OCCUPIED) return;
                    setSelectedRoomIds(prev => prev.includes(room.id) ? prev.filter(id => id !== room.id) : [...prev, room.id]); 
                  }} """

new_onclick = """                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (room.type === 'Service') return;
                    if (!isStaff && (room.status === RoomStatus.OCCUPIED || room.status === RoomStatus.RESERVED)) return;
                    setSelectedRoomIds(prev => prev.includes(room.id) ? prev.filter(id => id !== room.id) : [...prev, room.id]); 
                  }} """

content = content.replace(old_onclick, new_onclick)

with open(file_path, "w") as f:
    f.write(content)

print("Onclick patched.")
