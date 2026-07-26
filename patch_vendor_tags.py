import os

file_path = "components/VendorSelection.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_tags_render = """              {allTags.length > 0 ? (
                allTags.map(tag => ("""

new_tags_render = """              {(() => {
                const availableTags = new Map();
                vendors.forEach(v => {
                  const vLocs = locations.filter(l => l.vendorId === v.id);
                  
                  // Check if this vendor matches text search
                  const query = searchQuery.toLowerCase().trim();
                  let matchesSearch = true;
                  if (query) {
                    matchesSearch = v.name.toLowerCase().includes(query) || v.description.toLowerCase().includes(query);
                  }
                  
                  // Check if this vendor matches selected cities
                  let matchesCities = true;
                  if (selectedCities.length > 0) {
                    const vCities = new Set();
                    vLocs.forEach(l => { if (l.city) vCities.add(l.city.trim().toLowerCase()); });
                    matchesCities = selectedCities.some(c => vCities.has(c.trim().toLowerCase()));
                  }
                  
                  // If it matches search and cities, its tags are "available"
                  if (matchesSearch && matchesCities) {
                    v.tags?.forEach(t => {
                      if(t) availableTags.set(t.trim().toLowerCase(), t.trim());
                    });
                    vLocs.forEach(l => {
                      l.tags?.forEach(t => {
                        if(t) availableTags.set(t.trim().toLowerCase(), t.trim());
                      });
                    });
                  }
                });
                
                // Always include currently selected tags even if they would lead to 0 results, so user can uncheck them
                selectedTags.forEach(t => {
                  if (t) availableTags.set(t.trim().toLowerCase(), t.trim());
                });
                
                const finalTags = Array.from(availableTags.values()).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
                
                return finalTags.length > 0 ? (
                  finalTags.map((tag: string) => ("""

content = content.replace(old_tags_render, new_tags_render)

old_cities_render = """              {allCities.length > 0 ? (
                allCities.map(city => ("""

new_cities_render = """              {(() => {
                const availableCities = new Map();
                vendors.forEach(v => {
                  const vLocs = locations.filter(l => l.vendorId === v.id);
                  
                  // Check if this vendor matches text search
                  const query = searchQuery.toLowerCase().trim();
                  let matchesSearch = true;
                  if (query) {
                    matchesSearch = v.name.toLowerCase().includes(query) || v.description.toLowerCase().includes(query);
                  }
                  
                  // Check if this vendor matches selected tags
                  let matchesTags = true;
                  if (selectedTags.length > 0) {
                    const vTags = new Set((v.tags || []).map(t => t.trim().toLowerCase()));
                    vLocs.forEach(l => l.tags?.forEach(t => vTags.add(t.trim().toLowerCase())));
                    matchesTags = selectedTags.every(t => vTags.has(t.trim().toLowerCase()));
                  }
                  
                  if (matchesSearch && matchesTags) {
                    vLocs.forEach(l => {
                      if (l.city) availableCities.set(l.city.trim().toLowerCase(), l.city.trim());
                    });
                  }
                });
                
                selectedCities.forEach(c => {
                  if (c) availableCities.set(c.trim().toLowerCase(), c.trim());
                });
                
                const finalCities = Array.from(availableCities.values()).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
                
                return finalCities.length > 0 ? (
                  finalCities.map((city: string) => ("""

content = content.replace(old_cities_render, new_cities_render)

# Add extra closure for the IIFE blocks
content = content.replace("                ))", "                ))\n                ) : (\n                  <span className=\"text-xs font-bold text-slate-400 italic col-span-2\">No tags available</span>\n                );\n              })()}")
# Replace the second one (cities) carefully
import re
content = re.sub(r'                \)\)\n              \) : \(\n                <span className="text-xs font-bold text-slate-400 italic col-span-2">No cities available</span>\n              \)', r'                ))\n                ) : (\n                  <span className="text-xs font-bold text-slate-400 italic col-span-2">No cities available</span>\n                );\n              })()', content)
content = re.sub(r'                \)\)\n              \) : \(\n                <span className="text-xs font-bold text-slate-400 italic col-span-2">No tags available</span>\n              \)', r'                ))\n                ) : (\n                  <span className="text-xs font-bold text-slate-400 italic col-span-2">No tags available</span>\n                );\n              })()', content)

with open(file_path, "w") as f:
    f.write(content)

print("Dynamic tags rendering patched.")
