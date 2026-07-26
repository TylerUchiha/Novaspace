with open("constants.ts", "r") as f:
    content = f.read()

new_room = """          { 
            id: '103-shared', 
            name: 'Creative Hotdesks', 
            type: 'SharedDesk', 
            capacity: 4,
            totalSeats: 4,
            status: RoomStatus.AVAILABLE, 
            amenities: ['Monitors', 'Ergonomic Chairs'], 
            x: 55, 
            y: 5, 
            width: 35, 
            height: 18, 
            pricePerHour: 20, 
            images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800&h=600']
          },
"""

content = content.replace("rooms: [", "rooms: [\n" + new_room, 1)

with open("constants.ts", "w") as f:
    f.write(content)
