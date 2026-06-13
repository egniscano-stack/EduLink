import re

html_path = "/Users/egnis/Downloads/EduLink/EduLink/index.html"

with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

# Locate the drawers block: starts with <!-- Sliding Drawer for Teacher Management --> and ends before <div class="screen-content" id="screenContent">
pattern = re.compile(
    r'(^[ \t]*<!-- Sliding Drawer for Teacher Management -->.*?)(^[ \t]*<div class="screen-content" id="screenContent">)',
    re.DOTALL | re.MULTILINE
)

match = pattern.search(content)
if not match:
    print("Error: Could not locate the drawers block in index.html")
    exit(1)

drawers_html = match.group(1)
print("Found drawers block. Length:", len(drawers_html))

# Remove the drawers block from the original position
new_content = content.replace(drawers_html, "")

# Find where the toast container is
toast_pattern = re.compile(r'(^[ \t]*<!-- Toast Notification System -->)', re.MULTILINE)
toast_match = toast_pattern.search(new_content)
if not toast_match:
    print("Error: Could not locate the toast container in index.html")
    exit(1)

# Insert the drawers block before the toast container
toast_pos = toast_match.start()
final_content = new_content[:toast_pos] + drawers_html + "\n" + new_content[toast_pos:]

# Force cache version bump in script/link tags
final_content = final_content.replace('style.css?v=1.0.10', 'style.css?v=1.0.11')
final_content = final_content.replace('app.js?v=1.0.10', 'app.js?v=1.0.11')

with open(html_path, "w", encoding="utf-8") as f:
    f.write(final_content)

print("index.html updated successfully!")
