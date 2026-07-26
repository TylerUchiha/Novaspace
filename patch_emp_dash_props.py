import os

file_path = "components/EmployeeDashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace("  onCancelReservation,\n  onApproveReservation,", "  onCancelReservation,\n  onResolveCancellation,\n  onApproveReservation,")

with open(file_path, "w") as f:
    f.write(content)

print("Props patched.")
