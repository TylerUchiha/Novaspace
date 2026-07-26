import re

with open('components/LocationSelection.tsx', 'r') as f:
    content = f.read()

# Just remove the floating bot button and chat widget completely
# Since it starts around line 610 with Bouncy Typing Indicator and ends before ContactUsModal
content = re.sub(r"                  \{\/\* Bouncy Typing Indicator \*\/\}.*?      \{\/\* Reusable elegant Contact Us Popup \*\/\}", "      {/* Reusable elegant Contact Us Popup */}", content, flags=re.DOTALL)

with open('components/LocationSelection.tsx', 'w') as f:
    f.write(content)
