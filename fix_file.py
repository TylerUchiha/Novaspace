import re

with open("components/VendorSelection.tsx", "r") as f:
    content = f.read()

# Fix the IIFE closing braces for the actual IIFEs
content = content.replace("                ) : (\n                  <span className=\"text-xs font-bold text-slate-400 italic col-span-2\">No tags available</span>\n                );\n              })()}}", "                ) : (\n                  <span className=\"text-xs font-bold text-slate-400 italic col-span-2\">No tags available</span>\n                );\n              })()}")
content = content.replace("                ) : (\n                  <span className=\"text-xs font-bold text-slate-400 italic col-span-2\">No cities available</span>\n                );\n              })()}}", "                ) : (\n                  <span className=\"text-xs font-bold text-slate-400 italic col-span-2\">No cities available</span>\n                );\n              })()}")

# Fix the incorrectly replaced maps (lines 389, 455, 555)
# They were originally just `))` since they didn't have a ternary `?` that needed `) : (`
# Wait, if they didn't have `) : (`, how did my regex match them?!
# Ah, I replaced `))` with `)) ) : ( ... )})()}}`?
