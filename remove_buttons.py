import sys

with open('App.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    line_num = i + 1
    
    # We are in the owner block around line 1474
    # 1474: menu_config
    # 1476: shift_summary
    if line_num in [1474, 1476]:
        continue
        
    new_lines.append(line)

with open('App.tsx', 'w') as f:
    f.writelines(new_lines)
