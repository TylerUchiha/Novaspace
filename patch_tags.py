import os

file_path = "App.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_tags = """  const allGlobalTags = useMemo(() => {
    const tags = new Set<string>();
    allVendors.forEach(v => v.tags?.forEach(t => tags.add(t)));
    allLocations.forEach(loc => {
      loc.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [allLocations, allVendors]);

  const allGlobalCities = useMemo(() => {
    const cities = new Set<string>();
    allLocations.forEach(loc => {
      if (loc.city) cities.add(loc.city);
    });
    return Array.from(cities).sort();
  }, [allLocations]);"""

new_tags = """  const allGlobalTags = useMemo(() => {
    const tagMap = new Map<string, string>();
    allVendors.forEach(v => v.tags?.forEach(t => {
      if (!t) return;
      const trimmed = t.trim();
      if (trimmed && !tagMap.has(trimmed.toLowerCase())) {
        tagMap.set(trimmed.toLowerCase(), trimmed);
      }
    }));
    allLocations.forEach(loc => {
      loc.tags?.forEach(tag => {
        if (!tag) return;
        const trimmed = tag.trim();
        if (trimmed && !tagMap.has(trimmed.toLowerCase())) {
          tagMap.set(trimmed.toLowerCase(), trimmed);
        }
      });
    });
    return Array.from(tagMap.values()).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }, [allLocations, allVendors]);

  const allGlobalCities = useMemo(() => {
    const cityMap = new Map<string, string>();
    allLocations.forEach(loc => {
      if (loc.city) {
        const trimmed = loc.city.trim();
        if (trimmed && !cityMap.has(trimmed.toLowerCase())) {
          cityMap.set(trimmed.toLowerCase(), trimmed);
        }
      }
    });
    return Array.from(cityMap.values()).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }, [allLocations]);"""

content = content.replace(old_tags, new_tags)
with open(file_path, "w") as f:
    f.write(content)

print("App tags patched.")
