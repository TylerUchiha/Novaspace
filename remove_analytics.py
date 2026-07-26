import sys

with open('App.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if i == 1474 and 'Store Analytics' in line:
        continue
    new_lines.append(line)

with open('App.tsx', 'w') as f:
    f.writelines(new_lines)
