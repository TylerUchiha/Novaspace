import os

file_path = "components/EmployeeDashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Fix status logic in tableReservations
old_status_logic = """      const isApproved = group.every(r => r.status === 'approved');
      const isDeclined = group.every(r => r.status === 'declined');
      const isPending = group.every(r => r.status === 'pending');
      
      let status = 'pending';
      if (isApproved) status = 'approved';
      else if (isDeclined) status = 'declined';
      else if (!isPending) status = 'mixed';

      if (filterStatus === 'pending') {
        return status === 'pending' || status === 'mixed';
      }
      if (filterStatus === 'approved') {
        return status === 'approved';
      }
      return true;"""

new_status_logic = """      const status = group[0].status;

      if (filterStatus === 'pending') {
        return status === 'pending';
      }
      if (filterStatus === 'approved') {
        return status === 'approved';
      }
      return true;"""

content = content.replace(old_status_logic, new_status_logic)

# Fix status logic in render
old_render_status = """                      const isApproved = resGroup.every(r => r.status === 'approved');
                      const isDeclined = resGroup.every(r => r.status === 'declined');
                      const isPending = resGroup.every(r => r.status === 'pending');
                      
                      let status = 'pending';
                      if (isApproved) status = 'approved';
                      else if (isDeclined) status = 'declined';
                      else if (!isPending) status = 'mixed';"""

new_render_status = """                      const isApproved = resGroup.every(r => r.status === 'approved');
                      const status = resGroup[0].status;"""

content = content.replace(old_render_status, new_render_status)

# Replace 'mixed' in color styling
old_color = """${status === 'approved' ? 'bg-emerald-100 text-emerald-700' : status === 'pending' ? 'bg-amber-100 text-amber-700' : status === 'mixed' ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'}"""
new_color = """${status === 'approved' ? 'bg-emerald-100 text-emerald-700' : status === 'pending' ? 'bg-amber-100 text-amber-700' : status === 'resolved' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}"""
content = content.replace(old_color, new_color)

# Also fix the initial filter to allow resolved in the cancelled page
old_filter = """      if (filterStatus === 'cancelled') {
        if (res.status !== 'cancelled' && res.status !== 'declined') return false;
        if (res.date !== selectedCancelledDate) return false;
      }"""
new_filter = """      if (filterStatus === 'cancelled') {
        if (res.status !== 'cancelled' && res.status !== 'declined' && res.status !== 'resolved') return false;
        if (res.date !== selectedCancelledDate) return false;
      }"""
content = content.replace(old_filter, new_filter)


with open(file_path, "w") as f:
    f.write(content)

print("EmployeeDashboard status patched.")
