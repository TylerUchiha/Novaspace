with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace("if (userRole === 'employee') setActiveTab('shift_summary');", "if (userRole === 'employee') setActiveTab('staff_registry');")

with open('App.tsx', 'w') as f:
    f.write(content)
