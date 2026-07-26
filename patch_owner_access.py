import re

with open('App.tsx', 'r') as f:
    content = f.read()

# 1. Update LandingPage onLogin
content = re.sub(
    r"        if \(role === 'owner' \|\| role === 'manager'\) \{\n          setPostLoginAction\('global_gateway'\);\n        \} else \{\n          setPostLoginAction\(null\);\n        \}",
    "        setPostLoginAction(null);",
    content
)

# 2. Update Welcome Page condition
content = content.replace(
    "if (isLoggedIn && !postLoginAction && !isStaff) {",
    "if (isLoggedIn && !postLoginAction && userRole !== 'employee') {"
)

# 3. Update VendorSelection onBack
vendor_onback_old = """      onBack={() => { 
        if (userRole === 'owner' || userRole === 'manager') {
          setPostLoginAction('global_gateway');
        } else if (userRole === 'customer') {
          setPostLoginAction(null);
        } else {
          handleLogout();
        }
      }}"""

vendor_onback_new = """      onBack={() => { 
        if (userRole !== 'employee') {
          setPostLoginAction(null);
        } else {
          handleLogout();
        }
      }}"""

content = content.replace(vendor_onback_old, vendor_onback_new)

# 4. Remove global_gateway and instapay_info blocks
# Find the start of global_gateway
start_idx = content.find("  if (postLoginAction === 'global_gateway') {")
# Find the end of instapay_info (it ends right before `if (isLoggedIn && !postLoginAction && userRole !== 'employee') {`)
end_idx = content.find("  if (isLoggedIn && !postLoginAction && userRole !== 'employee') {")

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + content[end_idx:]
    print("Removed global_gateway and instapay_info blocks.")
else:
    print(f"Could not find blocks. start: {start_idx}, end: {end_idx}")

with open('App.tsx', 'w') as f:
    f.write(content)

