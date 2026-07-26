import os

file_path = "components/EmployeeDashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

old = "viewingAddonsFor.status === 'mixed' ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'"
new = "viewingAddonsFor.status === 'resolved' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'"

content = content.replace(old, new)

with open(file_path, "w") as f:
    f.write(content)

print("Addons patched.")
