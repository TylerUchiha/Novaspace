import os

file_path = "components/VendorSelection.tsx"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace(") : (\n                  <span className=\"text-xs font-bold text-slate-400 italic col-span-2\">No tags available</span>\n                );\n              })()}\n              ) : (\n                  <span className=\"text-xs font-bold text-slate-400 italic col-span-2\">No tags available</span>\n                );\n              })()", ") : (\n                  <span className=\"text-xs font-bold text-slate-400 italic col-span-2\">No tags available</span>\n                );\n              })()}")
content = content.replace("                );\n              })()}\n              ) : (\n                <span className=\"text-xs font-bold text-slate-400 italic col-span-2\">No tags available</span>\n              )", "                );\n              })()}")
content = content.replace("                );\n              })()}\n              ) : (\n                <span className=\"text-xs font-bold text-slate-400 italic col-span-2\">No cities available</span>\n              )", "                );\n              })()}")


with open(file_path, "w") as f:
    f.write(content)

print("Syntax fixed.")
