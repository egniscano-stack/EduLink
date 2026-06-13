import re

with open("app.js", "r", encoding="utf-8") as f:
    js = f.read()

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Pattern 1: target.addEventListener("...", ...);
# Let's find matches and get the target names
listeners = re.findall(r'([a-zA-Z0-9_\-]+)\.addEventListener\(', js)
unique_listeners = sorted(list(set(listeners)))

print(f"Checking {len(unique_listeners)} event listener targets...")
for listener_var in unique_listeners:
    # Find how listener_var is declared, e.g. const listener_var = document.getElementById("...")
    # or const listener_var = card.querySelector("...")
    decl_match = re.search(rf'(?:const|let|var)\s+{listener_var}\s*=\s*(.*?);', js)
    if decl_match:
        decl_rhs = decl_match.group(1)
        # Check if it is selected by getElementById
        id_match = re.search(r'document\.getElementById\((?:"([^"]+)"|\'([^\']+)\')\)', decl_rhs)
        if id_match:
            element_id = id_match.group(1) or id_match.group(2)
            # Check if this element ID is in index.html
            html_pat = rf'id=["\']{re.escape(element_id)}["\']'
            if not re.search(html_pat, html):
                print(f"WARNING: Global listener variable '{listener_var}' selects missing ID '{element_id}' in HTML!")
        else:
            # It's selected by querySelector or something else
            # Let's see if we check for null in the JS before addEventListener
            # e.g. if (listener_var) listener_var.addEventListener(...)
            # Let's search for: listener_var.addEventListener(...) without an "if (listener_var)" guard.
            # We can do a simple check: is the addEventListener call preceded by a check?
            pass
    else:
        # No declaration found in app.js (could be global/window or declared in HTML/different file, or part of parameter)
        # If it's a global variable, it could crash if not defined.
        # Let's check if the element exists as an ID in HTML
        html_pat = rf'id=["\']{re.escape(listener_var)}["\']'
        if not re.search(html_pat, html):
            print(f"WARNING: Global listener target '{listener_var}' is not declared in app.js and not found in index.html!")
