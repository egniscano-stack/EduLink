import re

app_js_path = "/Users/egnis/Downloads/EduLink/EduLink/app.js"

with open(app_js_path, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Add editingTeacherId declaration
code = code.replace(
    'let editingStudentId = null;',
    'let editingStudentId = null;\nlet editingTeacherId = null;'
)
print("1. Added editingTeacherId state variable.")

# 2. Replace switchActiveTeacher function
switch_teacher_pattern = re.compile(
    r'function switchActiveTeacher\(teacherKey\)\s*\{.*?setTimeout\(drawConnectionCurve,\s*400\);\s*\}',
    re.DOTALL
)

new_switch_teacher_code = """function switchActiveTeacher(teacherKey, forceGrade = null) {
  const teacher = (teachersData || {})[teacherKey];
  const gradeToShow = teacher ? teacher.assigned_grade : forceGrade;

  // Asegurar que el recuadro del perfil del docente se vea completo (no colapsado)
  const teacherNode = document.getElementById("teacherNode");
  if (teacherNode) {
    teacherNode.classList.remove("card-collapsed");
  }

  if (!teacher) {
    // Si no hay docente pero se pasa un grado forzado
    activeTeacher = null;
    document.getElementById("teacherNameDisplay").textContent = "Sin Docente";
    document.getElementById("teacherSubjectsDisplay").innerHTML = `<span class="meta-icon">📐</span> Sin asignaturas | Aula ${gradeToShow}`;
    document.getElementById("teacherEmpIdDisplay").innerHTML = `<span class="meta-icon">🆔</span> ID: --`;
    document.getElementById("teacherAgeDisplay").textContent = "--";
    document.getElementById("teacherGradeDisplay").textContent = gradeToShow || "--";
    document.getElementById("activeClassLabel").textContent = `Aula ${gradeToShow || '--'}`;

    const avatarContainer = document.querySelector("#teacherNode .avatar-container");
    if (avatarContainer) {
      avatarContainer.innerHTML = `<div class="avatar-fallback gradient-purple" style="width:100%;height:100%;color:white;font-size:1.5rem;font-weight:800;display:flex;align-items:center;justify-content:center;" id="teacherAvatar">--</div>`;
    }
  } else {
    activeTeacher = teacherKey;
    
    // 1. Actualizar el nodo principal de profesor en el Dashboard
    const avatarContainer = document.querySelector("#teacherNode .avatar-container");
    if (avatarContainer) {
      avatarContainer.innerHTML = "";
      if (teacher.isImgPath) {
        const img = document.createElement("img");
        img.src = teacher.profile_pic;
        img.alt = teacher.name;
        img.id = "teacherAvatar";
        avatarContainer.appendChild(img);
      } else {
        const fallback = document.createElement("div");
        fallback.className = "avatar-fallback gradient-purple";
        fallback.textContent = teacher.profile_pic;
        fallback.style.width = "100%";
        fallback.style.height = "100%";
        fallback.style.color = "white";
        fallback.style.fontSize = "1.8rem";
        fallback.style.fontWeight = "800";
        fallback.style.display = "flex";
        fallback.style.alignItems = "center";
        fallback.style.justifyContent = "center";
        fallback.id = "teacherAvatar";
        avatarContainer.appendChild(fallback);
      }
    }

    document.getElementById("teacherNameDisplay").textContent = teacher.name;
    document.getElementById("teacherSubjectsDisplay").innerHTML = `<span class="meta-icon">📐</span> ${teacher.subjects.join(", ")} | Aula ${teacher.assigned_grade}`;
    document.getElementById("teacherEmpIdDisplay").innerHTML = `<span class="meta-icon">🆔</span> ID: ${teacher.employee_id}`;
    document.getElementById("teacherAgeDisplay").textContent = teacher.age;
    document.getElementById("teacherGradeDisplay").textContent = teacher.assigned_grade;
    document.getElementById("activeClassLabel").textContent = `Aula ${teacher.assigned_grade}`;
  }

  // 2. Filtrar y cargar la lista de alumnos según el salón asignado
  const filteredStudents = Object.values(studentsData || {}).filter(s => s.grade === gradeToShow);
  document.getElementById("teacherStudentsCount").textContent = filteredStudents.length;
  document.getElementById("activeClassCount").textContent = `${filteredStudents.length} Activos`;

  // Renderizar la lista de alumnos
  const studentsListEl = document.getElementById("studentsList");
  if (studentsListEl) {
    studentsListEl.innerHTML = "";

    if (filteredStudents.length === 0) {
      studentsListEl.innerHTML = `<p class="helper-text">No hay alumnos asignados a este salón.</p>`;
      // Clear student detail view
      if (typeof studentDetailCard !== 'undefined' && studentDetailCard) {
        studentDetailCard.style.opacity = "0.3";
      }
      if (connectionPath) connectionPath.setAttribute("d", "");
      if (pulsePath) pulsePath.setAttribute("d", "");
      return;
    }

    if (typeof studentDetailCard !== 'undefined' && studentDetailCard) {
      studentDetailCard.style.opacity = "1";
    }

    filteredStudents.forEach((student, idx) => {
      const isActive = idx === 0; // Select first automatically
      if (isActive) activeStudent = student.id;

      const row = document.createElement("div");
      row.className = `student-row ${isActive ? 'active' : ''}`;
      row.setAttribute("data-student", student.id);
      row.id = `studentRow-${student.id}`;

      // Avatar ring content
      let avatarHTML = "";
      if (student.isImgPath || student.is_img_path) {
        avatarHTML = `<img src="${student.img}" alt="${student.name}">`;
      } else {
        const fallbackGrad = getRandomGradientClass(student.id);
        avatarHTML = `<div class="avatar-fallback ${fallbackGrad}">${student.img}</div>`;
      }

      const isPresent = student.attendance !== false;
      const indicatorClass = isPresent ? "online" : "offline";
      const statusText = isPresent ? "En clase" : "Ausente";
      const lastGrade = student.grades && student.grades.length > 0 ? parseFloat(student.grades[student.grades.length - 1]).toFixed(1) : "0.0";

      row.innerHTML = `
        <div class="student-main">
          <div class="student-avatar-ring">
            ${avatarHTML}
          </div>
          <div class="student-meta">
            <h5>${student.name}</h5>
            <span class="status-indicator ${indicatorClass}">${statusText}</span>
          </div>
        </div>
        <div class="student-badge-score">${lastGrade}</div>
        <div class="select-indicator">✦</div>
      `;

      // Row Click Listener
      row.addEventListener("click", () => {
        document.querySelectorAll(".student-row").forEach(r => r.classList.remove("active"));
        row.classList.add("active");
        activeStudent = student.id;
        updateStudentDetails(student.id);
      });

      studentsListEl.appendChild(row);
    });
  }

  // Actualizar detalles del alumno seleccionado
  updateStudentDetails(activeStudent);
  
  // Resaltar en la lista del drawer
  document.querySelectorAll(".teacher-item-card").forEach(card => {
    if (card.getAttribute("data-teacher") === teacherKey) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });

  // Redibujar la cinta SVG
  setTimeout(drawConnectionCurve, 400);
}"""

if switch_teacher_pattern.search(code):
    code = switch_teacher_pattern.sub(new_switch_teacher_code, code)
    print("2. Replaced switchActiveTeacher implementation.")
else:
    print("Error: Could not find switchActiveTeacher in app.js")

# 3. Guard Object.values(studentsData) with || {}
code = code.replace("Object.values(studentsData)", "Object.values(studentsData || {})")
print("3. Guarded Object.values(studentsData).")

# 4. Guard Object.values(teachersData) with || {}
code = code.replace("Object.values(teachersData || {})", "___TEACHERS_DATA_GUARDED___")
code = code.replace("Object.values(teachersData)", "Object.values(teachersData || {})")
code = code.replace("___TEACHERS_DATA_GUARDED___", "Object.values(teachersData || {})")
print("4. Guarded Object.values(teachersData).")

# 5. Modify handleRegisterTeacher to support editingTeacherId
register_teacher_pattern = re.compile(
    r'(async function handleRegisterTeacher\(e\)\s*\{.*?)(// Id único)',
    re.DOTALL
)

edit_teacher_support = """async function handleRegisterTeacher(e) {
  e.preventDefault();

  const name = document.getElementById("regTeacherName").value.trim();
  const empId = document.getElementById("regTeacherEmpId").value.trim();
  const cedula = document.getElementById("regTeacherCedula").value.trim();
  const age = parseInt(document.getElementById("regTeacherAge").value);
  const grade = document.getElementById("regTeacherGrade").value;
  const specsRaw = document.getElementById("regTeacherSpecs").value.trim();
  const subjectsRaw = document.getElementById("regTeacherSubjects").value.trim();
  
  // Obtener foto desde archivo local
  const photoInput = document.getElementById("regTeacherPhoto");
  let profilePic = "";
  let isImgPath = false;
  let hasNewPhoto = false;

  if (photoInput && photoInput.files && photoInput.files[0]) {
    const file = photoInput.files[0];
    const uploadUrl = await uploadFileToBucket(file, "school-assets", "teachers");
    if (uploadUrl) {
      profilePic = uploadUrl;
      isImgPath = true;
      hasNewPhoto = true;
    } else {
      profilePic = "MD";
      isImgPath = false;
    }
  } else {
    // Iniciales como fallback
    const words = name.replace("Prof. ", "").split(" ");
    const initials = words.map(w => w[0]).join("").toUpperCase().substring(0, 2);
    profilePic = initials || "MD";
    isImgPath = false;
  }

  // Arrays
  const specializations = specsRaw.split(",").map(s => s.trim()).filter(Boolean);
  const subjects = subjectsRaw.split(",").map(s => s.trim()).filter(Boolean);

  if (editingTeacherId) {
    const teacher = (teachersData || {})[editingTeacherId];
    if (!teacher) {
      showToast("Error: No se encontró el docente a editar", "❌");
      return;
    }

    const updatedPayload = {
      ...teacher,
      name: name,
      employee_id: empId,
      cedula: cedula,
      age: age,
      specializations: specializations,
      subjects: subjects,
      assigned_grade: grade
    };

    if (hasNewPhoto) {
      updatedPayload.profile_pic = profilePic;
      updatedPayload.isImgPath = isImgPath;
    }

    // Guardar localmente
    teachersData[editingTeacherId] = updatedPayload;
    try {
      localStorage.setItem("eduTeachersData", JSON.stringify(teachersData));
    } catch(e) {}

    // Sincronizar con Supabase
    if (useSupabaseDb && supabaseClient) {
      try {
        const updateObj = {
          name: name,
          employee_id: empId,
          cedula: cedula,
          age: age,
          specializations: specializations,
          subjects: subjects,
          assigned_grade: grade
        };
        if (hasNewPhoto) {
          updateObj.profile_pic = profilePic;
        }

        const { error } = await supabaseClient
          .from('teachers')
          .update(updateObj)
          .eq('id', editingTeacherId);

        if (error) {
          console.error("Fallo al actualizar docente en Supabase:", error);
          showToast("Guardado localmente. Falló sincronización Supabase", "⚠️");
        } else {
          showToast(`Datos de ${name} actualizados con éxito`, "✏️");
        }
      } catch(err) {
        console.error(err);
        showToast("Error de red al actualizar en Supabase", "⚠️");
      }
    } else {
      showToast(`Datos de ${name} actualizados localmente`, "✏️");
    }

    resetTeacherFormEditMode();
    renderTeachersList();
    renderLandingDocentesList();
    renderLandingAulasList();
    populateStudentGradeDropdown();

    if (activeTeacher === editingTeacherId) {
      switchActiveTeacher(editingTeacherId);
    }
    btnListTab.click();
    return;
  }

  // Id único"""

if register_teacher_pattern.search(code):
    code = register_teacher_pattern.sub(edit_teacher_support, code, count=1)
    print("5. Added editing mode handler to handleRegisterTeacher.")
else:
    print("Error: Could not find handleRegisterTeacher signature in app.js")

# 6. Add initAdminLandingAccordions and adminEditTeacherBtn to initMainApp
init_app_pattern = re.compile(
    r'(function initMainApp\(\) \{.*?)(setTimeout\(\(\) => \{)',
    re.DOTALL
)

init_app_replacement = """function initMainApp() {
  // Bind Collapsible Headers
  document.querySelectorAll(".collapsible-header").forEach(header => {
    header.addEventListener("click", () => {
      const card = header.closest(".chubby-card");
      if (card) {
        card.classList.toggle("card-collapsed");
        // Recalculate curves after height transitions complete (450ms)
        setTimeout(drawConnectionCurve, 450);
      }
    });
  });

  // Bind Teacher Avatar expansion click listener
  const teacherAvatarContainer = document.querySelector("#teacherNode .avatar-container");
  if (teacherAvatarContainer) {
    teacherAvatarContainer.addEventListener("click", (e) => {
      e.stopPropagation(); // Evita colapsar la tarjeta al hacer clic en el avatar
      teacherAvatarContainer.classList.toggle("avatar-expanded");
    });
  }

  // Bind edit teacher button click
  const adminEditTeacherBtn = document.getElementById("adminEditTeacherBtn");
  if (adminEditTeacherBtn) {
    adminEditTeacherBtn.addEventListener("click", () => {
      if (activeTeacher) {
        openAdminEditTeacherModal(activeTeacher);
      } else {
        showToast("Selecciona un docente para editar", "⚠️");
      }
    });
  }

  // Inicializar acordeones de la Vista General del Administrador
  initAdminLandingAccordions();

  setTimeout(() => {"""

if init_app_pattern.search(code):
    code = init_app_pattern.sub(init_app_replacement, code, count=1)
    print("6. Registered accordion and button listeners in initMainApp.")
else:
    print("Error: Could not find initMainApp signature in app.js")

# 7. Add rendering calls to initSupabaseConnection
init_connection_pattern = re.compile(
    r'(// Generar lista en el drawer y cargar docente inicial\s*renderTeachersList\(\);\s*renderStudentsList\(\);)',
    re.MULTILINE
)
init_connection_replacement = """// Generar lista en el drawer y cargar docente inicial
  renderTeachersList();
  populateStudentGradeDropdown();
  renderStudentsList();
  renderLandingDocentesList();
  renderLandingAulasList();"""

if init_connection_pattern.search(code):
    code = init_connection_pattern.sub(init_connection_replacement, code, count=1)
    print("7. Registered rendering calls post initSupabaseConnection.")
else:
    print("Warning: Could not find renderTeachersList(); renderStudentsList(); in initSupabaseConnection")

# 8. Add list renders to postgres changes realtime listeners
realtime_student_pattern = re.compile(
    r'(// Refresh admin students list drawer\s*renderStudentsList\(\);)',
    re.MULTILINE
)
realtime_student_replacement = """// Refresh admin students list drawer
      renderStudentsList();
      renderLandingAulasList();
      renderLandingDocentesList();"""

if realtime_student_pattern.search(code):
    code = realtime_student_pattern.sub(realtime_student_replacement, code, count=1)
    print("8a. Added landing updates to student realtime listener.")

realtime_teacher_pattern = re.compile(
    r'(// Refresh admin teachers list drawer\s*renderTeachersList\(\);)',
    re.MULTILINE
)
realtime_teacher_replacement = """// Refresh admin teachers list drawer
      renderTeachersList();
      renderLandingDocentesList();
      renderLandingAulasList();
      populateStudentGradeDropdown();"""

if realtime_teacher_pattern.search(code):
    code = realtime_teacher_pattern.sub(realtime_teacher_replacement, code, count=1)
    print("8b. Added landing updates to teacher realtime listener.")

# 9. Append helper functions at the end of app.js
helpers_code = """

// ==========================================================================
// VISTA GENERAL & INTERACTIVE ACCORDIONS FOR ADMIN LANDING VIEW
// ==========================================================================

function showAdminLandingView() {
  const landing = document.getElementById("adminLandingView");
  const grid = document.getElementById("dashboardGrid");
  const screen = document.getElementById("appScreen");
  const content = document.getElementById("screenContent");

  if (landing && grid) {
    landing.classList.remove("hidden");
    grid.classList.add("hidden");
  }
  if (screen && content) {
    screen.classList.add("landing-mode");
    content.classList.add("landing-mode");
  }

  // Close any open drawers
  if (typeof teachersDrawer !== 'undefined' && teachersDrawer) {
    teachersDrawer.classList.remove("open");
    teachersDrawer.classList.add("hidden");
  }
  if (typeof studentsDrawer !== 'undefined' && studentsDrawer) {
    studentsDrawer.classList.remove("open");
    studentsDrawer.classList.add("hidden");
  }
  if (typeof settingsDrawer !== 'undefined' && settingsDrawer) {
    settingsDrawer.classList.remove("open");
    settingsDrawer.classList.add("hidden");
  }
  if (typeof financeDrawer !== 'undefined' && financeDrawer) {
    financeDrawer.classList.remove("open");
    financeDrawer.classList.add("hidden");
  }
  document.body.classList.remove("drawer-open");
}

function showAdminDashboardGrid() {
  const landing = document.getElementById("adminLandingView");
  const grid = document.getElementById("dashboardGrid");
  const screen = document.getElementById("appScreen");
  const content = document.getElementById("screenContent");

  if (landing && grid) {
    landing.classList.add("hidden");
    grid.classList.remove("hidden");
  }
  if (screen && content) {
    screen.classList.remove("landing-mode");
    content.classList.remove("landing-mode");
  }
  setTimeout(drawConnectionCurve, 150);
}

function toggleLandingAccordion(card, content, arrow) {
  const isOpen = card.classList.contains("open");
  
  if (isOpen) {
    // Collapsing
    content.style.transition = "max-height 0.4s ease, opacity 0.3s ease";
    content.style.height = content.scrollHeight + "px";
    // Force reflow
    content.offsetHeight;
    content.style.height = "0px";
    content.style.opacity = "0";
    card.classList.remove("open");
    if (arrow) arrow.style.transform = "rotate(0deg)";
    setTimeout(() => {
      content.style.display = "none";
      content.style.height = "0";
      content.style.overflow = "hidden";
      content.style.transition = "";
    }, 420);
  } else {
    // Expanding
    content.style.display = "block";
    const targetHeight = content.scrollHeight;
    content.style.height = "0px";
    content.style.opacity = "0";
    content.style.overflow = "hidden";
    // Force reflow
    content.offsetHeight;
    content.style.transition = "height 0.4s ease, opacity 0.35s ease";
    content.style.height = targetHeight + "px";
    content.style.opacity = "1";
    card.classList.add("open");
    if (arrow) arrow.style.transform = "rotate(180deg)";
    setTimeout(() => {
      content.style.height = "auto";
      content.style.overflow = "visible";
      content.style.transition = "";
    }, 420);
  }
}

function initAdminLandingAccordions() {
  // Configure both accordion cards: hide content initially, bind toggle
  [
    { cardId: "landingDocentesCard", contentId: "landingDocentesContent" },
    { cardId: "landingAulasCard",    contentId: "landingAulasContent"    }
  ].forEach(({ cardId, contentId }) => {
    const card    = document.getElementById(cardId);
    const content = document.getElementById(contentId);
    const arrow   = card ? card.querySelector(".accordion-arrow") : null;
    if (!card || !content) return;

    // Start collapsed
    content.style.display  = "none";
    content.style.height   = "0";
    content.style.opacity  = "0";
    content.style.overflow = "hidden";
    card.classList.remove("open");
    if (arrow) arrow.style.transform = "rotate(0deg)";

    const header = card.querySelector(".accordion-card-header");
    if (header) {
      header.addEventListener("click", () => toggleLandingAccordion(card, content, arrow));
    }
  });

  // Bind Vista General toggle button
  const adminLandingToggle = document.getElementById("adminLandingToggle");
  if (adminLandingToggle) {
    adminLandingToggle.addEventListener("click", () => showAdminLandingView());
  }
}

function renderLandingDocentesList() {
  const container = document.getElementById("landingDocentesList");
  const countEl   = document.getElementById("landingDocentesCount");
  if (!container) return;
  container.innerHTML = "";

  const teachers = Object.values(teachersData || {});
  if (countEl) countEl.textContent = teachers.length;

  if (teachers.length === 0) {
    container.innerHTML = `<div class="lv-empty">No hay docentes registrados.</div>`;
    return;
  }

  teachers.forEach((teacher, index) => {
    // Avatar
    let avatarHTML;
    if (teacher.isImgPath || (teacher.profile_pic && (teacher.profile_pic.includes('/') || teacher.profile_pic.startsWith('data:image/')))) {
      avatarHTML = `<img src="${teacher.profile_pic}" alt="${teacher.name}">`;
    } else {
      const grad = getRandomGradientClass(teacher.id);
      const initials = (teacher.profile_pic || teacher.name || 'D').slice(0, 2).toUpperCase();
      avatarHTML = `<div class="lv-avatar-fallback ${grad}">${initials}</div>`;
    }

    // Subjects as tags
    const subjectTags = teacher.subjects && teacher.subjects.length
      ? teacher.subjects.map(s => `<span class="lv-tag">${s}</span>`).join("")
      : `<span class="lv-tag">Sin asignaturas</span>`;

    const row = document.createElement("div");
    row.className = "lv-list-row";
    row.setAttribute("data-teacher-id", teacher.id);
    row.innerHTML = `
      <div class="lv-avatar">${avatarHTML}</div>
      <div class="lv-info">
        <p class="lv-name">${teacher.name}</p>
        <p class="lv-meta">ID: ${teacher.employee_id || 'N/A'} &nbsp;·&nbsp; Aula: <strong>${teacher.assigned_grade || 'Ninguna'}</strong></p>
        <p class="lv-meta" style="margin-top:3px;">${subjectTags}</p>
      </div>
    `;
    row.addEventListener("click", () => {
      showAdminDashboardGrid();
      switchActiveTeacher(teacher.id);
    });

    container.appendChild(row);

    // Divider between rows (not after last)
    if (index < teachers.length - 1) {
      const div = document.createElement("div");
      div.className = "lv-divider";
      container.appendChild(div);
    }
  });
}

function renderLandingAulasList() {
  const container = document.getElementById("landingAulasList");
  const countEl   = document.getElementById("landingAulasCount");
  if (!container) return;
  container.innerHTML = "";

  // Gather unique grades
  const grades = new Set();
  Object.values(studentsData || {}).forEach(s => { if (s.grade) grades.add(s.grade); });
  Object.values(teachersData || {}).forEach(t => { if (t.assigned_grade) grades.add(t.assigned_grade); });
  const sortedGrades = Array.from(grades).sort();

  if (countEl) countEl.textContent = sortedGrades.length;

  if (sortedGrades.length === 0) {
    container.innerHTML = `<div class="lv-empty">No hay aulas registradas.</div>`;
    return;
  }

  sortedGrades.forEach(grade => {
    const teacher          = Object.values(teachersData || {}).find(t => t.assigned_grade === grade);
    const teacherName      = teacher ? teacher.name : "Sin docente";
    const gradeStudents    = Object.values(studentsData || {}).filter(s => s.grade === grade);

    // Classroom group wrapper
    const group = document.createElement("div");
    group.className = "lv-classroom-group";

    // Header row for this classroom
    const headerEl = document.createElement("div");
    headerEl.className = "lv-classroom-header";
    headerEl.innerHTML = `
      <span class="lv-classroom-icon">🏫</span>
      <span class="lv-classroom-label">Aula ${grade} <span style="font-weight:500;opacity:0.65;font-size:0.8rem;">(${gradeStudents.length} estudiantes)</span></span>
      <span class="lv-classroom-teacher">Docente: ${teacherName}</span>
      <span class="lv-classroom-chevron">▼</span>
    `;

    // Body (students list) — starts hidden
    const body = document.createElement("div");
    body.className = "lv-classroom-body";
    body.style.display = "none";

    if (gradeStudents.length === 0) {
      body.innerHTML = `<div class="lv-empty" style="padding: 14px;">No hay estudiantes en esta aula.</div>`;
    } else {
      gradeStudents.forEach((student, idx) => {
        // Avatar
        let avatarHTML;
        if (student.isImgPath || (student.img && (student.img.includes('/') || student.img.startsWith('data:image/')))) {
          avatarHTML = `<img src="${student.img}" alt="${student.name}">`;
        } else {
          const grad = getRandomGradientClass(student.id);
          const initials = (student.img || student.name || 'E').slice(0, 2).toUpperCase();
          avatarHTML = `<div class="lv-avatar-fallback ${grad}">${initials}</div>`;
        }

        const row = document.createElement("div");
        row.className = "lv-list-row lv-student-small";
        row.setAttribute("data-student-id", student.id);
        row.innerHTML = `
          <div class="lv-avatar">${avatarHTML}</div>
          <div class="lv-info">
            <p class="lv-name">${student.name}</p>
            <p class="lv-meta">ID: ${student.student_id || 'N/A'} &nbsp;·&nbsp; Tutor: ${student.parentName || 'Ninguno'}</p>
          </div>
        `;
        row.addEventListener("click", (e) => {
          e.stopPropagation();
          if (teacher) switchActiveTeacher(teacher.id);
          else switchActiveTeacher(null, student.grade);
          activeStudent = student.id;
          updateStudentDetails(student.id);
          document.querySelectorAll(".student-row").forEach(r => {
            r.classList.toggle("active", r.getAttribute("data-student") === student.id);
          });
          showAdminDashboardGrid();
        });
        body.appendChild(row);
        if (idx < gradeStudents.length - 1) {
          const div = document.createElement("div");
          div.className = "lv-divider";
          body.appendChild(div);
        }
      });
    }

    // Toggle classroom body on header click
    const chevron = headerEl.querySelector(".lv-classroom-chevron");
    headerEl.addEventListener("click", () => {
      const isOpen = body.style.display !== "none";
      body.style.display = isOpen ? "none" : "block";
      if (chevron) chevron.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
    });

    group.appendChild(headerEl);
    group.appendChild(body);
    container.appendChild(group);
  });
}

// ==========================================================================
// TEACHER EDITING HELPER FUNCTIONS
// ==========================================================================

function resetTeacherFormEditMode() {
  editingTeacherId = null;
  const form = document.getElementById("addTeacherForm");
  if (form) form.reset();
  const submitBtnText = document.querySelector("#addTeacherForm button[type='submit'] span");
  if (submitBtnText) {
    submitBtnText.textContent = "💾 Registrar Docente";
  }
  const btnFormTab = document.getElementById("btnFormTab");
  if (btnFormTab) btnFormTab.textContent = "+ Registrar";
  const preview = document.getElementById("teacherPhotoPreview");
  if (preview) preview.innerHTML = "<span>Subir Foto (PNG/JPG)</span>";
}

function openAdminEditTeacherModal(teacherId) {
  const teacher = (teachersData || {})[teacherId];
  if (!teacher) return;

  editingTeacherId = teacherId;
  
  // Populate form
  const nameInput = document.getElementById("regTeacherName");
  const empIdInput = document.getElementById("regTeacherEmpId");
  const cedulaInput = document.getElementById("regTeacherCedula");
  const ageInput = document.getElementById("regTeacherAge");
  const gradeInput = document.getElementById("regTeacherGrade");
  const specsInput = document.getElementById("regTeacherSpecs");
  const subjectsInput = document.getElementById("regTeacherSubjects");

  if (nameInput) nameInput.value = teacher.name || "";
  if (empIdInput) empIdInput.value = teacher.employee_id || "";
  if (cedulaInput) cedulaInput.value = teacher.cedula || "";
  if (ageInput) ageInput.value = teacher.age || "";
  if (gradeInput) gradeInput.value = teacher.assigned_grade || "";
  if (specsInput) specsInput.value = (teacher.specializations || []).join(", ");
  if (subjectsInput) subjectsInput.value = (teacher.subjects || []).join(", ");

  // Preview photo
  const preview = document.getElementById("teacherPhotoPreview");
  if (preview) {
    if (teacher.profile_pic) {
      if (teacher.isImgPath) {
        preview.innerHTML = `<img src="${teacher.profile_pic}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">`;
      } else {
        preview.innerHTML = `<div class="avatar-fallback" style="width:100%; height:100%; display:flex; justify-content:center; align-items:center; background:var(--accent-lime); color:white; font-size:1.2rem; font-weight:bold; border-radius:12px;">${teacher.profile_pic}</div>`;
      }
    } else {
      preview.innerHTML = "<span>Subir Foto (PNG/JPG)</span>";
    }
  }

  // Change UI texts
  const submitBtnText = document.querySelector("#addTeacherForm button[type='submit'] span");
  if (submitBtnText) {
    submitBtnText.textContent = "💾 Guardar Cambios";
  }
  const btnFormTab = document.getElementById("btnFormTab");
  if (btnFormTab) btnFormTab.textContent = "✏️ Editar Datos";

  // Open drawer if hidden
  if (teachersDrawer && teachersDrawer.classList.contains("hidden")) {
    teachersDrawer.classList.remove("hidden");
    setTimeout(() => {
      teachersDrawer.classList.add("open");
      document.body.classList.add("drawer-open");
    }, 50);
  }

  // Swap to the form tab
  const btnListTab = document.getElementById("btnListTab");
  const tabAddTeacher = document.getElementById("tabAddTeacher");
  const tabTeachersList = document.getElementById("tabTeachersList");
  if (btnFormTab && btnListTab && tabAddTeacher && tabTeachersList) {
    btnFormTab.classList.add("active");
    btnListTab.classList.remove("active");
    tabAddTeacher.classList.add("active");
    tabTeachersList.classList.remove("active");
  }
}
"""

code = code + helpers_code
print("9. Appended helper functions.")

with open(app_js_path, "w", encoding="utf-8") as f:
    f.write(code)

print("app.js updated successfully!")
