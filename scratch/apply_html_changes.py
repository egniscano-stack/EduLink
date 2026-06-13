import re

html_path = "/Users/egnis/Downloads/EduLink/EduLink/index.html"

with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add adminLandingToggle in dropdown menu
dropdown_pattern = re.compile(
    r'(<div class="admin-dropdown-content hidden" id="adminDropdownMenu">)',
    re.MULTILINE
)
dropdown_replacement = """<div class="admin-dropdown-content hidden" id="adminDropdownMenu">
              <button id="adminLandingToggle" class="admin-dropdown-item" title="Vista General">
                <span class="icon">🏛️</span> Vista General
              </button>"""

if dropdown_pattern.search(content):
    content = dropdown_pattern.sub(dropdown_replacement, content, count=1)
    print("Added adminLandingToggle to dropdown menu.")
else:
    print("Error: Could not find adminDropdownMenu in index.html")

# 2. Hide dashboard-grid and add id="dashboardGrid"
grid_pattern = re.compile(r'(<div class="dashboard-grid">)', re.MULTILINE)
if grid_pattern.search(content):
    content = grid_pattern.sub('<div class="dashboard-grid hidden" id="dashboardGrid">', content, count=1)
    print("Hid dashboard-grid and added ID.")
else:
    print("Warning: dashboard-grid not found exactly as expected.")

# 3. Add adminLandingView block right before dashboard-grid
landing_view_html = """
          <!-- Admin Landing Page: Vista General -->
          <div class="admin-landing-view" id="adminLandingView">
            <!-- Title -->
            <div class="landing-title-block">
              <h2>Vista General</h2>
              <p>Resumen y administración rápida del colegio</p>
            </div>

            <div class="landing-accordion-container">
              <!-- Accordion 1: Docentes -->
              <div class="chubby-card accordion-card" id="landingDocentesCard">
                <div class="accordion-card-header" style="display:flex; justify-content:space-between; align-items:center; padding:18px 22px; cursor:pointer;">
                  <h4 style="margin:0;"><span class="icon">👨‍🏫</span> Lista de Docentes (<span id="landingDocentesCount">0</span>)</h4>
                  <span class="accordion-arrow" style="transition: transform 0.3s; font-size: 0.8rem; color: var(--text-muted); display: inline-block;">▼</span>
                </div>
                <div class="accordion-card-content" id="landingDocentesContent">
                  <div class="accordion-card-content-inner">
                    <div id="landingDocentesList"></div>
                  </div>
                </div>
              </div>

              <!-- Accordion 2: Aulas -->
              <div class="chubby-card accordion-card" id="landingAulasCard">
                <div class="accordion-card-header" style="display:flex; justify-content:space-between; align-items:center; padding:18px 22px; cursor:pointer;">
                  <h4 style="margin:0;"><span class="icon">🏫</span> Lista de Aulas (<span id="landingAulasCount">0</span>)</h4>
                  <span class="accordion-arrow" style="transition: transform 0.3s; font-size: 0.8rem; color: var(--text-muted); display: inline-block;">▼</span>
                </div>
                <div class="accordion-card-content" id="landingAulasContent">
                  <div class="accordion-card-content-inner">
                    <div id="landingAulasList"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
"""

# Insert adminLandingView right before the dashboardGrid div
content = content.replace('<div class="dashboard-grid hidden" id="dashboardGrid">', landing_view_html + '\n          <div class="dashboard-grid hidden" id="dashboardGrid">')
print("Inserted adminLandingView panel.")

# 4. Add adminEditTeacherBtn inside teacherNode
teacher_footer_pattern = re.compile(
    r'(<span class="stat-lbl">Salón</span>\s*</div>\s*</div>\s*</div>\s*</div>)',
    re.MULTILINE
)

# Let's inspect the actual HTML of the teacherNode footer to find the exact replacement point
# In the original file, it is:
#                     <div class="stat-pill highlight">
#                       <span class="stat-num" id="teacherGradeDisplay">2B</span>
#                       <span class="stat-lbl">Salón</span>
#                     </div>
#                   </div>
#                 </div>
#               </div>

teacher_footer_target = """                    <div class="stat-pill highlight">
                      <span class="stat-num" id="teacherGradeDisplay">2B</span>
                      <span class="stat-lbl">Salón</span>
                    </div>
                  </div>
                </div>"""

teacher_footer_replacement = """                    <div class="stat-pill highlight">
                      <span class="stat-num" id="teacherGradeDisplay">2B</span>
                      <span class="stat-lbl">Salón</span>
                    </div>
                  </div>
                  <div style="padding-top: 14px; display: flex; gap: 10px;">
                    <button type="button" class="chubby-btn primary full-width" id="adminEditTeacherBtn" style="height: 38px; display: flex; justify-content: center; align-items: center; cursor: pointer; font-size: 0.85rem;">
                      <span>✏️ Editar Docente</span>
                    </button>
                  </div>
                </div>"""

if teacher_footer_target in content:
    content = content.replace(teacher_footer_target, teacher_footer_replacement, 1)
    print("Added adminEditTeacherBtn to teacherNode.")
else:
    print("Warning: Could not find teacherNode footer target exactly.")

# 5. Bump script version to v=1.0.11
content = content.replace('style.css?v=1.0.4', 'style.css?v=1.0.11')
content = content.replace('app.js?v=1.0.4', 'app.js?v=1.0.11')

with open(html_path, "w", encoding="utf-8") as f:
    f.write(content)

print("index.html updated successfully!")
