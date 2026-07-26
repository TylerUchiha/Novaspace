import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Update instapay_info to use selectedVendor if available
old_instapay_val = "defaultValue={allVendors[0]?.instapayAccount || ''}"
new_instapay_val = "defaultValue={selectedVendor ? selectedVendor.instapayAccount : (allVendors[0]?.instapayAccount || '')}"
content = content.replace(old_instapay_val, new_instapay_val)

old_instapay_save = """                        onClick={() => {
                          const input = document.getElementById('global-instapay-input') as HTMLInputElement;
                          if (input.value && allVendors.length > 0) {
                            handleUpdateVendor(allVendors[0].id, { instapayAccount: input.value });
                            alert('Global InstaPay account updated successfully.');
                          }
                        }}"""
new_instapay_save = """                        onClick={() => {
                          const input = document.getElementById('global-instapay-input') as HTMLInputElement;
                          if (input.value) {
                            if (selectedVendor) {
                                handleUpdateVendor(selectedVendor.id, { instapayAccount: input.value });
                                setSelectedVendor({...selectedVendor, instapayAccount: input.value});
                            } else if (allVendors.length > 0) {
                                handleUpdateVendor(allVendors[0].id, { instapayAccount: input.value });
                            }
                            alert('InstaPay account updated successfully.');
                          }
                        }}"""
content = content.replace(old_instapay_save, new_instapay_save)

with open('App.tsx', 'w') as f:
    f.write(content)
