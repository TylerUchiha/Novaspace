with open("components/VendorSelection.tsx", "r") as f:
    lines = f.read().split("\n")

# add "))" after line 389, 442, 532... actually let's just find where it's missing
for i, line in enumerate(lines):
    if "{(vendor.tags || []).length > 3 && (" in line:
        if "))" not in lines[i-1] and "))" not in lines[i-2]:
            lines.insert(i, "                        ))")

with open("components/VendorSelection.tsx", "w") as f:
    f.write("\n".join(lines))
