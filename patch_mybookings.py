import os

file_path = "components/MyBookingsPage.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_filter = """  const previousBookings = userReservations.filter(r => {
    // Show declined/cancelled reservations OR approved reservations that are in the past
    if (r.status === 'declined') return true;
    if (r.status === 'approved') return isReservationInPast(r, simulatedTimeMs || now);
    return false;
  }).sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));"""

new_filter = """  const previousBookings = userReservations.filter(r => {
    // Show declined/cancelled reservations OR approved reservations that are in the past
    if (r.status === 'declined' || r.status === 'cancelled') return true;
    if (r.status === 'approved') return isReservationInPast(r, simulatedTimeMs || now);
    return false;
  }).sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));"""

content = content.replace(old_filter, new_filter)

with open(file_path, "w") as f:
    f.write(content)

print("MyBookingsPage patched.")
