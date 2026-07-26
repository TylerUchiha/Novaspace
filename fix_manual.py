import os

with open("components/VendorSelection.tsx", "r") as f:
    lines = f.read().split("\n")

for i, line in enumerate(lines):
    if "})()}}" in line:
        # Check context
        if "span className=\"text-xs font-bold text-slate-400 italic col-span-2\"" in lines[i-2] or "span className=\"text-xs font-bold text-slate-400 italic col-span-2\"" in lines[i-1]:
            # This is an IIFE closer. But wait, is it the one we WANT to close the IIFE?
            # Lines 220 and 280 are the IIFEs.
            if i < 300:
                lines[i] = line.replace("})()}}", "})()}")
            else:
                # These were wrongly replaced.
                pass

with open("components/VendorSelection.tsx", "w") as f:
    f.write("\n".join(lines))
