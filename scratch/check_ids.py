import re

with open("app.js", "r", encoding="utf-8") as f:
    js = f.read()

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Find all document.getElementById("...")
ids = re.findall(r'document\.getElementById\((?:"([^"]+)"|\'([^\']+)\')\)', js)
ids = [i[0] or i[1] for i in ids]
unique_ids = sorted(list(set(ids)))

print(f"Checking {len(unique_ids)} IDs...")
missing = []
for uid in unique_ids:
    # Look for id="uid" or id='uid' in HTML
    pattern = rf'id=["\']{re.escape(uid)}["\']'
    if not re.search(pattern, html):
        # Check if it has an event listener in app.js
        has_listener = f"{uid}.addEventListener" in js
        missing.append((uid, has_listener))

print("Missing IDs:")
for m, hl in missing:
    print(f"  - {m} (has listener: {hl})")
