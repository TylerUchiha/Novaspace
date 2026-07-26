import re

with open('components/EmployeeDashboard.tsx', 'r') as f:
    content = f.read()

pattern = r"""        \{\/\* Order Status Badge & Controls \*\/\}
        <div className="flex items-center justify-between border-t border-slate-100/80 pt-2\.5 mt-0\.5">
          <div>.*?</div>
          <div className="flex items-center gap-1\.5">"""

replacement = """        {/* Order Status Badge & Controls */}
        <div className="flex items-center justify-end border-t border-slate-100/80 pt-2.5 mt-0.5">
          <div className="flex items-center gap-1.5">"""

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('components/EmployeeDashboard.tsx', 'w') as f:
    f.write(new_content)
