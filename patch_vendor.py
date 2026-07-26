import os

file_path = "components/VendorSelection.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_filter = """    if (selectedTags.length > 0) {
      result = result.filter(vendor => {
        const vendorLocations = locations.filter(loc => loc.vendorId === vendor.id);
        const vendorTags = new Set<string>(vendor.tags || []);
        vendorLocations.forEach(loc => loc.tags?.forEach(t => vendorTags.add(t)));
        return selectedTags.every(tag => vendorTags.has(tag));
      });
    }

    if (selectedCities.length > 0) {
      result = result.filter(vendor => {
        const vendorLocations = locations.filter(loc => loc.vendorId === vendor.id);
        const vendorCities = new Set<string>();
        vendorLocations.forEach(loc => {
          if (loc.city) vendorCities.add(loc.city);
        });
        return selectedCities.some(city => vendorCities.has(city));
      });
    }"""

new_filter = """    if (selectedTags.length > 0) {
      result = result.filter(vendor => {
        const vendorLocations = locations.filter(loc => loc.vendorId === vendor.id);
        const vendorTags = new Set<string>((vendor.tags || []).map(t => t.trim().toLowerCase()));
        vendorLocations.forEach(loc => loc.tags?.forEach(t => vendorTags.add(t.trim().toLowerCase())));
        return selectedTags.every(tag => vendorTags.has(tag.trim().toLowerCase()));
      });
    }

    if (selectedCities.length > 0) {
      result = result.filter(vendor => {
        const vendorLocations = locations.filter(loc => loc.vendorId === vendor.id);
        const vendorCities = new Set<string>();
        vendorLocations.forEach(loc => {
          if (loc.city) vendorCities.add(loc.city.trim().toLowerCase());
        });
        return selectedCities.some(city => vendorCities.has(city.trim().toLowerCase()));
      });
    }"""

content = content.replace(old_filter, new_filter)
with open(file_path, "w") as f:
    f.write(content)

print("Vendor filter patched.")
