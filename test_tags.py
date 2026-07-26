import os

file_path = "components/VendorSelection.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_render_tags = """              {allTags.length > 0 ? (
                allTags.map(tag => ("""

new_render_tags = """              {allTags.length > 0 ? (
                allTags.map(tag => ("""
