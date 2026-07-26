with open("components/VendorSelection.tsx", "r") as f:
    content = f.read()

junk = """                ) : (
                  <span className="text-xs font-bold text-slate-400 italic col-span-2">No tags available</span>
                );
              })()}}"""

content = content.replace(junk, "")

with open("components/VendorSelection.tsx", "w") as f:
    f.write(content)

