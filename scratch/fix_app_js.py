app_js_path = "/Users/egnis/Downloads/EduLink/EduLink/app.js"

with open(app_js_path, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Replace Object.values(studentsData) with Object.values(studentsData || {})
# We make sure to do it cleanly
code = code.replace("Object.values(studentsData)", "Object.values(studentsData || {})")

# 2. Replace Object.values(teachersData) with Object.values(teachersData || {})
# Note that some places might already be teachersData || {}
# So let's replace Object.values(teachersData) but protect it if it already has || {}
# First, let's find all occurrences of Object.values(teachersData) and see if they have || {}
# A safe way is to replace Object.values(teachersData || {}) with a temporary placeholder,
# then replace Object.values(teachersData) with Object.values(teachersData || {}),
# and then restore the placeholder.
code = code.replace("Object.values(teachersData || {})", "___TEACHERS_DATA_GUARDED___")
code = code.replace("Object.values(teachersData)", "Object.values(teachersData || {})")
code = code.replace("___TEACHERS_DATA_GUARDED___", "Object.values(teachersData || {})")

# 3. Replace subjects checkbox logic with text input parsing
checkbox_collect_str = """  // Obtener asignaturas desde los checkboxes marcados
  const checkedCheckboxes = document.querySelectorAll('input[name="regTeacherSubjects"]:checked');
  const subjects = Array.from(checkedCheckboxes).map(cb => cb.value);"""

text_collect_str = """  // Obtener asignaturas desde el input de texto
  const subjectsRaw = document.getElementById("regTeacherSubjects").value.trim();
  const subjects = subjectsRaw.split(",").map(s => s.trim()).filter(Boolean);"""

if checkbox_collect_str in code:
    code = code.replace(checkbox_collect_str, text_collect_str)
else:
    # Try with single quotes
    checkbox_collect_str_alt = checkbox_collect_str.replace('"', "'")
    if checkbox_collect_str_alt in code:
        code = code.replace(checkbox_collect_str_alt, text_collect_str)
    else:
        print("Warning: checkbox collect string not found exactly, doing fuzzy replace")
        # Fallback regex replace for checkbox query
        import re
        code = re.sub(
            r'const checkedCheckboxes = document\.querySelectorAll\([\'"]input\[name=[\'"]regTeacherSubjects[\'"]\]:checked[\'"]\);\s*const subjects = Array\.from\(checkedCheckboxes\)\.map\(cb => cb\.value\);',
            r'const subjectsRaw = document.getElementById("regTeacherSubjects").value.trim();\n  const subjects = subjectsRaw.split(",").map(s => s.trim()).filter(Boolean);',
            code
        )

# 4. Replace subjects reset logic
reset_checkbox_str = """  // Uncheck all subjects
  document.querySelectorAll('input[name="regTeacherSubjects"]').forEach(cb => {
    cb.checked = false;
  });"""

reset_text_str = """  // Clear subjects text input
  const subjectsInput = document.getElementById("regTeacherSubjects");
  if (subjectsInput) {
    subjectsInput.value = "";
  }"""

if reset_checkbox_str in code:
    code = code.replace(reset_checkbox_str, reset_text_str)
else:
    reset_checkbox_str_alt = reset_checkbox_str.replace('"', "'")
    if reset_checkbox_str_alt in code:
        code = code.replace(reset_checkbox_str_alt, reset_text_str)
    else:
        print("Warning: reset checkbox string not found exactly, doing fuzzy replace")
        import re
        code = re.sub(
            r'document\.querySelectorAll\([\'"]input\[name=[\'"]regTeacherSubjects[\'"]\][\'"]\)\.forEach\(cb => \{\s*cb\.checked = false;\s*\}\);',
            r'const subjectsInput = document.getElementById("regTeacherSubjects");\n  if (subjectsInput) subjectsInput.value = "";',
            code
        )

# 5. Replace subjects populate logic
populate_checkbox_str = """  // Populate subjects
  document.querySelectorAll('input[name="regTeacherSubjects"]').forEach(cb => {
    cb.checked = (teacher.subjects || []).includes(cb.value);
  });"""

populate_text_str = """  // Populate subjects text input
  const subjectsInput = document.getElementById("regTeacherSubjects");
  if (subjectsInput) {
    subjectsInput.value = (teacher.subjects || []).join(", ");
  }"""

if populate_checkbox_str in code:
    code = code.replace(populate_checkbox_str, populate_text_str)
else:
    populate_checkbox_str_alt = populate_checkbox_str.replace('"', "'")
    if populate_checkbox_str_alt in code:
        code = code.replace(populate_checkbox_str_alt, populate_text_str)
    else:
        print("Warning: populate checkbox string not found exactly, doing fuzzy replace")
        import re
        code = re.sub(
            r'document\.querySelectorAll\([\'"]input\[name=[\'"]regTeacherSubjects[\'"]\][\'"]\)\.forEach\(cb => \{\s*cb\.checked = \(teacher\.subjects \|\| \[\]\)\.includes\(cb\.value\);\s*\}\);',
            r'const subjectsInput = document.getElementById("regTeacherSubjects");\n  if (subjectsInput) subjectsInput.value = (teacher.subjects || []).join(", ");',
            code
        )

with open(app_js_path, "w", encoding="utf-8") as f:
    f.write(code)

print("app.js updated successfully!")
