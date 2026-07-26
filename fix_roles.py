import sys

with open('App.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    line_num = i + 1
    if line_num in [41, 248, 1540, 1959]:
        new_lines.append(line)
        continue
    
    if "userRole === 'manager'" in line:
        line = line.replace("userRole === 'manager'", "userRole === 'owner' || userRole === 'manager'")
    new_lines.append(line)

with open('App.tsx', 'w') as f:
    f.writelines(new_lines)
