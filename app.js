/* ==========================================================================
   EDULINK ECOSYSTEM DASHBOARD - LOGIC & SUPABASE INTEGRATION
   ========================================================================== */

// 1. Supabase Client Configurations
const supabaseUrl = 'https://awwrasdjitrbkbyyrhzz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3d3Jhc2RqaXRyYmtieXlyaHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNDg2NTgsImV4cCI6MjA5NjYyNDY1OH0.5ZtKWN7PU3aHT8koUvUXLPSY0QgaMlJYnuGx48PLt7A';

let supabaseClient = null;
let useSupabaseDb = false; // Flag to indicate if real DB is available
let registeredLogoDataUrl = "";
let modLogoDataUrl = "";
let registeredStudentPhotoDataUrl = "";
const defaultSchoolLogo = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="%2300f2fe"/><path d="M50 20 L80 35 L80 65 C80 80 50 90 50 90 C50 90 20 80 20 65 L20 35 Z" fill="%23ffffff"/><path d="M50 25 L75 37 L75 63 C75 75 50 84 50 84 C50 84 25 75 25 63 L25 37 Z" fill="%2300f2fe"/><text x="50" y="60" font-family="'Outfit', sans-serif" font-size="32" font-weight="bold" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle">🏫</text></svg>`;

// Initialize Supabase Client
if (typeof supabase !== 'undefined') {
  try {
    supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.warn("Error al inicializar cliente de Supabase:", err);
  }
}

// 2. Mock Data Cache (Fallback Local)
let teachersData = {
  ariacniesp59: {
    id: "ariacniesp59",
    name: "Ariacni Espinoza",
    employee_id: "156342",
    cedula: "1-716-1071",
    profile_pic: "https://awwrasdjitrbkbyyrhzz.supabase.co/storage/v1/object/public/school-assets/teachers/1781305042226-evfhvhsipyr.jpg",
    isImgPath: true,
    age: 39,
    specializations: ["Licenciatura en educacion prescolar"],
    subjects: ["español", "religion", "ciencias", "ingles", "expresion artistica", "matematicas", "ciencias sociales", "educacion fisica"],
    assigned_grade: "2B"
  },
  egniscano36: {
    id: "egniscano36",
    name: "egnis cano",
    employee_id: "123659",
    cedula: "8-772-2232",
    profile_pic: "https://awwrasdjitrbkbyyrhzz.supabase.co/storage/v1/object/public/school-assets/teachers/1781306432087-kk6tvufqdno.JPG",
    isImgPath: true,
    age: 42,
    specializations: ["licenciatura en educacion primaria", "licenciatura en religion etica y moral"],
    subjects: ["Español", "Religión", "Ciencias", "Inglés", "Expresión Artística", "Matemáticas", "Ciencias Sociales", "Educación Física"],
    assigned_grade: "3A"
  },
  mariaperez52: {
    id: "mariaperez52",
    name: "maria perez",
    employee_id: "125364",
    cedula: "1-963-785",
    profile_pic: "https://awwrasdjitrbkbyyrhzz.supabase.co/storage/v1/object/public/school-assets/teachers/1781306599178-87sg0y855e.JPG",
    isImgPath: true,
    age: 36,
    specializations: ["licenciatura en educacion prescolar"],
    subjects: ["Español", "Religión", "Inglés", "Expresión Artística"],
    assigned_grade: "kinder A"
  }
};

let studentsData = {
  eimycano68: {
    id: "eimycano68",
    name: "eimy cano",
    role: "Estudiante",
    roleClass: "badge-lime",
    accentClass: "accent-lime",
    student_id: "#EL-78937",
    img: "https://awwrasdjitrbkbyyrhzz.supabase.co/storage/v1/object/public/school-assets/students/1781304829268-gj2cuj0cz56.jpg",
    isImgPath: true,
    grades: [0, 0, 0, 0],
    conduct: "sin_evaluar",
    parentName: "egnis cano",
    parentPhone: "62856279",
    parentEmail: "egniscano@gmail.com",
    conductText: "El docente aún no ha registrado observaciones de conducta.",
    grade: "2B",
    subject_grades: {
      "Español": ["4.5", "4.0", "3.8", ""],
      "Matemáticas": ["4.8", "4.2", "", ""]
    },
    incidents: [
      { date: "12/06/2026", time: "10:30 AM", text: "Excelente participación en las dinámicas de clase." }
    ]
  }
};

// Intentar cargar datos desde localStorage si existen
try {
  const storedStudents = localStorage.getItem("eduStudentsData");
  if (storedStudents) {
    const parsed = JSON.parse(storedStudents);
    if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
      studentsData = parsed;
    }
  }
} catch (e) {
  console.error("Error reading eduStudentsData:", e);
}

try {
  const storedTeachers = localStorage.getItem("eduTeachersData");
  if (storedTeachers) {
    const parsed = JSON.parse(storedTeachers);
    if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
      teachersData = parsed;
    }
  }
} catch (e) {
  console.error("Error reading eduTeachersData:", e);
}

let planningsData = {};
try {
  const storedPlannings = localStorage.getItem("eduPlanningsData");
  if (storedPlannings) {
    const parsed = JSON.parse(storedPlannings);
    if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
      planningsData = parsed;
    }
  }
} catch (e) {
  console.error("Error reading eduPlanningsData:", e);
}

let mockMessages = {
  eimycano68: [
    { sender: "egnis cano (Tutor)", content: "Buenos días Prof. Ariacni, ¿cómo va el progreso de Eimy en preescolar?", is_sent_by_prof: false, created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
    { sender: "Ariacni Espinoza", content: "¡Hola Egnis! Eimy va excelente. Participa con mucho entusiasmo en todas las actividades.", is_sent_by_prof: true, created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() }
  ]
};

// State trackers
let activeTeacher = "egniscano36";
let activeAdminUser = { name: "Egnis Cano", role: "admin", roleName: "🔑 Administrador" };
let adminActiveChatType = "staff"; // Default to staff chat since Admin has no tutor option
let teacherActiveChatType = "tutor";
let activeAdminChatPartner = null;
let activeTeacherChatPartner = null;
let activeStudent = "eimycano68";
let parentSelectedTrimester = null;
let parentFollowsTeacher = true; // When true, parent portal auto-follows teacher's active trimester
let editingStudentId = null;
let editingTeacherId = null;
let budgetFece = 12450.00;
let pettyCash = 320.50;
let realtimeChannel = null;

// 3. Selectors
const themeToggle = document.getElementById("themeToggle");

const simulatorWrapper = document.getElementById("simulatorWrapper");
const flowSvg = document.getElementById("flowSvg");
const connectionPath = document.getElementById("connectionPath");
const pulsePath = document.getElementById("pulsePath");

// Student Detail Elements
const studentDetailCard = document.getElementById("studentDetailCard");
const detailStudentImg = document.getElementById("detailStudentImg");
const detailStudentName = document.getElementById("detailStudentName");
const detailStudentRole = document.getElementById("detailStudentRole");
const detailStudentId = document.getElementById("detailStudentId");
const parentNameEl = document.getElementById("parentName");
const parentPhoneEl = document.getElementById("parentPhone");
const conductDescription = document.getElementById("conductDescription");
const emojiBtns = document.querySelectorAll(".emoji-btn");

// Chat Elements
const chatInputField = document.getElementById("chatInputField");
const chatSendBtn = document.getElementById("chatSendBtn");
const chatArea = document.getElementById("chatArea");
const triggerDirectChat = document.getElementById("triggerDirectChat");
const liveBadge = document.getElementById("liveBadge");

// Finance Elements
const btnDispense = document.getElementById("btnDispense");
const btnDrawerDispense = document.getElementById("btnDrawerDispense");

// Dropdown Elements
const adminDropdownMenuBtn = document.getElementById("adminDropdownMenuBtn");
const adminDropdownMenu = document.getElementById("adminDropdownMenu");

// Drawer Elements
const financePanelToggle = document.getElementById("financePanelToggle");
const financeDrawer = document.getElementById("financeDrawer");
const closeFinanceDrawerBtn = document.getElementById("closeFinanceDrawerBtn");

// Supabase Banners & Modals
const supabaseBanner = document.getElementById("supabaseBanner");
const openSqlModalBtn = document.getElementById("openSqlModalBtn");
const sqlModal = document.getElementById("sqlModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const copySqlBtn = document.getElementById("copySqlBtn");
const sqlCodeEl = document.getElementById("sqlCode");
const supabaseConnectionStatus = document.getElementById("supabaseConnectionStatus");

// Teacher Management Panel Elements
const teacherPanelToggle = document.getElementById("teacherPanelToggle");
const teachersDrawer = document.getElementById("teachersDrawer");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");
const btnListTab = document.getElementById("btnListTab");
const btnFormTab = document.getElementById("btnFormTab");
const tabTeachersList = document.getElementById("tabTeachersList");
const tabAddTeacher = document.getElementById("tabAddTeacher");
const addTeacherForm = document.getElementById("addTeacherForm");
const teachersContainerList = document.getElementById("teachersContainerList");

// Admin Settings Panel Elements
const adminSettingsPanelToggle = document.getElementById("adminSettingsPanelToggle");
const settingsDrawer = document.getElementById("settingsDrawer");
const closeSettingsDrawerBtn = document.getElementById("closeSettingsDrawerBtn");
const btnSchoolDetailsTab = document.getElementById("btnSchoolDetailsTab");
const btnCreateUserTab = document.getElementById("btnCreateUserTab");
const btnUsersListTab = document.getElementById("btnUsersListTab");
const tabSchoolDetails = document.getElementById("tabSchoolDetails");
const tabCreateUser = document.getElementById("tabCreateUser");
const tabUsersList = document.getElementById("tabUsersList");
const modifySchoolForm = document.getElementById("modifySchoolForm");
const createUserForm = document.getElementById("createUserForm");

// Student Management Panel Elements
const studentPanelToggle = document.getElementById("studentPanelToggle");
const studentsDrawer = document.getElementById("studentsDrawer");
const closeStudentsDrawerBtn = document.getElementById("closeStudentsDrawerBtn");
const btnStudentListTab = document.getElementById("btnStudentListTab");
const btnStudentFormTab = document.getElementById("btnStudentFormTab");
const tabStudentsList = document.getElementById("tabStudentsList");
const tabAddStudent = document.getElementById("tabAddStudent");
const addStudentForm = document.getElementById("addStudentForm");
const studentsContainerList = document.getElementById("studentsContainerList");

// ==========================================================================
// 4. SUPABASE DATA ACCESS & INITIALIZATION
// ==========================================================================

async function initSupabaseConnection() {
  if (!supabaseClient) {
    setupDemoMode("Supabase SDK no cargado");
    renderTeachersList();
    populateStudentGradeDropdown();
    renderStudentsList();
    renderLandingDocentesList();
    renderLandingAulasList();
    switchActiveTeacher(activeTeacher);
    return;
  }

  try {
    // Probar tablas de profesores y estudiantes
    const { data: teachers, error: tErr } = await supabaseClient.from('teachers').select('*');
    const { data: students, error: sErr } = await supabaseClient.from('students').select('*');

    if (tErr || sErr) {
      console.warn("Fallo al conectar con las tablas de Supabase:", tErr || sErr);
      setupDemoMode("Faltan tablas");
      if ((tErr && tErr.code === 'PGRST205') || (sErr && sErr.code === 'PGRST205') || 
          tErr?.message.includes("public.teachers") || sErr?.message.includes("public.students")) {
        supabaseBanner.classList.remove("hidden");
      }
    } else {
      useSupabaseDb = true;
      supabaseConnectionStatus.textContent = "Supabase: En Vivo 🟢";
      supabaseBanner.classList.add("hidden");

      let finalTeachers = teachers;
      let finalStudents = students;

      if (teachers.length === 0) {
        console.log("La tabla de profesores está vacía. Poblando semillas por defecto...");
        const defaultTeachers = [
          {
            id: "ariacniesp59",
            name: "Ariacni Espinoza",
            employee_id: "156342",
            cedula: "1-716-1071",
            profile_pic: "https://awwrasdjitrbkbyyrhzz.supabase.co/storage/v1/object/public/school-assets/teachers/1781305042226-evfhvhsipyr.jpg",
            age: 39,
            specializations: ["Licenciatura en educacion prescolar"],
            subjects: ["español", "religion", "ciencias", "ingles", "expresion artistica", "matematicas", "ciencias sociales", "educacion fisica"],
            assigned_grade: "2B"
          },
          {
            id: "egniscano36",
            name: "egnis cano",
            employee_id: "123659",
            cedula: "8-772-2232",
            profile_pic: "https://awwrasdjitrbkbyyrhzz.supabase.co/storage/v1/object/public/school-assets/teachers/1781306432087-kk6tvufqdno.JPG",
            age: 42,
            specializations: ["licenciatura en educacion primaria", "licenciatura en religion etica y moral"],
            subjects: ["Español", "Religión", "Ciencias", "Inglés", "Expresión Artística", "Matemáticas", "Ciencias Sociales", "Educación Física"],
            assigned_grade: "3A"
          },
          {
            id: "mariaperez52",
            name: "maria perez",
            employee_id: "125364",
            cedula: "1-963-785",
            profile_pic: "https://awwrasdjitrbkbyyrhzz.supabase.co/storage/v1/object/public/school-assets/teachers/1781306599178-87sg0y855e.JPG",
            age: 36,
            specializations: ["licenciatura en educacion prescolar"],
            subjects: ["Español", "Religión", "Inglés", "Expresión Artística"],
            assigned_grade: "kinder A"
          }
        ];
        const { data: insertedT, error: insTErr } = await supabaseClient.from('teachers').insert(defaultTeachers).select();
        if (!insTErr && insertedT) {
          finalTeachers = insertedT;
        } else {
          console.error("Error al poblar profesores por defecto:", insTErr);
          finalTeachers = defaultTeachers;
        }
      }

      if (students.length === 0) {
        console.log("La tabla de estudiantes está vacía. Poblando semillas por defecto...");
        const defaultStudents = [
          {
            id: "eimycano68",
            name: "eimy cano",
            role: "Estudiante",
            role_class: "badge-lime",
            accent_class: "accent-lime",
            student_id: "#EL-78937",
            img: "https://awwrasdjitrbkbyyrhzz.supabase.co/storage/v1/object/public/school-assets/students/1781304829268-gj2cuj0cz56.jpg",
            is_img_path: true,
            grades: [0, 0, 0, 0],
            conduct: "sin_evaluar",
            parent_name: "egnis cano",
            parent_phone: "62856279",
            parent_email: "egniscano@gmail.com",
            conduct_text: "El docente aún no ha registrado observaciones de conducta.",
            grade: "2B",
            attendance: true
          }
        ];
        const { data: insertedS, error: insSErr } = await supabaseClient.from('students').insert(defaultStudents).select();
        if (!insSErr && insertedS) {
          finalStudents = insertedS;
        } else {
          console.error("Error al poblar estudiantes por defecto:", insSErr);
          finalStudents = defaultStudents;
        }
      }

      // Cargar profesores
      teachersData = {};
      finalTeachers.forEach(t => {
        teachersData[t.id] = {
          id: t.id,
          name: t.name,
          employee_id: t.employee_id,
          cedula: t.cedula,
          profile_pic: t.profile_pic,
          isImgPath: t.profile_pic && (t.profile_pic.includes('/') || t.profile_pic.startsWith('data:image/')),
          age: t.age,
          specializations: t.specializations,
          subjects: t.subjects,
          assigned_grade: t.assigned_grade,
          active_trimester: t.active_trimester || 1
        };
      });
      try {
        localStorage.setItem("eduTeachersData", JSON.stringify(teachersData));
      } catch (e) {}

      // Cargar estudiantes
      studentsData = {};
      finalStudents.forEach(s => {
        studentsData[s.id] = {
          id: s.id,
          name: s.name,
          role: s.role,
          roleClass: s.role_class || s.roleClass,
          accentClass: s.accent_class || s.accentClass,
          student_id: s.student_id,
          img: s.img,
          isImgPath: s.is_img_path !== undefined ? s.is_img_path : s.isImgPath,
          grades: s.grades,
          conduct: s.conduct,
          parentName: s.parent_name || s.parentName,
          parentPhone: s.parent_phone || s.parentPhone,
          parentEmail: s.parent_email || s.parentEmail,
          conductText: s.conduct_text || s.conductText,
          grade: s.grade,
          incidents: s.incidents || [],
          noveltyReport: s.novelty_report || s.noveltyReport || {},
          subject_grades: s.subject_grades || s.subject_grades || {},
          cedula: s.cedula || "",
          age: s.age || "",
          address: s.address || "",
          birth_year: s.birth_year || s.birthYear || "",
          blood_type: s.blood_type || s.bloodType || "",
          medical_conditions: s.medical_conditions || s.medicalConditions || "",
          tutor2_name: s.tutor2_name || s.tutor2Name || "",
          tutor2_phone: s.tutor2_phone || s.tutor2Phone || "",
          status: s.status || "Nuevo",
          attendance: s.attendance !== null && s.attendance !== undefined ? s.attendance : true
        };
      });
      try {
        localStorage.setItem("eduStudentsData", JSON.stringify(studentsData));
      } catch (e) {}

      // Cargar finanzas
      await syncFinancesFromSupabase();

      // Cargar planning
      await syncPlanningFromSupabase();

      // Suscribirse a mensajes en tiempo real
      setupRealtimeChatListener();
      showToast("Ecosistema conectado a Supabase", "⚡");
    }
  } catch (err) {
    console.error("Excepción al conectar Supabase:", err);
    setupDemoMode("Excepción de red");
  }

  // Generar lista en el drawer y cargar docente inicial
  renderTeachersList();
  populateStudentGradeDropdown();
  renderStudentsList();
  renderLandingDocentesList();
  renderLandingAulasList();
  switchActiveTeacher(activeTeacher);
  renderStaffList("adminStaffListArea", false);
}

function setupDemoMode(reason) {
  useSupabaseDb = false;
  supabaseConnectionStatus.textContent = "Supabase: Modo Demo 🟡";
  console.info(`Ejecutando en Modo Demo Local. Razón: ${reason}`);
  showToast("Ejecutando en Modo Demo Local", "⚠️");
  renderStaffList("adminStaffListArea", false);
}

async function uploadFileToBucket(file, bucketName, folderName = "") {
  if (!file) return null;
  
  if (useSupabaseDb && supabaseClient) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folderName ? folderName + '/' : ''}${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      const { data, error } = await supabaseClient.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!error) {
        const { data: publicUrlData } = supabaseClient.storage
          .from(bucketName)
          .getPublicUrl(fileName);
        return publicUrlData.publicUrl;
      } else {
        console.error("Error al subir archivo a Supabase Storage:", error);
        showToast("Error Storage: " + (error.message || "Verifica políticas del bucket 'school-assets'"), "❌");
        return null;
      }
    } catch (err) {
      console.error("Excepción en uploadFileToBucket:", err);
      showToast("Error de conexión con Supabase Storage.", "❌");
      return null;
    }
  }

  // Fallback a base64 DataURL (Solo en modo Offline)
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

async function syncFinancesFromSupabase() {
  if (!useSupabaseDb) return;
  try {
    const { data, error } = await supabaseClient.from('finances').select('*').eq('id', 1).maybeSingle();
    if (data && !error) {
      budgetFece = parseFloat(data.budget_fece);
      pettyCash = parseFloat(data.petty_cash);
      updateFinanceUI();
    }
  } catch (err) {
    console.warn("Fallo al sincronizar finanzas:", err);
  }
}

async function syncPlanningFromSupabase() {
  if (!useSupabaseDb || !supabaseClient) return;
  try {
    const { data: plannings, error: pErr } = await supabaseClient.from('planning').select('*');
    if (!pErr && plannings) {
      planningsData = {};
      plannings.forEach(p => {
        planningsData[p.id] = {
          id: p.id,
          teacher_id: p.teacher_id,
          subject: p.subject,
          syllabus: p.syllabus || [],
          activities: p.activities || []
        };
        // Save back to specific local storage keys for legacy compatibility
        const syllabusKey = `eduTeacherPlanningSyllabus_${p.teacher_id}_${p.subject}`;
        const activitiesKey = `eduTeacherPlanningActivities_${p.teacher_id}_${p.subject}`;
        const planningKey = `eduTeacherPlanning_${p.teacher_id}_${p.subject}`;
        try {
          localStorage.setItem(syllabusKey, JSON.stringify(p.syllabus || []));
          localStorage.setItem(activitiesKey, JSON.stringify(p.activities || []));
          localStorage.setItem(planningKey, JSON.stringify({ syllabus: (p.syllabus || []).join(" • ") }));
        } catch(e){}
      });
      try {
        localStorage.setItem("eduPlanningsData", JSON.stringify(planningsData));
      } catch(e){}
    } else if (pErr) {
      console.warn("Fallo al conectar con la tabla de planning en Supabase:", pErr);
    }
  } catch (err) {
    console.error("Excepción al cargar planning de Supabase:", err);
  }
}

function updateFinanceUI() {
  const percentage = (budgetFece / 15000) * 100;

  // Update FECE values
  const feceValues = document.querySelectorAll(".finance-fece-value");
  feceValues.forEach(el => {
    el.innerHTML = `$${budgetFece.toLocaleString('es-PA', { minimumFractionDigits: 2 })} <span class="val-total">/ $15k</span>`;
  });

  // Update Progress bars
  const fills = document.querySelectorAll(".progress-fill");
  fills.forEach(el => {
    el.style.width = `${percentage}%`;
  });

  // Update Petty Cash values
  const pettyCashValues = document.querySelectorAll(".finance-petty-cash-value");
  pettyCashValues.forEach(el => {
    el.textContent = `$${pettyCash.toLocaleString('es-PA', { minimumFractionDigits: 2 })}`;
  });
}

// ==========================================================================
// 5. TEACHER NODE MANAGEMENT & GRADED CLASS LISTS
// ==========================================================================

function switchActiveTeacher(teacherKey, forceGrade = null) {
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

    const preservedStudentExists = filteredStudents.some(s => s.id === activeStudent);
    filteredStudents.forEach((student, idx) => {
      const isActive = preservedStudentExists ? (student.id === activeStudent) : (idx === 0);
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
}

// Renderizar la lista de profesores en el drawer con Acordeones
function renderTeachersList() {
  teachersContainerList.innerHTML = "";
  
  Object.values(teachersData || {}).forEach(t => {
    const card = document.createElement("div");
    card.className = `teacher-item-card ${t.id === activeTeacher ? 'active' : ''}`;
    card.setAttribute("data-teacher", t.id);

    // Avatar representation
    let avatarHTML = "";
    if (t.isImgPath) {
      avatarHTML = `<img src="${t.profile_pic}" alt="${t.name}">`;
    } else {
      avatarHTML = `<div class="avatar-fallback gradient-purple" style="width:100%;height:100%;color:white;font-weight:800;display:flex;align-items:center;justify-content:center;">${t.profile_pic}</div>`;
    }

    card.innerHTML = `
      <div class="teacher-item-main" onclick="event.stopPropagation();">
        <div class="teacher-item-info">
          <div class="teacher-item-avatar">
            ${avatarHTML}
          </div>
          <div class="teacher-item-meta">
            <h4>${t.name}</h4>
            <p>Empleado: ${t.employee_id} | Grado: <strong>${t.assigned_grade}</strong></p>
          </div>
        </div>
        <div class="teacher-select-dot">✦</div>
      </div>

      <!-- ACCORDION CONTROLS (INFORMACION DESPLEGABLE) -->
      <div class="accordion-wrapper" onclick="event.stopPropagation();">
        
        <!-- Accordion 1: Especializaciones -->
        <div class="accordion-item" id="accordion-spec-${t.id}">
          <div class="accordion-header">
            <span>🎓 Licenciaturas & Especialidades</span>
            <span class="accordion-arrow">▼</span>
          </div>
          <div class="accordion-body">
            <div class="spec-list">
              ${t.specializations.map(s => `<span class="spec-pill">${s}</span>`).join("")}
            </div>
          </div>
        </div>

        <!-- Accordion 2: Datos del Docente -->
        <div class="accordion-item" id="accordion-info-${t.id}">
          <div class="accordion-header">
            <span>📋 Ficha Técnica y Asignaturas</span>
            <span class="accordion-arrow">▼</span>
          </div>
          <div class="accordion-body">
            <table class="accordion-details-table">
              <tr>
                <td class="label">Cédula:</td>
                <td class="value">${t.cedula}</td>
              </tr>
              <tr>
                <td class="label">Edad:</td>
                <td class="value">${t.age} años</td>
              </tr>
              <tr>
                <td class="label">Asignaturas:</td>
                <td class="value">${t.subjects.join(", ")}</td>
              </tr>
            </table>
          </div>
        </div>

      </div>
    `;

    // Clic en la tarjeta (excepto acordeón) activa al docente
    card.querySelector(".teacher-item-main").addEventListener("click", () => {
      switchActiveTeacher(t.id);
      showToast(`Docente ${t.name} activado`, "👨‍🏫");
    });

    // Configurar acordeones desplegables
    card.querySelectorAll(".accordion-item").forEach(item => {
      const header = item.querySelector(".accordion-header");
      header.addEventListener("click", (e) => {
        e.stopPropagation();
        
        // Cerrar otros en esta misma tarjeta
        card.querySelectorAll(".accordion-item").forEach(otherItem => {
          if (otherItem !== item) otherItem.classList.remove("open");
        });

        // Alternar este acordeón
        item.classList.toggle("open");
      });
    });

    teachersContainerList.appendChild(card);
  });
}

// Guardar nuevo profesor con foto local (Base64)
async function handleRegisterTeacher(e) {
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

  // Id único
  const id = name.toLowerCase().replace(/[^a-z]/g, "").substring(0, 10) + Math.floor(Math.random()*100);

  const teacherPayload = {
    id: id,
    name: name,
    employee_id: empId,
    cedula: cedula,
    profile_pic: profilePic,
    age: age,
    specializations: specializations,
    subjects: subjects,
    assigned_grade: grade
  };

  if (useSupabaseDb) {
    try {
      const { error } = await supabaseClient.from('teachers').insert([
        {
          id: id,
          name: name,
          employee_id: empId,
          cedula: cedula,
          profile_pic: profilePic,
          age: age,
          specializations: specializations,
          subjects: subjects,
          assigned_grade: grade
        }
      ]);

      if (error) {
        console.error("Fallo al guardar docente en Supabase:", error);
        showToast("Error de conexión al guardar", "❌");
        return;
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Guardar localmente
  teachersData[id] = {
    ...teacherPayload,
    isImgPath: isImgPath
  };
  try {
    localStorage.setItem("eduTeachersData", JSON.stringify(teachersData));
  } catch(e) {}

  showToast(`Profesor ${name} registrado con éxito`, "💾");
  
  // Limpiar form y preview
  addTeacherForm.reset();
  const preview = document.getElementById("teacherPhotoPreview");
  if (preview) preview.innerHTML = "<span>Subir Foto (PNG/JPG)</span>";
  
  // Actualizar lista en drawer
  renderTeachersList();
  populateStudentGradeDropdown();
  renderLandingDocentesList();
  renderLandingAulasList();

  // Cambiar a pestaña Lista
  btnListTab.click();

  // Seleccionar automáticamente al profesor creado
  switchActiveTeacher(id);
}

// Renderizar la lista de estudiantes en el drawer de estudiantes agrupados por aula
function renderStudentsList() {
  const container = document.getElementById("studentsContainerList");
  if (!container) return;
  container.innerHTML = "";

  // Agrupar estudiantes por grado/aula
  const grouped = {};
  // Inicializar todas las aulas registradas en los profesores
  Object.values(teachersData || {}).forEach(t => {
    if (t && t.assigned_grade) {
      grouped[t.assigned_grade] = [];
    }
  });

  // Distribuir estudiantes en sus respectivas aulas
  Object.values(studentsData || {}).forEach(s => {
    const grade = s.grade || "Sin Asignar";
    if (!grouped[grade]) {
      grouped[grade] = [];
    }
    grouped[grade].push(s);
  });

  // Renderizar cada grupo de aula de forma ordenada
  Object.keys(grouped).sort().forEach(grade => {
    const studentsInClass = grouped[grade];
    
    const groupDiv = document.createElement("div");
    groupDiv.className = "classroom-group-box";
    
    // Determinar si esta aula pertenece al docente activo para dejarla abierta por defecto
    const activeGrade = teachersData[activeTeacher]?.assigned_grade;
    const isInitiallyOpen = (grade === activeGrade);

    groupDiv.innerHTML = `
      <div class="classroom-group-header" data-grade="${grade}">
        <span>🏫 Aula ${grade}</span>
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="classroom-count-badge">${studentsInClass.length} Alumnos</span>
          <span class="group-arrow">${isInitiallyOpen ? "▲" : "▼"}</span>
        </div>
      </div>
      <div class="classroom-group-content ${isInitiallyOpen ? '' : 'collapsed-group'}" id="group-content-${grade}">
      </div>
    `;

    const contentDiv = groupDiv.querySelector(".classroom-group-content");

    if (studentsInClass.length === 0) {
      contentDiv.innerHTML = `<p class="helper-text" style="padding: 10px 14px; margin: 0;">No hay alumnos registrados en esta aula.</p>`;
    } else {
      studentsInClass.forEach(s => {
        const card = document.createElement("div");
        card.className = `teacher-item-card student-item-card ${s.id === activeStudent ? 'active' : ''}`;
        card.setAttribute("data-student", s.id);

        let avatarHTML = "";
        if (s.isImgPath || s.is_img_path || (s.img && s.img.startsWith('data:image/')) || (s.img && s.img.includes('/'))) {
          avatarHTML = `<img src="${s.img}" alt="${s.name}">`;
        } else {
          avatarHTML = `<div class="avatar-fallback gradient-blue" style="width:100%;height:100%;color:white;font-weight:800;display:flex;align-items:center;justify-content:center;">${s.img}</div>`;
        }

        card.innerHTML = `
          <div class="teacher-item-main" onclick="event.stopPropagation();">
            <div class="teacher-item-info">
              <div class="teacher-item-avatar">
                ${avatarHTML}
              </div>
              <div class="teacher-item-meta">
                <h4>${s.name}</h4>
                <p>Exp: ${s.student_id}</p>
              </div>
            </div>
            <div class="teacher-select-dot">✦</div>
          </div>

          <!-- ACCORDION CONTROLS (INFORMACION DESPLEGABLE) -->
          <div class="accordion-wrapper" onclick="event.stopPropagation();">
            
            <!-- Accordion 1: Datos de Padres/Tutores -->
            <div class="accordion-item" id="accordion-student-parent-${s.id}">
              <div class="accordion-header">
                <span>👪 Datos del Acudiente / Tutor</span>
                <span class="accordion-arrow">▼</span>
              </div>
              <div class="accordion-body">
                <table class="accordion-details-table">
                  <tr>
                    <td class="label">Acudiente:</td>
                    <td class="value">${s.parentName || s.parent_name}</td>
                  </tr>
                  <tr>
                    <td class="label">Teléfono:</td>
                    <td class="value">${s.parentPhone || s.parent_phone}</td>
                  </tr>
                  <tr>
                    <td class="label">Correo:</td>
                    <td class="value">${s.parentEmail || s.parent_email}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Accordion 2: Rendimiento y Conducta -->
            <div class="accordion-item" id="accordion-student-info-${s.id}">
              <div class="accordion-header">
                <span>📊 Académico y Conducta</span>
                <span class="accordion-arrow">▼</span>
              </div>
              <div class="accordion-body">
                <table class="accordion-details-table">
                  <tr>
                    <td class="label">Conducta:</td>
                    <td class="value"><span style="text-transform: capitalize;">${s.conduct}</span></td>
                  </tr>
                  <tr>
                    <td class="label">Notas:</td>
                    <td class="value">${s.grades.map(n => parseFloat(n).toFixed(1)).join(" | ")}</td>
                  </tr>
                </table>
              </div>
            </div>

          </div>
        `;

        // Clic en la tarjeta activa al estudiante
        card.querySelector(".teacher-item-main").addEventListener("click", () => {
          activeStudent = s.id;
          
          // Resaltar fila activa en la pantalla principal
          document.querySelectorAll(".student-row").forEach(r => {
            if (r.getAttribute("data-student") === s.id) {
              r.classList.add("active");
            } else {
              r.classList.remove("active");
            }
          });

          // Resaltar en el propio drawer
          document.querySelectorAll(".student-item-card").forEach(c => {
            if (c.getAttribute("data-student") === s.id) {
              c.classList.add("active");
            } else {
              c.classList.remove("active");
            }
          });

          updateStudentDetails(s.id);
          showToast(`Estudiante ${s.name} activado`, "👥");
        });

        // Configurar acordeones desplegables internos
        card.querySelectorAll(".accordion-item").forEach(item => {
          const header = item.querySelector(".accordion-header");
          header.addEventListener("click", (e) => {
            e.stopPropagation();
            card.querySelectorAll(".accordion-item").forEach(otherItem => {
              if (otherItem !== item) otherItem.classList.remove("open");
            });
            item.classList.toggle("open");
          });
        });

        contentDiv.appendChild(card);
      });
    }

    // Evento para colapsar/expandir el grupo de aula completo
    const headerClickEl = groupDiv.querySelector(".classroom-group-header");
    headerClickEl.addEventListener("click", () => {
      const isCollapsed = contentDiv.classList.toggle("collapsed-group");
      groupDiv.querySelector(".group-arrow").textContent = isCollapsed ? "▼" : "▲";
    });

    container.appendChild(groupDiv);
  });
}

// Guardar nuevo estudiante con foto local (Base64) y datos de acudiente
async function handleRegisterStudent(e) {
  e.preventDefault();

  const name = document.getElementById("regStudentName").value.trim();
  const cedula = document.getElementById("regStudentCedula").value.trim();
  const grade = document.getElementById("regStudentGrade").value;
  const age = parseInt(document.getElementById("regStudentAge").value) || 0;
  const birthYear = parseInt(document.getElementById("regStudentBirthYear").value) || 0;
  const bloodType = document.getElementById("regStudentBloodType").value.trim();
  const status = document.getElementById("regStudentStatus").value;
  const address = document.getElementById("regStudentAddress").value.trim();
  const medicalConditions = document.getElementById("regStudentMedicalConditions").value.trim();
  
  const parentName = document.getElementById("regStudentParentName").value.trim();
  const parentPhone = document.getElementById("regStudentParentPhone").value.trim();
  
  const tutor2Name = document.getElementById("regStudentTutor2Name").value.trim();
  const tutor2Phone = document.getElementById("regStudentTutor2Phone").value.trim();
  
  const parentEmail = document.getElementById("regStudentParentEmail").value.trim();
  
  // Obtener foto desde archivo local
  const photoInput = document.getElementById("regStudentPhoto");
  let profilePic = "";
  let isImgPath = false;
  let hasNewPhoto = false;

  if (photoInput && photoInput.files && photoInput.files[0]) {
    const file = photoInput.files[0];
    const uploadUrl = await uploadFileToBucket(file, "school-assets", "students");
    if (uploadUrl) {
      profilePic = uploadUrl;
      isImgPath = true;
      hasNewPhoto = true;
    } else {
      // Fallback a Base64 local si falla la subida a Supabase o estamos en demo
      try {
        profilePic = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });
        isImgPath = true;
        hasNewPhoto = true;
      } catch (err) {
        profilePic = registeredStudentPhotoDataUrl || "";
        isImgPath = !!profilePic;
        hasNewPhoto = !!profilePic;
      }
    }
  } else if (registeredStudentPhotoDataUrl) {
    profilePic = registeredStudentPhotoDataUrl;
    isImgPath = true;
    hasNewPhoto = true;
  }

  if (editingStudentId) {
    const student = studentsData[editingStudentId];
    if (!student) {
      showToast("Error: No se encontró el estudiante a editar", "❌");
      return;
    }

    // Prepare updated payload
    const updatedPayload = {
      ...student,
      name: name,
      cedula: cedula,
      grade: grade,
      age: age,
      birth_year: birthYear,
      blood_type: bloodType,
      status: status,
      address: address,
      medical_conditions: medicalConditions,
      parentName: parentName,
      parentPhone: parentPhone,
      parentEmail: parentEmail,
      tutor2_name: tutor2Name,
      tutor2_phone: tutor2Phone
    };

    if (hasNewPhoto) {
      updatedPayload.img = profilePic;
      updatedPayload.isImgPath = isImgPath;
    }

    // Save locally
    studentsData[editingStudentId] = updatedPayload;
    try {
      localStorage.setItem("eduStudentsData", JSON.stringify(studentsData));
    } catch(e) {}

    // Sync to Supabase
    if (useSupabaseDb && supabaseClient) {
      try {
        const updateObj = {
          name: name,
          cedula: cedula,
          grade: grade,
          age: age,
          birth_year: birthYear,
          blood_type: bloodType,
          status: status,
          address: address,
          medical_conditions: medicalConditions,
          parent_name: parentName,
          parent_phone: parentPhone,
          parent_email: parentEmail,
          tutor2_name: tutor2Name,
          tutor2_phone: tutor2Phone
        };
        if (hasNewPhoto) {
          updateObj.img = profilePic;
          updateObj.is_img_path = isImgPath;
        }

        const { error } = await supabaseClient
          .from('students')
          .update(updateObj)
          .eq('id', editingStudentId);

        if (error) {
          console.error("Fallo al actualizar estudiante en Supabase:", error);
          showToast("Guardado localmente. Falló sincronización Supabase", "⚠️");
        } else {
          showToast(`Datos de ${name} actualizados con éxito`, "✏️");
        }
      } catch (err) {
        console.error(err);
        showToast("Error de red al actualizar en Supabase", "⚠️");
      }
    } else {
      showToast(`Datos de ${name} actualizados localmente`, "✏️");
    }

    const currentEditingId = editingStudentId;
    resetStudentFormEditMode();
    renderStudentsList();
    renderLandingAulasList();
    renderLandingDocentesList();

    if (activeTeacher && teachersData[activeTeacher]) {
      switchActiveTeacher(activeTeacher);
    }

    if (activeStudent === currentEditingId) {
      updateStudentDetails(currentEditingId);
    }

    btnStudentListTab.click();
    return;
  }

  // Si no está editando, registrar nuevo estudiante
  if (profilePic) {
    // Ya cargó arriba en profilePic
  } else {
    // Iniciales como fallback
    const words = name.split(" ");
    const initials = words.map(w => w[0]).join("").toUpperCase().substring(0, 2);
    profilePic = initials || "SP";
    isImgPath = false;
  }

  // Id único
  const id = name.toLowerCase().replace(/[^a-z]/g, "").substring(0, 10) + Math.floor(Math.random()*100);

  // Notas iniciales por defecto (en cero)
  const grades = [0.0, 0.0, 0.0, 0.0];
  
  // Descripción de conducta por defecto (sin evaluar)
  const conduct = "sin_evaluar";
  const conductText = "El docente aún no ha registrado observaciones de conducta.";
  const accentClass = "accent-lime";
  const roleClass = "badge-lime";
  const studentId = "#EL-" + Math.floor(10000 + Math.random() * 90000);

  const studentPayload = {
    id: id,
    name: name,
    role: "Estudiante",
    roleClass: roleClass,
    accentClass: accentClass,
    student_id: studentId,
    img: profilePic,
    isImgPath: isImgPath,
    grades: grades,
    conduct: conduct,
    parentName: parentName,
    parentPhone: parentPhone,
    parentEmail: parentEmail,
    conductText: conductText,
    grade: grade,
    incidents: [],
    noveltyReport: {},
    subject_grades: {},
    cedula: cedula,
    age: age,
    address: address,
    birth_year: birthYear,
    blood_type: bloodType,
    medical_conditions: medicalConditions,
    tutor2_name: tutor2Name,
    tutor2_phone: tutor2Phone,
    status: status,
    attendance: true
  };

  // Guardar en Supabase si está en vivo
  if (useSupabaseDb) {
    try {
      const { error } = await supabaseClient.from('students').insert([
        {
          id: id,
          name: name,
          role: "Estudiante",
          role_class: roleClass,
          accent_class: accentClass,
          student_id: studentId,
          img: profilePic,
          is_img_path: isImgPath,
          grades: grades,
          conduct: conduct,
          parent_name: parentName,
          parent_phone: parentPhone,
          parent_email: parentEmail,
          conduct_text: conductText,
          grade: grade,
          incidents: [],
          novelty_report: {},
          subject_grades: {},
          cedula: cedula,
          age: age,
          address: address,
          birth_year: birthYear,
          blood_type: bloodType,
          medical_conditions: medicalConditions,
          tutor2_name: tutor2Name,
          tutor2_phone: tutor2Phone,
          status: status,
          attendance: true
        }
      ]);

      if (error) {
        console.error("Fallo al guardar estudiante en Supabase:", error);
        showToast("Registrado localmente. Falló sincronización Supabase", "⚠️");
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Guardar localmente
  studentsData[id] = studentPayload;
  try {
    localStorage.setItem("eduStudentsData", JSON.stringify(studentsData));
  } catch(e) {}

  // Chats mock
  mockMessages[id] = [
    { sender: parentName, content: `Hola profesor, soy acudiente de ${name}. Quedo a su disposición.`, is_sent_by_prof: false, created_at: new Date().toISOString() }
  ];

  showToast(`Estudiante ${name} registrado con éxito`, "💾");
  
  // Limpiar form y preview
  document.getElementById("addStudentForm").reset();
  const preview = document.getElementById("studentPhotoPreview");
  if (preview) preview.innerHTML = "<span>Subir Foto (PNG/JPG)</span>";
  registeredStudentPhotoDataUrl = "";

  // Re-renderizar listas
  renderStudentsList();
  renderLandingAulasList();
  renderLandingDocentesList();
  
  // Refrescar grids del dashboard
  if (activeTeacher && teachersData[activeTeacher]) {
    switchActiveTeacher(activeTeacher);
  }

  // Volver a pestaña lista
  btnStudentListTab.click();

  // Seleccionar estudiante registrado
  activeStudent = id;
  updateStudentDetails(id);
}

// ==========================================================================
// 6. REALTIME CHAT SYNC (POSTGRES CHANGE SUBSCRIPTION)
// ==========================================================================

function setupRealtimeChatListener() {
  if (!useSupabaseDb || !supabaseClient) return;

  const liveBadge = document.getElementById("liveBadge");
  if (liveBadge) {
    liveBadge.classList.add("animate-pulse");
    liveBadge.textContent = "Realtime Activo";
  }

  if (realtimeChannel) {
    supabaseClient.removeChannel(realtimeChannel);
  }

  realtimeChannel = supabaseClient.channel('public:db_changes')
    // 1. Chat Messages (Tutor Chat)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, payload => {
      const msg = payload.new;

      // Play double-beep notification sound if message is received (not sent by us)
      if (!msg.is_sent_by_prof) {
        playChatNotificationSound();
      }

      if (msg.student_key === activeStudent) {
        const teacherView = document.getElementById("teacherDashboardView");
        const isTeacher = teacherView && !teacherView.classList.contains("hidden");
        const tArea = document.getElementById("teacherChatArea");
        if (isTeacher) {
          if (teacherActiveChatType === "tutor") {
            appendMessageToArea(msg, tArea, false);
          }
        } else {
          if (adminActiveChatType === "tutor") {
            appendMessageToArea(msg, chatArea, false);
          }
        }
      }
      
      const parentView = document.getElementById("parentDashboardView");
      const isParent = parentView && !parentView.classList.contains("hidden");
      
      if (isParent && msg.student_key === activeParentStudentId) {
        const parentArea = document.getElementById("parentChatArea");
        if (parentArea) {
          appendMessageToArea(msg, parentArea, msg.is_sent_by_prof);
        }
        const parentAreaMobile = document.getElementById("parentChatAreaMobile");
        if (parentAreaMobile) {
          appendMessageToArea(msg, parentAreaMobile, msg.is_sent_by_prof);
        }
        if (msg.is_sent_by_prof) {
          playChatNotificationSound();
        }
      } else if (!msg.is_sent_by_prof && msg.student_key !== activeStudent && !isParent) {
        // Notification for another student
        const student = studentsData[msg.student_key];
        const studentName = student ? student.name : "un estudiante";
        showToast(`Mensaje del tutor de ${studentName}: ${msg.content}`, "💬");
      }
    })
    // 1b. Staff Messages (Personal Chat)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'staff_messages' }, payload => {
      const msg = payload.new;
      const myId = getCurrentUserId();

      // Only process messages involving current user
      if (msg.receiver !== myId && msg.sender !== myId) return;

      const teacherView = document.getElementById("teacherDashboardView");
      const isTeacher = teacherView && !teacherView.classList.contains("hidden");

      // Play notification sound only for messages received from others
      if (msg.sender !== myId) {
        playChatNotificationSound();
      }

      if (isTeacher) {
        // Determine the active partner for the teacher's conversation
        const isActiveConversation = teacherActiveChatType === "staff" && (
          activeTeacherChatPartner === msg.sender ||
          activeTeacherChatPartner === msg.receiver
        );
        if (isActiveConversation) {
          appendMessageToArea(msg, document.getElementById("teacherStaffChatArea"), true);
        } else if (msg.sender !== myId) {
          const name = getStaffName(msg.sender) || msg.sender;
          showToast(`Nuevo mensaje de ${name}: ${msg.content}`, "🏫");
        }
      } else {
        // Determine the active partner for the admin's conversation
        const isActiveConversation = adminActiveChatType === "staff" && (
          activeAdminChatPartner === msg.sender ||
          activeAdminChatPartner === msg.receiver
        );
        if (isActiveConversation) {
          appendMessageToArea(msg, document.getElementById("chatArea"), true);
        } else if (msg.sender !== myId) {
          const name = getStaffName(msg.sender) || msg.sender;
          showToast(`Nuevo mensaje de ${name}: ${msg.content}`, "🏫");
        }
      }
    })
    // 2. Students updates (inserts, updates, deletes)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, payload => {
      const eventType = payload.eventType;
      const updatedStudent = payload.new || payload.old;
      console.log(`Realtime student event (${eventType}):`, updatedStudent);
      
      if (!updatedStudent) return;

      if (eventType === 'DELETE') {
        delete studentsData[updatedStudent.id];
      } else {
        const prev = studentsData[updatedStudent.id] || {};
        // Defensive merge: only overwrite if the new value is not null/undefined
        const def = (newVal, fallback) => (newVal !== null && newVal !== undefined) ? newVal : fallback;
        studentsData[updatedStudent.id] = {
          ...prev,
          name: def(updatedStudent.name, prev.name),
          student_id: def(updatedStudent.student_id, prev.student_id),
          img: def(updatedStudent.img, prev.img),
          isImgPath: def(updatedStudent.is_img_path, prev.isImgPath),
          grades: def(updatedStudent.grades, prev.grades),
          conduct: def(updatedStudent.conduct, prev.conduct),
          conductText: def(updatedStudent.conduct_text, prev.conductText),
          parentName: def(updatedStudent.parent_name, prev.parentName),
          parentPhone: def(updatedStudent.parent_phone, prev.parentPhone),
          parentEmail: def(updatedStudent.parent_email, prev.parentEmail),
          grade: def(updatedStudent.grade, prev.grade),
          incidents: def(updatedStudent.incidents, prev.incidents) || [],
          noveltyReport: def(updatedStudent.novelty_report, prev.noveltyReport) || {},
          subject_grades: def(updatedStudent.subject_grades, prev.subject_grades) || {},
          cedula: def(updatedStudent.cedula, prev.cedula) || "",
          age: def(updatedStudent.age, prev.age) || "",
          address: def(updatedStudent.address, prev.address) || "",
          birth_year: def(updatedStudent.birth_year, prev.birth_year) || "",
          blood_type: def(updatedStudent.blood_type, prev.blood_type) || "",
          medical_conditions: def(updatedStudent.medical_conditions, prev.medical_conditions) || "",
          tutor2_name: def(updatedStudent.tutor2_name, prev.tutor2_name) || "",
          tutor2_phone: def(updatedStudent.tutor2_phone, prev.tutor2_phone) || "",
          status: def(updatedStudent.status, prev.status) || "Nuevo",
          attendance: (updatedStudent.attendance !== null && updatedStudent.attendance !== undefined)
            ? updatedStudent.attendance
            : (prev.attendance !== undefined ? prev.attendance : true)
        };
      }

      // Save to localStorage
      try {
        localStorage.setItem("eduStudentsData", JSON.stringify(studentsData));
      } catch(e) {}

      // Refresh UI if it is the active student details card in admin
      if (activeStudent === updatedStudent.id) {
        updateStudentDetails(updatedStudent.id);
      }
      
      // Refresh teacher student portal list if visible
      const teacherView = document.getElementById("teacherDashboardView");
      if (teacherView && !teacherView.classList.contains("hidden")) {
        loadTeacherStudents();
      }

      // Refresh admin dashboard student grid
      if (activeTeacher && teachersData[activeTeacher]) {
        switchActiveTeacher(activeTeacher);
      }

      // Refresh admin students list drawer
      renderStudentsList();
      renderLandingAulasList();
      renderLandingDocentesList();
      if (typeof renderDashboardStats === 'function') {
        renderDashboardStats();
      }
      
      // Refresh parent dashboard data if it is open
      const parentView = document.getElementById("parentDashboardView");
      if (parentView && !parentView.classList.contains("hidden") && activeParentStudentId === updatedStudent.id) {
        // When new grade data arrives, always follow teacher's active trimester
        // so that T2/T3 grades are shown immediately in real-time
        const studentForParent = studentsData[updatedStudent.id];
        if (studentForParent) {
          const adviserForParent = Object.values(teachersData).find(t => t.assigned_grade === studentForParent.grade);
          if (adviserForParent && adviserForParent.active_trimester) {
            parentFollowsTeacher = true;
            parentSelectedTrimester = adviserForParent.active_trimester;
          }
        }
        if (typeof renderParentDashboardData === 'function') {
          renderParentDashboardData(updatedStudent.id);
        }
      }

    })
    // 3. Teachers updates (subjects, grade assigned)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'teachers' }, payload => {
      const updatedTeacher = payload.new;
      console.log("Realtime teacher update:", updatedTeacher);

      teachersData[updatedTeacher.id] = {
        ...teachersData[updatedTeacher.id],
        name: updatedTeacher.name,
        subjects: updatedTeacher.subjects,
        assigned_grade: updatedTeacher.assigned_grade,
        active_trimester: updatedTeacher.active_trimester !== undefined ? updatedTeacher.active_trimester : (teachersData[updatedTeacher.id]?.active_trimester || 1),
        specializations: updatedTeacher.specializations || teachersData[updatedTeacher.id]?.specializations || [],
        profile_pic: updatedTeacher.profile_pic || teachersData[updatedTeacher.id]?.profile_pic || '',
        isImgPath: updatedTeacher.is_img_path !== undefined ? updatedTeacher.is_img_path : (teachersData[updatedTeacher.id]?.isImgPath || false)
      };

      try {
        localStorage.setItem("eduTeachersData", JSON.stringify(teachersData));
      } catch(e) {}

      // Refresh student list and dropdowns
      const teacherView = document.getElementById("teacherDashboardView");
      if (teacherView && !teacherView.classList.contains("hidden") && activeTeacher === updatedTeacher.id) {
        updateTeacherSubjectDropdown();
        loadTeacherStudents();
      }

      if (activeStudent) {
        updateStudentDetails(activeStudent);
      }
      renderStudentsList();

      // Refresh parent dashboard teacher info card in real-time
      const parentView = document.getElementById("parentDashboardView");
      if (parentView && !parentView.classList.contains("hidden") && activeParentStudentId) {
        const parentStudent = studentsData[activeParentStudentId];
        if (parentStudent && parentStudent.grade === updatedTeacher.assigned_grade) {
          if (updatedTeacher.active_trimester !== undefined) {
            // Teacher changed active trimester → reset parent to follow teacher automatically
            parentFollowsTeacher = true;
            parentSelectedTrimester = updatedTeacher.active_trimester;
          }
          if (typeof renderParentDashboardData === 'function') {
            renderParentDashboardData(activeParentStudentId);
          }
        }
      }

    })

    // 4. Planning updates
    .on('postgres_changes', { event: '*', schema: 'public', table: 'planning' }, payload => {
      const eventType = payload.eventType;
      const updatedPlanning = payload.new || payload.old;
      console.log(`Realtime planning event (${eventType}):`, updatedPlanning);
      
      if (!updatedPlanning) return;

      if (eventType === 'DELETE') {
        delete planningsData[updatedPlanning.id];
      } else {
        planningsData[updatedPlanning.id] = {
          id: updatedPlanning.id,
          teacher_id: updatedPlanning.teacher_id,
          subject: updatedPlanning.subject,
          syllabus: updatedPlanning.syllabus || [],
          activities: updatedPlanning.activities || []
        };
        // Also save to local storage specific keys for legacy compatibility
        const syllabusKey = `eduTeacherPlanningSyllabus_${updatedPlanning.teacher_id}_${updatedPlanning.subject}`;
        const activitiesKey = `eduTeacherPlanningActivities_${updatedPlanning.teacher_id}_${updatedPlanning.subject}`;
        const planningKey = `eduTeacherPlanning_${updatedPlanning.teacher_id}_${updatedPlanning.subject}`;
        try {
          localStorage.setItem(syllabusKey, JSON.stringify(updatedPlanning.syllabus || []));
          localStorage.setItem(activitiesKey, JSON.stringify(updatedPlanning.activities || []));
          localStorage.setItem(planningKey, JSON.stringify({ syllabus: (updatedPlanning.syllabus || []).join(" • ") }));
        } catch(e){}
      }

      try {
        localStorage.setItem("eduPlanningsData", JSON.stringify(planningsData));
      } catch(e){}

      // If parent dashboard is open, refresh view in real-time!
      const parentView = document.getElementById("parentDashboardView");
      if (parentView && !parentView.classList.contains("hidden") && activeParentStudentId) {
        if (typeof renderParentDashboardData === 'function') {
          renderParentDashboardData(activeParentStudentId);
        }
      }

      // If teacher dashboard is open, refresh planning
      const teacherView = document.getElementById("teacherDashboardView");
      if (teacherView && !teacherView.classList.contains("hidden")) {
        const select = document.getElementById("teacherSubjectSelect");
        if (select && select.value === updatedPlanning.subject && activeTeacher === updatedPlanning.teacher_id) {
          loadSelectedSubjectPlanning();
        }
        loadTeacherStudents();
      }
    })
    .subscribe();
}

function isSenderMe(senderName) {
  if (!senderName) return false;
  
  const myId = getCurrentUserId();
  const myIdLower = myId ? myId.toLowerCase().trim() : "";
  const senderLower = senderName.toLowerCase().trim();
  
  // 1. Direct ID / Email / Username match
  if (senderLower === myIdLower) {
    return true;
  }
  
  // 2. Name-based match
  const teacherView = document.getElementById("teacherDashboardView");
  const isTeacher = teacherView && !teacherView.classList.contains("hidden");
  
  if (isTeacher) {
    const teacher = teachersData[activeTeacher];
    if (teacher) {
      const teacherName = teacher.name.toLowerCase();
      const cleanSender = senderLower.replace("prof.", "").trim();
      const cleanTeacher = teacherName.replace("prof.", "").trim();
      if (cleanSender.includes(cleanTeacher) || cleanTeacher.includes(cleanSender) || senderLower === activeTeacher.toLowerCase()) {
        return true;
      }
    }
  } else {
    const adminName = activeAdminUser ? activeAdminUser.name.toLowerCase() : "egnis cano";
    const cleanSender = senderLower.replace("prof.", "").trim();
    const cleanAdmin = adminName.replace("prof.", "").trim();
    if (cleanSender.includes(cleanAdmin) || cleanAdmin.includes(cleanSender) || senderLower === "admin") {
      return true;
    }
  }
  
  return false;
}

function getMsgContentHTML(contentStr) {
  let contentHtml = escapeHTML(contentStr);
  if (contentStr.trim().startsWith("{") && contentStr.trim().endsWith("}")) {
    try {
      const parsed = JSON.parse(contentStr);
      if (parsed.file) {
        const file = parsed.file;
        const fileNameLower = file.name.toLowerCase();
        const isImg = file.type.startsWith("image/") || fileNameLower.endsWith(".jpg") || fileNameLower.endsWith(".png") || fileNameLower.endsWith(".jpeg");
        
        if (isImg) {
          contentHtml = `
            <div class="chat-file-image">
              <img src="${file.data}" alt="${escapeHTML(file.name)}" onclick="window.openImageModal('${file.data}')">
              <div class="chat-file-name" style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 6px;">
                <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem;">🖼️ ${escapeHTML(file.name)}</span>
                <a href="${file.data}" target="_blank" download="${escapeHTML(file.name)}" class="file-download-btn" style="width: 22px; height: 22px; min-width: 22px; font-size: 0.8rem;" title="Descargar / Abrir">📥</a>
              </div>
            </div>
          `;
        } else {
          let icon = "📁";
          let label = "Archivo";
          let colorClass = "file-generic";
          
          if (fileNameLower.endsWith(".pdf")) {
            icon = "📕";
            label = "Documento PDF";
            colorClass = "file-pdf";
          } else if (fileNameLower.endsWith(".doc") || fileNameLower.endsWith(".docx")) {
            icon = "📘";
            label = "Documento Word";
            colorClass = "file-word";
          } else if (fileNameLower.endsWith(".xls") || fileNameLower.endsWith(".xlsx")) {
            icon = "📗";
            label = "Hoja de Excel";
            colorClass = "file-excel";
          }
          
          contentHtml = `
            <div class="chat-file-doc ${colorClass}">
              <span class="file-icon">${icon}</span>
              <div class="file-info">
                <span class="file-title" title="${escapeHTML(file.name)}">${escapeHTML(file.name)}</span>
                <span class="file-subtitle">${label}</span>
              </div>
              <a href="${file.data}" target="_blank" download="${escapeHTML(file.name)}" class="file-download-btn" title="Descargar / Abrir">
                📥
              </a>
            </div>
          `;
        }
      } else if (parsed.text) {
        contentHtml = escapeHTML(parsed.text);
      }
    } catch(e) {
      contentHtml = escapeHTML(contentStr);
    }
  }
  return contentHtml;
}

function appendMessageToArea(msg, area, isStaffChat) {
  if (!area) return;
  const placeholder = area.querySelector(".chat-placeholder");
  if (placeholder) placeholder.remove();

  const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  let bubbleClass = "received";
  let senderColor = "var(--color-orange)";

  if (isStaffChat) {
    const isMe = isSenderMe(msg.sender);
    bubbleClass = isMe ? "sent" : "received";
    senderColor = isMe ? "var(--color-cyan)" : "var(--color-orange)";
  } else {
    const isTeacher = document.getElementById("teacherDashboardView") && !document.getElementById("teacherDashboardView").classList.contains("hidden");
    const isAdmin = document.getElementById("adminDashboardView") && !document.getElementById("adminDashboardView").classList.contains("hidden");
    const isMe = (isTeacher || isAdmin) ? msg.is_sent_by_prof : !msg.is_sent_by_prof;
    
    bubbleClass = isMe ? "sent" : "received";
    senderColor = isMe ? "var(--color-cyan)" : "var(--color-orange)";
  }

  const contentHtml = getMsgContentHTML(msg.content);
  const msgHTML = `
    <div class="chat-bubble ${bubbleClass}">
      <div class="sender" style="color: ${senderColor}">${escapeHTML(msg.sender)}</div>
      <div class="msg-content">${contentHtml}</div>
      <div class="time">${time}</div>
    </div>
  `;
  area.insertAdjacentHTML("beforeend", msgHTML);
  area.scrollTop = area.scrollHeight;
}

async function loadChatHistory(chatType, studentKey, area) {
  if (!area) return;
  area.innerHTML = "";

  if (chatType === "staff") {
    // Determine current user and partner
    const myId = getCurrentUserId();
    const partnerIdAdmin = activeAdminChatPartner;
    const partnerIdTeacher = activeTeacherChatPartner;
    const partnerId = partnerIdAdmin || partnerIdTeacher || null;

    if (!useSupabaseDb) {
      let list = [];
      try {
        const stored = localStorage.getItem("eduStaffMessages");
        if (stored) {
          list = JSON.parse(stored);
        } else {
          list = [
            { sender: myId, receiver: partnerId || "admin", content: "Bienvenidos al canal de mensajería interna del personal.", created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() }
          ];
          localStorage.setItem("eduStaffMessages", JSON.stringify(list));
        }
      } catch(e) {}

      // Filter to only show messages between myId and partnerId
      if (partnerId) {
        list = list.filter(m =>
          (m.sender === myId && m.receiver === partnerId) ||
          (m.sender === partnerId && m.receiver === myId)
        );
      }
      renderHistoryList(list, area, true);
      return;
    }

    try {
      let query = supabaseClient
        .from('staff_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (partnerId) {
        // Filter to 1-to-1 conversation
        query = query.or(
          `and(sender.eq.${myId},receiver.eq.${partnerId}),and(sender.eq.${partnerId},receiver.eq.${myId})`
        );
      }

      const { data, error } = await query;
      if (!error && data) {
        renderHistoryList(data, area, true);
      }
    } catch(err) {
      console.error("Error al cargar mensajes del personal:", err);
    }
  } else {
    if (!studentKey) {
      area.innerHTML = `<p class="chat-placeholder">Selecciona un alumno para chatear con su acudiente...</p>`;
      return;
    }

    if (!useSupabaseDb) {
      const list = mockMessages[studentKey] || [];
      renderHistoryList(list, area, false);
      return;
    }

    try {
      const { data, error } = await supabaseClient
        .from('chat_messages')
        .select('*')
        .eq('student_key', studentKey)
        .order('created_at', { ascending: true });
      if (!error && data) {
        renderHistoryList(data, area, false);
      }
    } catch (err) {
      console.error("Error al cargar mensajes del tutor:", err);
    }
  }
}

function renderHistoryList(msgList, area, isStaffChat) {
  area.innerHTML = "";
  if (msgList.length === 0) {
    area.innerHTML = `<p class="chat-placeholder">No hay mensajes previos. Envía uno para iniciar la conversación.</p>`;
    return;
  }
  msgList.forEach(msg => {
    appendMessageToArea(msg, area, isStaffChat);
  });
}

async function loadChatMessagesFromSupabase(studentKey) {
  loadChatHistory(adminActiveChatType, studentKey, chatArea);
}

// ==========================================================================
// 7. CORE INTERACTIONS (STUDENT VIEW UPDATES & SIMULATIONS)
// ==========================================================================

function updateStudentDetails(studentKey) {
  const data = studentsData[studentKey];
  if (!data) return;

  studentDetailCard.style.transform = "perspective(1000px) scale(0.95) translateY(10px)";
  studentDetailCard.style.opacity = "0.5";

  setTimeout(() => {
    try {
      detailStudentName.textContent = data.name || "";
      detailStudentId.textContent = data.student_id || "";
      detailStudentRole.textContent = data.role || "";
      detailStudentRole.className = `badge ${data.roleClass || ""}`;
      studentDetailCard.className = `chubby-card student-detail-card effect-3d active ${data.accentClass || ""}`;

      const parentContainer = document.querySelector(".detail-avatar-container");
      if (parentContainer) {
        parentContainer.innerHTML = "";
        if (data.isImgPath || data.is_img_path) {
          const img = document.createElement("img");
          img.src = data.img || "";
          img.alt = data.name || "";
          img.id = "detailStudentImg";
          parentContainer.appendChild(img);
        } else {
          const fallbackDiv = document.createElement("div");
          fallbackDiv.className = `avatar-fallback ${getRandomGradientClass(studentKey)}`;
          fallbackDiv.textContent = data.img || "";
          fallbackDiv.style.width = "100%";
          fallbackDiv.style.height = "100%";
          fallbackDiv.style.borderRadius = "14px";
          fallbackDiv.style.display = "flex";
          fallbackDiv.style.alignItems = "center";
          fallbackDiv.style.justifyContent = "center";
          fallbackDiv.style.fontSize = "1.8rem";
          fallbackDiv.style.color = "white";
          fallbackDiv.style.fontWeight = "800";
          fallbackDiv.id = "detailStudentImg";
          parentContainer.appendChild(fallbackDiv);
        }
      }

      if (parentNameEl) parentNameEl.textContent = data.parentName || data.parent_name || "";
      if (parentPhoneEl) parentPhoneEl.textContent = `📞 ${data.parentPhone || data.parent_phone || ""}`;
      
      const callBtn = document.querySelector(".contact-icon-btn.call");
      const emailBtn = document.querySelector(".contact-icon-btn.email");
      if (callBtn) callBtn.href = `tel:${(data.parentPhone || data.parent_phone || "").replace(/\s+/g, "")}`;
      if (emailBtn) emailBtn.href = `mailto:${data.parentEmail || data.parent_email || ""}`;

      // Map technical and medical data fields
      const cedulaEl = document.getElementById("detailStudentCedula");
      const ageEl = document.getElementById("detailStudentAge");
      const birthYearEl = document.getElementById("detailStudentBirthYear");
      const bloodTypeEl = document.getElementById("detailStudentBloodType");
      const statusEl = document.getElementById("detailStudentStatus");
      const addressEl = document.getElementById("detailStudentAddress");
      const medicalEl = document.getElementById("detailStudentMedicalConditions");
      const tutor2NameEl = document.getElementById("detailStudentTutor2Name");
      const tutor2PhoneEl = document.getElementById("detailStudentTutor2Phone");

      if (cedulaEl) cedulaEl.textContent = data.cedula || "-";
      if (ageEl) ageEl.textContent = data.age || "-";
      if (birthYearEl) birthYearEl.textContent = data.birth_year || "-";
      if (bloodTypeEl) bloodTypeEl.textContent = data.blood_type || "-";
      if (statusEl) statusEl.textContent = data.status || "Nuevo";
      if (addressEl) addressEl.textContent = data.address || "-";
      if (medicalEl) medicalEl.textContent = data.medical_conditions || "-";
      if (tutor2NameEl) tutor2NameEl.textContent = data.tutor2_name || "-";
      if (tutor2PhoneEl) tutor2PhoneEl.textContent = data.tutor2_phone || "-";

      const attendanceEl = document.getElementById("detailStudentAttendance");
      if (attendanceEl) {
        const isPresent = data.attendance !== false;
        attendanceEl.textContent = isPresent ? "Presente" : "Ausente";
        attendanceEl.style.color = isPresent ? "var(--color-lime)" : "var(--text-sub)";
      }

      if (conductDescription) conductDescription.textContent = data.conductText || data.conduct_text || "";
      
      if (emojiBtns) {
        emojiBtns.forEach(btn => {
          if (btn.getAttribute("data-conduct") === data.conduct) {
            btn.classList.add("active");
          } else {
            btn.classList.remove("active");
          }
        });
      }

      // Render numeric grades table by subject (Combine all subjects from all teachers of this grade)
      const gradesContainer = document.getElementById("gradesTableContainer");
      if (gradesContainer) {
        const studentGrade = data.grade || "2B";
        const teachersForGrade = Object.values(teachersData || {}).filter(t => t && t.assigned_grade === studentGrade);
        const subjects = [];
        teachersForGrade.forEach(t => {
          if (t && t.subjects) {
            t.subjects.forEach(s => {
              if (!subjects.includes(s)) subjects.push(s);
            });
          }
        });
        if (subjects.length === 0) {
          subjects.push("Ciencias Naturales", "Física");
        }


        let totalSumOfAvgs = 0;
        let subjectCount = 0;

        const gradeColor = (n) => {
          const v = parseFloat(n);
          if (v >= 4.5) return "grade-chip grade-high";
          if (v >= 3.0) return "grade-chip grade-mid";
          return "grade-chip grade-low";
        };

        const adviser = Object.values(teachersData || {}).find(t => t && t.assigned_grade === studentGrade);
        const activeTrimester = adviser ? adviser.active_trimester || 1 : 1;

        const rows = subjects.map((subj, i) => {
          let storedGrades = [];
          const subjectKey = `${subj}_T${activeTrimester}`;
          if (data.subject_grades && data.subject_grades[subjectKey]) {
            storedGrades = data.subject_grades[subjectKey];
          } else {
            const storedGradesRaw = localStorage.getItem(`eduStudentGradesJSON_${studentKey}_${subjectKey}`);
            if (storedGradesRaw) {
              try {
                storedGrades = JSON.parse(storedGradesRaw);
              } catch(e) {}
            }
          }

          let activityStr = "";
          if (Array.isArray(storedGrades) && storedGrades.filter(Boolean).length > 0) {
            activityStr = `<span style="font-size: 0.72rem; color: var(--text-secondary); margin-left: 6px; font-weight: normal;">(${storedGrades.filter(Boolean).join(", ")})</span>`;
          }

          let val = 0.0;
          if (Array.isArray(storedGrades) && storedGrades.filter(Boolean).length > 0) {
            const activeGradesNums = storedGrades.filter(Boolean).map(Number);
            val = activeGradesNums.reduce((a, b) => a + b, 0) / activeGradesNums.length;
          }
          
          const valFormatted = val.toFixed(1);
          totalSumOfAvgs += val;
          subjectCount++;

          return `<div class="grade-subject-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="grade-subject-name" style="font-weight: 800; font-size: 0.82rem;">${subj}${activityStr}</span>
            <span class="${gradeColor(valFormatted)}">${valFormatted}</span>
          </div>`;
        }).join("");

        const finalTrimesterAvg = subjectCount > 0 ? (totalSumOfAvgs / subjectCount).toFixed(1) : "0.0";
        const trimesterName = activeTrimester === 1 ? "1er Trimestre" : activeTrimester === 2 ? "2do Trimestre" : "3er Trimestre";

        const trimesterLabels = ["Trimestre 1", "Trimestre 2", "Trimestre 3"];
        const periodCols = trimesterLabels.map((p, i) => {
          let val = 0.0;
          if (data.grades && data.grades[i] !== undefined) {
            val = parseFloat(data.grades[i]);
          }
          const isActive = (i + 1) === activeTrimester;
          const valFormatted = val.toFixed(1);
          return `<div class="grade-period-col" style="${isActive ? 'border: 2px solid var(--color-cyan); border-radius: 8px; padding: 2px 4px;' : ''}">
            <span class="grade-period-label">${p}${isActive ? ' ✏️' : ''}</span>
            <span class="${gradeColor(valFormatted)}">${valFormatted}</span>
          </div>`;
        }).join("");

        gradesContainer.innerHTML = `
          <div style="font-size: 0.72rem; color: var(--text-sub); font-weight: 700; margin-bottom: 6px; padding: 3px 8px; background: rgba(0,200,255,0.07); border-radius: 6px; display: inline-block;">📅 ${trimesterName}</div>
          <div class="grades-by-subject">${rows}</div>
          <div class="grades-periods-row">
            <span class="grade-periods-title">Por Trimestre</span>
            <div class="grade-period-cols">${periodCols}</div>
          </div>
          <div class="grades-avg-row">
            <span>Promedio General ${trimesterName}</span>
            <span class="${gradeColor(finalTrimesterAvg)} grade-avg-chip">${finalTrimesterAvg}</span>
          </div>
          <button class="chubby-btn secondary siace-sync-btn full-width" data-student-id="${studentKey}" style="height: 36px; font-size: 0.78rem; display: flex; justify-content: center; align-items: center; margin-top: 10px; background-color: var(--color-purple); color: white; border-color: var(--color-purple);">
            <span>⚡ Sincronizar SIACE (MEDUCA)</span>
          </button>`;

        const adminSiaceBtn = gradesContainer.querySelector(".siace-sync-btn");
        if (adminSiaceBtn) {
          adminSiaceBtn.addEventListener("click", () => {
            openSiaceSyncModal(studentKey);
          });
        }
      }

      // Render Incidents in Admin
      const adminIncidentsFeed = document.getElementById("adminStudentIncidentsFeed");
      if (adminIncidentsFeed) {
        adminIncidentsFeed.innerHTML = "";
        let incidents = [];
        try {
          if (data.incidents) {
            incidents = data.incidents;
          } else {
            const stored = localStorage.getItem(`eduStudentIncidents_${studentKey}`);
            if (stored) incidents = JSON.parse(stored);
          }
        } catch(e) {}

        if (incidents.length === 0) {
          adminIncidentsFeed.innerHTML = `<p style="font-style: italic; font-size: 0.78rem; color: var(--text-secondary); text-align: center; margin: 10px 0;">Sin incidencias registradas por el docente.</p>`;
        } else {
          [...incidents].reverse().forEach(inc => {
            const item = document.createElement("div");
            item.className = "incident-item";
            item.innerHTML = `
              <div class="incident-header">
                <span>📅 ${escapeHTML(inc.date)}</span>
                <span>${escapeHTML(inc.time)}</span>
              </div>
              <div style="color: var(--text-main); font-weight: bold; overflow-wrap: break-word;">${escapeHTML(inc.text)}</div>
            `;
            adminIncidentsFeed.appendChild(item);
          });
        }
      }

      // Render Novelties in Admin
      const adminNoveltiesReport = document.getElementById("adminStudentNoveltiesReport");
      if (adminNoveltiesReport) {
        adminNoveltiesReport.innerHTML = "";
        let report = null;
        try {
          if (data.noveltyReport) {
            report = data.noveltyReport;
          } else {
            const stored = localStorage.getItem(`eduStudentNovedades_${studentKey}`);
            if (stored) report = JSON.parse(stored);
          }
        } catch(e) {}

        if (!report || (!report.detail && (!report.flags || report.flags.length === 0))) {
          adminNoveltiesReport.innerHTML = `<p style="font-style: italic; font-size: 0.78rem; color: var(--text-secondary); text-align: center; margin: 0;">Sin novedades registradas por el docente.</p>`;
        } else {
          let flagsHtml = "";
          if (report.flags && report.flags.length > 0) {
            flagsHtml = `<div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
              ${report.flags.map(f => `<span style="font-size: 0.72rem; font-weight: bold; background: var(--card-bg); border: 1px solid var(--text-main); border-radius: 6px; padding: 2px 6px;">${escapeHTML(f)}</span>`).join("")}
            </div>`;
          }
          const descHtml = report.detail 
            ? `<div style="font-weight: 500; color: var(--text-main); white-space: pre-wrap;">${escapeHTML(report.detail)}</div>`
            : `<div style="font-style: italic; opacity: 0.6; font-size: 0.78rem;">Sin comentarios adicionales.</div>`;

          adminNoveltiesReport.innerHTML = `
            ${flagsHtml}
            ${descHtml}
          `;
        }
      }

      loadChatMessagesFromSupabase(studentKey);
    } catch(err) {
      console.error("Error al actualizar la ficha del estudiante:", err);
    } finally {
      studentDetailCard.style.transform = "perspective(1000px) scale(1) translateY(0)";
      studentDetailCard.style.opacity = "1";
    }
  }, 250);
}

function getRandomGradientClass(studentKey) {
  if (studentKey === "sofia") return "gradient-purple";
  if (studentKey === "mateo") return "gradient-orange";
  return "gradient-blue";
}

async function sendMessage() {
  const text = chatInputField.value.trim();
  if (!text) return;

  if (adminActiveChatType === "staff") {
    const myId = getCurrentUserId();
    const partnerId = activeAdminChatPartner;
    if (!partnerId) return;

    const msgPayload = {
      sender: myId,
      receiver: partnerId,
      content: text,
      created_at: new Date().toISOString()
    };

    chatInputField.value = "";

    if (useSupabaseDb && supabaseClient) {
      try {
        const { error } = await supabaseClient.from('staff_messages').insert([msgPayload]);
        if (error) {
          console.error("Error al guardar mensaje de personal en Supabase:", error);
          showToast("Error de conexión al guardar mensaje", "❌");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      let list = [];
      try {
        const stored = localStorage.getItem("eduStaffMessages");
        if (stored) list = JSON.parse(stored);
      } catch(e) {}
      list.push(msgPayload);
      localStorage.setItem("eduStaffMessages", JSON.stringify(list));
      appendMessageToArea(msgPayload, chatArea, true);
    }
  } else {
    const senderName = activeAdminUser ? `Prof. ${activeAdminUser.name}` : "Prof. Egnis Cano";
    const msgPayload = {
      sender: senderName,
      content: text,
      is_sent_by_prof: true,
      student_key: activeStudent,
      created_at: new Date().toISOString()
    };

    chatInputField.value = "";

    if (useSupabaseDb && supabaseClient) {
      try {
        const { error } = await supabaseClient.from('chat_messages').insert([msgPayload]);
        if (error) {
          console.error("Error al guardar mensaje en Supabase:", error);
          showToast("Error de conexión al guardar mensaje", "❌");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      if (!mockMessages[activeStudent]) {
        mockMessages[activeStudent] = [];
      }
      mockMessages[activeStudent].push(msgPayload);
      appendMessageToArea(msgPayload, chatArea, false);

      // Simulación de respuesta tras 1.5s
      setTimeout(async () => {
        const data = studentsData[activeStudent];
        if (!data) return;
        const responses = [
          `¡Entendido Profesor! Muchas gracias por el aviso. Estaré al pendiente.`,
          `Buenas tardes profesor. Sí, perfecto. Revisaremos la materia juntos hoy por la tarde.`,
          `Excelente, agradezco mucho su dedicación y comunicación directa con la familia.`,
          `Hola. Perfecto, me conectaré a la reunión de padres de la próxima semana.`
        ];
        const randomReplyText = responses[Math.floor(Math.random() * responses.length)];

        const replyPayload = {
          sender: data.parentName,
          content: randomReplyText,
          is_sent_by_prof: false,
          student_key: activeStudent,
          created_at: new Date().toISOString()
        };

        if (useSupabaseDb) {
          try {
            await supabaseClient.from('chat_messages').insert([replyPayload]);
          } catch (err) {
            console.warn("Fallo al escribir respuesta automatizada:", err);
          }
        } else {
          mockMessages[activeStudent].push(replyPayload);
          if (activeStudent === data.id && adminActiveChatType === "tutor") {
            appendMessageToArea(replyPayload, chatArea, false);
            showToast("Mensaje entrante del tutor", "💬");
          }
        }
      }, 1500);
    }
  }
}

async function dispenseBudget() {
  if (budgetFece <= 500) {
    showToast("Presupuesto insuficiente en FECE", "⚠️");
    return;
  }

  budgetFece -= 500;
  pettyCash += 500;

  if (useSupabaseDb) {
    try {
      const { error } = await supabaseClient
        .from('finances')
        .update({ budget_fece: budgetFece, petty_cash: pettyCash })
        .eq('id', 1);

      if (error) {
        console.warn("Fallo al actualizar finanzas:", error);
        showToast("Actualización local (Error Supabase)", "⚠️");
      } else {
        showToast("Base de datos Supabase Sincronizada", "⚡");
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    showToast("Fondos FECE dispensados localmente", "💸");
  }

  updateFinanceUI();
}

async function updateConductScore(conductKey) {
  const data = studentsData[activeStudent];
  
  let feedback = "";
  if (conductKey === "excelente") feedback = `${data.name.split(" ")[0]} muestra un desempeño e interés brillante en clases.`;
  if (conductKey === "participativo") feedback = `${data.name.split(" ")[0]} se involucra de manera activa y proactiva en debates.`;
  if (conductKey === "enfocado") feedback = `${data.name.split(" ")[0]} mantiene altos niveles de concentración durante toda la sesión.`;
  if (conductKey === "conversador") feedback = `${data.name.split(" ")[0]} suele platicar en momentos no indicados, interrumpiendo el flujo.`;

  conductDescription.textContent = feedback;
  data.conduct = conductKey;
  data.conductText = feedback;

  if (useSupabaseDb) {
    try {
      await supabaseClient
        .from('students')
        .update({ conduct: conductKey, conduct_text: feedback })
        .eq('id', activeStudent);
    } catch (err) {
      console.warn("Fallo al guardar conducta:", err);
    }
  }

  showToast("Comportamiento actualizado", "🎭");
}

// Helpers
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function showToast(message, icon = "✦") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("removing");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// ==========================================================================
// 8. SQL MODAL DIALOGS
// ==========================================================================

async function loadAndShowSqlModal() {
  sqlModal.classList.remove("hidden");
  try {
    const res = await fetch('setup.sql');
    if (res.ok) {
      const codeText = await res.text();
      sqlCodeEl.textContent = codeText;
    } else {
      sqlCodeEl.textContent = "-- Error al cargar setup.sql desde el servidor.";
    }
  } catch (err) {
    sqlCodeEl.textContent = "-- Excepción al cargar setup.sql.";
  }
}

function closeSqlModal() {
  sqlModal.classList.add("hidden");
}

function copySqlToClipboard() {
  const code = sqlCodeEl.textContent;
  navigator.clipboard.writeText(code).then(() => {
    showToast("Script SQL copiado al portapapeles", "📋");
  }).catch(err => {
    showToast("Error al copiar código", "❌");
  });
}

// ==========================================================================
// 9. EVENT BINDINGS & LISTENERS
// ==========================================================================

// Drawer open/close toggles
// Dropdown menu toggle and handling
if (adminDropdownMenuBtn && adminDropdownMenu) {
  adminDropdownMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isHidden = adminDropdownMenu.classList.toggle("hidden");
    const chevron = adminDropdownMenuBtn.querySelector(".chevron");
    if (chevron) {
      chevron.style.transform = isHidden ? "rotate(0deg)" : "rotate(180deg)";
    }
  });

  document.addEventListener("click", (e) => {
    if (!adminDropdownMenuBtn.contains(e.target) && !adminDropdownMenu.contains(e.target)) {
      adminDropdownMenu.classList.add("hidden");
      const chevron = adminDropdownMenuBtn.querySelector(".chevron");
      if (chevron) {
        chevron.style.transform = "rotate(0deg)";
      }
    }
  });

  adminDropdownMenu.querySelectorAll(".admin-dropdown-item").forEach(item => {
    item.addEventListener("click", () => {
      adminDropdownMenu.classList.add("hidden");
      const chevron = adminDropdownMenuBtn.querySelector(".chevron");
      if (chevron) {
        chevron.style.transform = "rotate(0deg)";
      }
    });
  });
}

// Drawer open/close toggles
if (adminSettingsPanelToggle) {
  adminSettingsPanelToggle.addEventListener("click", () => {
    // Close other drawers if open
    if (teachersDrawer && !teachersDrawer.classList.contains("hidden")) {
      teachersDrawer.classList.remove("open");
      teachersDrawer.classList.add("hidden");
    }
    if (studentsDrawer && !studentsDrawer.classList.contains("hidden")) {
      studentsDrawer.classList.remove("open");
      studentsDrawer.classList.add("hidden");
    }
    if (financeDrawer && !financeDrawer.classList.contains("hidden")) {
      financeDrawer.classList.remove("open");
      financeDrawer.classList.add("hidden");
    }

    const isOpen = settingsDrawer.classList.toggle("hidden");
    if (!isOpen) {
      setTimeout(() => {
        settingsDrawer.classList.add("open");
        document.body.classList.add("drawer-open");
      }, 50);
    } else {
      settingsDrawer.classList.remove("open");
      document.body.classList.remove("drawer-open");
    }
  });
}

if (closeSettingsDrawerBtn) {
  closeSettingsDrawerBtn.addEventListener("click", () => {
    settingsDrawer.classList.remove("open");
    document.body.classList.remove("drawer-open");
    setTimeout(() => {
      settingsDrawer.classList.add("hidden");
    }, 500);
  });
}

// Settings Drawer tabs navigation
if (btnSchoolDetailsTab && btnCreateUserTab && btnUsersListTab && tabSchoolDetails && tabCreateUser && tabUsersList) {
  btnSchoolDetailsTab.addEventListener("click", () => {
    btnSchoolDetailsTab.classList.add("active");
    btnCreateUserTab.classList.remove("active");
    btnUsersListTab.classList.remove("active");
    tabSchoolDetails.classList.add("active");
    tabCreateUser.classList.remove("active");
    tabUsersList.classList.remove("active");
  });

  btnCreateUserTab.addEventListener("click", () => {
    btnCreateUserTab.classList.add("active");
    btnSchoolDetailsTab.classList.remove("active");
    btnUsersListTab.classList.remove("active");
    tabCreateUser.classList.add("active");
    tabSchoolDetails.classList.remove("active");
    tabUsersList.classList.remove("active");
  });

  btnUsersListTab.addEventListener("click", () => {
    btnUsersListTab.classList.add("active");
    btnSchoolDetailsTab.classList.remove("active");
    btnCreateUserTab.classList.remove("active");
    tabUsersList.classList.add("active");
    tabSchoolDetails.classList.remove("active");
    tabCreateUser.classList.remove("active");
    renderCreatedUsersList();
  });
}

teacherPanelToggle.addEventListener("click", () => {
  // Close student drawer if open
  if (studentsDrawer && !studentsDrawer.classList.contains("hidden")) {
    studentsDrawer.classList.remove("open");
    studentsDrawer.classList.add("hidden");
  }
  // Close settings drawer if open
  if (settingsDrawer && !settingsDrawer.classList.contains("hidden")) {
    settingsDrawer.classList.remove("open");
    settingsDrawer.classList.add("hidden");
  }
  // Close finance drawer if open
  if (financeDrawer && !financeDrawer.classList.contains("hidden")) {
    financeDrawer.classList.remove("open");
    financeDrawer.classList.add("hidden");
  }

  const isOpen = teachersDrawer.classList.toggle("hidden");
  if (!isOpen) {
    // If opening, force layout draw and active slide classes
    setTimeout(() => {
      teachersDrawer.classList.add("open");
      document.body.classList.add("drawer-open");
    }, 50);
  } else {
    teachersDrawer.classList.remove("open");
    document.body.classList.remove("drawer-open");
  }
});

closeDrawerBtn.addEventListener("click", () => {
  teachersDrawer.classList.remove("open");
  document.body.classList.remove("drawer-open");
  setTimeout(() => {
    teachersDrawer.classList.add("hidden");
  }, 500);
});

// Drawer tabs navigation
btnListTab.addEventListener("click", () => {
  btnListTab.classList.add("active");
  btnFormTab.classList.remove("active");
  tabTeachersList.classList.add("active");
  tabAddTeacher.classList.remove("active");
});

btnFormTab.addEventListener("click", () => {
  btnFormTab.classList.add("active");
  btnListTab.classList.remove("active");
  tabAddTeacher.classList.add("active");
  tabTeachersList.classList.remove("active");
});

// Student Drawer open/close toggles
studentPanelToggle.addEventListener("click", () => {
  // Close admin dropdown if open
  if (adminDropdownMenu && !adminDropdownMenu.classList.contains("hidden")) {
    adminDropdownMenu.classList.add("hidden");
    const chevron = adminDropdownMenuBtn.querySelector(".chevron");
    if (chevron) {
      chevron.style.transform = "rotate(0deg)";
    }
  }
  // Close teacher drawer if open
  if (teachersDrawer && !teachersDrawer.classList.contains("hidden")) {
    teachersDrawer.classList.remove("open");
    teachersDrawer.classList.add("hidden");
  }
  // Close settings drawer if open
  if (settingsDrawer && !settingsDrawer.classList.contains("hidden")) {
    settingsDrawer.classList.remove("open");
    settingsDrawer.classList.add("hidden");
  }
  // Close finance drawer if open
  if (financeDrawer && !financeDrawer.classList.contains("hidden")) {
    financeDrawer.classList.remove("open");
    financeDrawer.classList.add("hidden");
  }

  const isOpen = studentsDrawer.classList.toggle("hidden");
  if (!isOpen) {
    renderStudentsList();
    setTimeout(() => {
      studentsDrawer.classList.add("open");
      document.body.classList.add("drawer-open");
    }, 50);
  } else {
    studentsDrawer.classList.remove("open");
    document.body.classList.remove("drawer-open");
  }
});

closeStudentsDrawerBtn.addEventListener("click", () => {
  studentsDrawer.classList.remove("open");
  document.body.classList.remove("drawer-open");
  resetStudentFormEditMode();
  setTimeout(() => {
    studentsDrawer.classList.add("hidden");
  }, 500);
});

// Finance Drawer open/close toggles
if (financePanelToggle && financeDrawer) {
  financePanelToggle.addEventListener("click", () => {
    // Close other drawers if open
    if (teachersDrawer && !teachersDrawer.classList.contains("hidden")) {
      teachersDrawer.classList.remove("open");
      teachersDrawer.classList.add("hidden");
    }
    if (studentsDrawer && !studentsDrawer.classList.contains("hidden")) {
      studentsDrawer.classList.remove("open");
      studentsDrawer.classList.add("hidden");
    }
    if (settingsDrawer && !settingsDrawer.classList.contains("hidden")) {
      settingsDrawer.classList.remove("open");
      settingsDrawer.classList.add("hidden");
    }

    const isOpen = financeDrawer.classList.toggle("hidden");
    if (!isOpen) {
      setTimeout(() => {
        financeDrawer.classList.add("open");
        document.body.classList.add("drawer-open");
      }, 50);
    } else {
      financeDrawer.classList.remove("open");
      document.body.classList.remove("drawer-open");
    }
  });
}

if (closeFinanceDrawerBtn && financeDrawer) {
  closeFinanceDrawerBtn.addEventListener("click", () => {
    financeDrawer.classList.remove("open");
    document.body.classList.remove("drawer-open");
    setTimeout(() => {
      financeDrawer.classList.add("hidden");
    }, 500);
  });
}

// Reset and open modal helper functions for Admin Edit Student Mode
function resetStudentFormEditMode() {
  editingStudentId = null;
  const form = document.getElementById("addStudentForm");
  if (form) form.reset();
  const submitBtnText = document.querySelector("#addStudentForm button[type='submit'] span");
  if (submitBtnText) {
    submitBtnText.textContent = "💾 Registrar Estudiante";
  }
  if (btnStudentFormTab) btnStudentFormTab.textContent = "+ Registrar";
  const preview = document.getElementById("studentPhotoPreview");
  if (preview) preview.innerHTML = "<span>Subir Foto (PNG/JPG)</span>";
  registeredStudentPhotoDataUrl = "";
}

function openAdminEditStudentModal(studentId) {
  const student = studentsData[studentId];
  if (!student) return;

  editingStudentId = studentId;
  
  // Populate form
  const nameInput = document.getElementById("regStudentName");
  const cedulaInput = document.getElementById("regStudentCedula");
  const gradeSelect = document.getElementById("regStudentGrade");
  const ageInput = document.getElementById("regStudentAge");
  const birthYearInput = document.getElementById("regStudentBirthYear");
  const bloodTypeInput = document.getElementById("regStudentBloodType");
  const statusSelect = document.getElementById("regStudentStatus");
  const addressInput = document.getElementById("regStudentAddress");
  const medicalConditionsInput = document.getElementById("regStudentMedicalConditions");
  const parentNameInput = document.getElementById("regStudentParentName");
  const parentPhoneInput = document.getElementById("regStudentParentPhone");
  const tutor2NameInput = document.getElementById("regStudentTutor2Name");
  const tutor2PhoneInput = document.getElementById("regStudentTutor2Phone");
  const parentEmailInput = document.getElementById("regStudentParentEmail");

  if (nameInput) nameInput.value = student.name || "";
  if (cedulaInput) cedulaInput.value = student.cedula || "";
  if (gradeSelect) gradeSelect.value = student.grade || "2B";
  if (ageInput) ageInput.value = student.age || "";
  if (birthYearInput) birthYearInput.value = student.birth_year || "";
  if (bloodTypeInput) bloodTypeInput.value = student.blood_type || "";
  if (statusSelect) statusSelect.value = student.status || "Nuevo";
  if (addressInput) addressInput.value = student.address || "";
  if (medicalConditionsInput) medicalConditionsInput.value = student.medical_conditions || "";
  
  if (parentNameInput) parentNameInput.value = student.parentName || student.parent_name || "";
  if (parentPhoneInput) parentPhoneInput.value = student.parentPhone || student.parent_phone || "";
  if (tutor2NameInput) tutor2NameInput.value = student.tutor2_name || "";
  if (tutor2PhoneInput) tutor2PhoneInput.value = student.tutor2_phone || "";
  if (parentEmailInput) parentEmailInput.value = student.parentEmail || student.parent_email || "";

  // Preview photo
  const preview = document.getElementById("studentPhotoPreview");
  if (preview) {
    if (student.img) {
      if (student.isImgPath || student.is_img_path) {
        preview.innerHTML = `<img src="${student.img}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">`;
      } else {
        preview.innerHTML = `<div class="avatar-fallback" style="width:100%; height:100%; display:flex; justify-content:center; align-items:center; background:var(--accent-lime); color:white; font-size:1.2rem; font-weight:bold; border-radius:12px;">${student.img}</div>`;
      }
    } else {
      preview.innerHTML = "<span>Subir Foto (PNG/JPG)</span>";
    }
  }

  // Change UI texts
  const submitBtnText = document.querySelector("#addStudentForm button[type='submit'] span");
  if (submitBtnText) {
    submitBtnText.textContent = "💾 Guardar Cambios";
  }
  if (btnStudentFormTab) btnStudentFormTab.textContent = "✏️ Editar Datos";

  // Open drawer if hidden
  if (studentsDrawer && studentsDrawer.classList.contains("hidden")) {
    studentsDrawer.classList.remove("hidden");
    setTimeout(() => {
      studentsDrawer.classList.add("open");
      document.body.classList.add("drawer-open");
    }, 50);
  }

  // Swap to the form tab
  if (btnStudentFormTab && btnStudentListTab && tabAddStudent && tabStudentsList) {
    btnStudentFormTab.classList.add("active");
    btnStudentListTab.classList.remove("active");
    tabAddStudent.classList.add("active");
    tabStudentsList.classList.remove("active");
  }
}

// Student Drawer tabs navigation
btnStudentListTab.addEventListener("click", () => {
  resetStudentFormEditMode();
  btnStudentListTab.classList.add("active");
  btnStudentFormTab.classList.remove("active");
  tabStudentsList.classList.add("active");
  tabAddStudent.classList.remove("active");
  renderStudentsList();
});

btnStudentFormTab.addEventListener("click", () => {
  btnStudentFormTab.classList.add("active");
  btnStudentListTab.classList.remove("active");
  tabAddStudent.classList.add("active");
  tabStudentsList.classList.remove("active");
});

const adminEditStudentBtn = document.getElementById("adminEditStudentBtn");
if (adminEditStudentBtn) {
  adminEditStudentBtn.addEventListener("click", () => {
    if (activeStudent) {
      openAdminEditStudentModal(activeStudent);
    } else {
      showToast("Selecciona un estudiante para editar", "⚠️");
    }
  });
}

// Photo preview helper function
function handlePhotoPreview(inputEl, previewEl) {
  inputEl.addEventListener("change", () => {
    const file = inputEl.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewEl.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">`;
      };
      reader.readAsDataURL(file);
    } else {
      previewEl.innerHTML = `<span>Subir Foto (PNG/JPG)</span>`;
    }
  });
}

// Bind previews
const regTeacherPhoto = document.getElementById("regTeacherPhoto");
const teacherPhotoPreview = document.getElementById("teacherPhotoPreview");
if (regTeacherPhoto && teacherPhotoPreview) {
  handlePhotoPreview(regTeacherPhoto, teacherPhotoPreview);
}

const regStudentPhoto = document.getElementById("regStudentPhoto");
const studentPhotoPreview = document.getElementById("studentPhotoPreview");
if (regStudentPhoto && studentPhotoPreview) {
  regStudentPhoto.addEventListener("change", () => {
    const file = regStudentPhoto.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        studentPhotoPreview.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">`;
        registeredStudentPhotoDataUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      studentPhotoPreview.innerHTML = `<span>Subir Foto (PNG/JPG)</span>`;
      registeredStudentPhotoDataUrl = "";
    }
  });
}

// Submit forms
addTeacherForm.addEventListener("submit", handleRegisterTeacher);
addStudentForm.addEventListener("submit", handleRegisterStudent);

// Emoji conduct buttons
emojiBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    showToast("La conducta es evaluada y modificada únicamente por el docente en su credencial.", "⚠️");
  });
});

// Chat handlers
chatSendBtn.addEventListener("click", sendMessage);
chatInputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

const adminChatAttachBtn = document.getElementById("adminChatAttachBtn");
const adminChatFileInput = document.getElementById("adminChatFileInput");
if (adminChatAttachBtn && adminChatFileInput) {
  adminChatAttachBtn.addEventListener("click", () => {
    adminChatFileInput.click();
  });
  adminChatFileInput.addEventListener("change", handleAdminChatFileSelection);
}
triggerDirectChat.addEventListener("click", () => {
  const data = studentsData[activeStudent];
  chatInputField.value = `Estimado ${data.parentName.split(" ")[0]}, ¿podríamos agendar una videollamada corta?`;
  chatInputField.focus();
});

// Theme switcher
themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  document.body.classList.toggle("light-theme", !isDark);
  showToast(isDark ? "Modo oscuro activado" : "Modo claro activado", "🌓");
});


// Budget Dispense
if (btnDispense) btnDispense.addEventListener("click", dispenseBudget);
if (btnDrawerDispense) btnDrawerDispense.addEventListener("click", dispenseBudget);

// Modal SQL
openSqlModalBtn.addEventListener("click", loadAndShowSqlModal);
closeModalBtn.addEventListener("click", closeSqlModal);
sqlModal.addEventListener("click", (e) => {
  if (e.target === sqlModal) closeSqlModal();
});
copySqlBtn.addEventListener("click", copySqlToClipboard);

// ==========================================================================
// 10. LANDING PAGE VIEW TRANSITIONS & 3D PARALLAX EFFECT
// ==========================================================================

const pageWipe = document.getElementById("pageWipe");
const landingView = document.getElementById("landingView");
const dashboardView = document.getElementById("dashboardView");
const backToHomeBtn = document.getElementById("backToHomeBtn");
const themeToggleLanding = document.getElementById("themeToggleLanding");

// Transition handler between Landing and Dashboard
function triggerPageWipe(targetPage) {
  if (!pageWipe) return;
  pageWipe.classList.add("wipe-active");
  
  const teacherDashboardView = document.getElementById("teacherDashboardView");
  const parentDashboardView  = document.getElementById("parentDashboardView");
  
  // Swap screens halfway through (0.6s)
  setTimeout(() => {
    if (targetPage === "dashboard") {
      landingView.classList.add("hidden");
      if (teacherDashboardView) teacherDashboardView.classList.add("hidden");
      if (parentDashboardView) parentDashboardView.classList.add("hidden");
      dashboardView.classList.remove("hidden");
      document.body.classList.add("dashboard-mode");
      
      // Update and render all dashboard states to prevent desynchronizations
      renderStudentsList();
      renderLandingAulasList();
      renderLandingDocentesList();
      renderTeachersList();
      populateStudentGradeDropdown();
      if (activeTeacher) {
        switchActiveTeacher(activeTeacher);
      }

      // Recalculate SVG lines
      setTimeout(drawConnectionCurve, 150);
    } else if (targetPage === "teacher") {
      landingView.classList.add("hidden");
      dashboardView.classList.add("hidden");
      if (parentDashboardView) parentDashboardView.classList.add("hidden");
      if (teacherDashboardView) teacherDashboardView.classList.remove("hidden");
      document.body.classList.add("dashboard-mode");
    } else if (targetPage === "parent") {
      landingView.classList.add("hidden");
      dashboardView.classList.add("hidden");
      if (teacherDashboardView) teacherDashboardView.classList.add("hidden");
      if (parentDashboardView) parentDashboardView.classList.remove("hidden");
      document.body.classList.add("dashboard-mode");
    } else {
      dashboardView.classList.add("hidden");
      if (teacherDashboardView) teacherDashboardView.classList.add("hidden");
      if (parentDashboardView) parentDashboardView.classList.add("hidden");
      if (teacherDashboardView) teacherDashboardView.classList.add("hidden");
      landingView.classList.remove("hidden");
      document.body.classList.remove("dashboard-mode");
    }
  }, 600);

  // Clean up animation class (1.2s)
  setTimeout(() => {
    pageWipe.classList.remove("wipe-active");
  }, 1200);
}

// Bind Open Auth Modal buttons
document.querySelectorAll(".btn-open-auth").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const authSection = document.getElementById("authSection");
    if (authSection) {
      authSection.classList.add("active");
      document.body.style.overflow = "hidden"; // Lock page scroll
      
      const tabLogin = document.getElementById("tabLogin");
      if (tabLogin) tabLogin.click();
    }
  });
});

document.querySelectorAll(".btn-open-parent-auth").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const authSection = document.getElementById("authSection");
    if (authSection) {
      authSection.classList.add("active");
      document.body.style.overflow = "hidden"; // Lock page scroll
      
      // The switchToLogin logic is handled by a direct switchTab call in initAuthForms
      const pForm = document.getElementById("parentLoginForm");
      if (pForm) {
        // Trigger a global custom event or directly call the exposed switch mechanism, but since switchTab is scoped, we can click a hidden button or rely on the switchToStaffLogin
        const switchToStaffLoginBtn = document.getElementById("switchToStaffLogin");
        // Actually, we can just manually trigger the logic for parent since switchTab is inaccessible from here without a global reference.
        // Let's just expose a global function for auth switching
        if (window.switchAuthTabTo) {
          window.switchAuthTabTo("parent-login");
        }
      }
    }
  });
});

// Bind Close Auth Modal button and backdrop clicks
const authSection = document.getElementById("authSection");
const closeAuthBtn = document.getElementById("closeAuthBtn");
if (authSection) {
  authSection.addEventListener("click", (e) => {
    if (e.target === authSection) {
      authSection.classList.remove("active");
      document.body.style.overflow = ""; // Unlock page scroll
    }
  });
}
if (closeAuthBtn) {
  closeAuthBtn.addEventListener("click", () => {
    if (authSection) {
      authSection.classList.remove("active");
      document.body.style.overflow = ""; // Unlock page scroll
    }
  });
}

// Bind Back Home button
if (backToHomeBtn) {
  backToHomeBtn.addEventListener("click", () => {
    triggerPageWipe("landing");
  });
}

// Bind Landing Theme button
if (themeToggleLanding) {
  themeToggleLanding.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme", !isDark);
    showToast(isDark ? "Modo oscuro activado" : "Modo claro activado", "🌓");
  });
}

// Hero 3D Parallax Tilt Effect
const heroVisual = document.getElementById("heroVisual");
const container3D = document.querySelector(".visual-container-3d");

if (heroVisual && container3D) {
  heroVisual.addEventListener("mousemove", (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -((y - centerY) / centerY) * 15; // rotate X up to 15deg
    const rotateY = ((x - centerX) / centerX) * 15;  // rotate Y up to 15deg

    container3D.style.transform = `rotateX(${22 + rotateX}deg) rotateY(${-22 + rotateY}deg) rotateZ(5deg)`;
  });

  heroVisual.addEventListener("mouseleave", () => {
    container3D.style.transform = `rotateX(22deg) rotateY(-22deg) rotateZ(5deg)`;
  });
}

// Dynamically draw beautiful neon connecting S-curves between dashboard card components
function drawConnectionCurve() {
  const svg = document.getElementById("flowSvg");
  const path = document.getElementById("connectionPath");
  const pulse = document.getElementById("pulsePath");
  if (!svg || !path) return;

  // If mobile view stack or simulator is hidden, clear paths
  if (getComputedStyle(svg).display === "none" || svg.clientWidth === 0) {
    path.setAttribute("d", "");
    if (pulse) pulse.setAttribute("d", "");
    return;
  }

  const svgRect = svg.getBoundingClientRect();

  const teacherNode = document.getElementById("teacherNode");
  const activeRow = document.querySelector(".student-row.active");
  const detailCard = document.getElementById("studentDetailCard");
  const dbNode = document.getElementById("databaseNode");
  const financeNode = document.getElementById("financeNode");

  if (!teacherNode || !activeRow || !detailCard || !dbNode) {
    path.setAttribute("d", "");
    if (pulse) pulse.setAttribute("d", "");
    return;
  }

  // Segment 1: Teacher Node bottom center
  const teacherRect = teacherNode.getBoundingClientRect();
  const tX = teacherRect.left + teacherRect.width / 2 - svgRect.left;
  const tY = teacherRect.bottom - svgRect.top;

  // Active Student Row left and right edges
  const rowRect = activeRow.getBoundingClientRect();
  const sLeftX = rowRect.left - svgRect.left;
  const sLeftY = rowRect.top + rowRect.height / 2 - svgRect.top;
  const sRightX = rowRect.right - svgRect.left;
  const sRightY = rowRect.top + rowRect.height / 2 - svgRect.top;

  // Student Detail card left edge
  const detailRect = detailCard.getBoundingClientRect();
  const dLeftX = detailRect.left - svgRect.left;
  const dLeftY = detailRect.top + 80 - svgRect.top;

  // Path building
  // Curve 1: Teacher bottom center -> Student left center
  const c1 = `M ${tX} ${tY} C ${tX} ${tY + 30}, ${sLeftX - 30} ${sLeftY}, ${sLeftX} ${sLeftY}`;

  // Curve 2: Student right center -> Detail Card left center
  const c2 = ` M ${sRightX} ${sRightY} C ${sRightX + 40} ${sRightY}, ${dLeftX - 40} ${dLeftY}, ${dLeftX} ${dLeftY}`;

  // Curve 3: Database bottom center -> Finance left center (only draw if visible)
  let c3 = "";
  if (financeNode && getComputedStyle(financeNode).display !== "none") {
    // Database Node bottom center
    const dbRect = dbNode.getBoundingClientRect();
    const dbX = dbRect.left + dbRect.width / 2 - svgRect.left;
    const dbY = dbRect.bottom - svgRect.top;

    // Finance Node left edge
    const financeRect = financeNode.getBoundingClientRect();
    const fLeftX = financeRect.left - svgRect.left;
    const fLeftY = financeRect.top + financeRect.height / 3 - svgRect.top;

    c3 = ` M ${dbX} ${dbY} C ${dbX} ${dbY + 40}, ${fLeftX - 40} ${fLeftY}, ${fLeftX} ${fLeftY}`;
  }

  const fullPath = c1 + c2 + c3;
  path.setAttribute("d", fullPath);
  if (pulse) pulse.setAttribute("d", fullPath);
}

// Window Resize S-Curve recalcs
window.addEventListener("resize", drawConnectionCurve);

// DOM Load Init function
function initMainApp() {
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

  // Inicializar pestañas de chat dual
  initChatTabsListeners();

  setTimeout(() => {
    drawConnectionCurve();
  }, 400);

  initSupabaseConnection();
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initMainApp);
} else {
  initMainApp();
}

// ==========================================================================
// 11. LANDING PAGE — STATS COUNTER ANIMATION
// ==========================================================================

function animateCounter(el) {
  const target = parseInt(el.getAttribute("data-target"), 10);
  const duration = 1800;
  const startTime = performance.now();
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.floor(easeOut(progress) * target).toLocaleString("es-PA");
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString("es-PA");
  }
  requestAnimationFrame(tick);
}

const statsSection = document.querySelector(".stats-strip-section");
if (statsSection) {
  const counterEls = statsSection.querySelectorAll(".stat-counter-num");
  let countersStarted = false;
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      counterEls.forEach(el => animateCounter(el));
    }
  }, { threshold: 0.3 }).observe(statsSection);
}

// ==========================================================================
// 12. LANDING PAGE — AUTH TABS & FORM INTERACTIONS
// ==========================================================================

(function initAuthForms() {
  const tabLogin       = document.getElementById("tabLogin");
  const tabRegister    = document.getElementById("tabRegister");
  const loginForm      = document.getElementById("loginForm");
  const parentLoginForm= document.getElementById("parentLoginForm");
  const regForm        = document.getElementById("registerForm");
  if (!tabLogin || !tabRegister || !loginForm || !regForm) return;

  // ── Tab Switch ────────────────────────────────────────────────────────────
  function switchTab(activeTab) {
    tabLogin.classList.toggle("active", activeTab === "login");
    tabRegister.classList.toggle("active", activeTab === "register");
    
    const forms = [loginForm, parentLoginForm, regForm].filter(Boolean);
    const targetForm = activeTab === "login" ? loginForm : (activeTab === "parent-login" ? parentLoginForm : regForm);
    
    // Manage tabs container visibility
    const tabsContainer = document.querySelector(".auth-tabs");
    if (tabsContainer) {
      tabsContainer.style.display = activeTab === "parent-login" ? "none" : "flex";
    }
    
    forms.forEach(f => {
      if (f !== targetForm && !f.classList.contains("hidden")) {
        f.style.transition = "opacity 0.2s ease, transform 0.2s ease";
        f.style.opacity = "0";
        f.style.transform = "translateX(20px)";
        setTimeout(() => f.classList.add("hidden"), 220);
      }
    });

    setTimeout(() => {
      targetForm.classList.remove("hidden");
      targetForm.style.opacity = "0";
      targetForm.style.transform = "translateX(-20px)";
      requestAnimationFrame(() => {
        targetForm.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        targetForm.style.opacity = "1";
        targetForm.style.transform = "translateX(0)";
      });
    }, 220);
  }
  
  // Expose to window for external buttons
  window.switchAuthTabTo = switchTab;

  tabLogin.addEventListener("click", () => switchTab("login"));
  tabRegister.addEventListener("click", () => switchTab("register"));

  // ── Cross-links ───────────────────────────────────────────────────────────
  document.getElementById("switchToRegister")?.addEventListener("click", (e) => {
    e.preventDefault();
    switchTab("register");
  });

  document.getElementById("switchToLogin")?.addEventListener("click", (e) => {
    e.preventDefault();
    switchTab("login");
  });

  document.getElementById("switchToStaffLogin")?.addEventListener("click", (e) => {
    e.preventDefault();
    switchTab("login");
  });

  // ── Password Visibility ───────────────────────────────────────────────────
  function bindPwToggle(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const inp = document.getElementById(inputId);
    if (!btn || !inp) return;
    btn.addEventListener("click", () => {
      const hide = inp.type === "password";
      inp.type = hide ? "text" : "password";
      btn.textContent = hide ? "🙈" : "👁️";
    });
  }
  bindPwToggle("toggleLoginPw", "loginPassword");
  bindPwToggle("toggleRegPw",   "regPassword");

  // ── School Logo Upload Preview ────────────────────────────────────────────
  const schoolLogoInput   = document.getElementById("schoolLogoInput");
  const schoolLogoPreview = document.getElementById("schoolLogoPreview");
  if (schoolLogoInput && schoolLogoPreview) {
    schoolLogoInput.addEventListener("change", () => {
      const file = schoolLogoInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        schoolLogoPreview.innerHTML = `<img src="${e.target.result}" alt="Logo">`;
        registeredLogoDataUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // ── Login Submit ──────────────────────────────────────────────────────────
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email    = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;
    if (!email || !password) { showToast("Completa todos los campos", "⚠️"); return; }

    const btn = document.getElementById("loginSubmitBtn");
    btn.disabled = true;
    btn.innerHTML = `<span class="icon">⏳</span> Iniciando sesión...`;

    setTimeout(() => {
      // Check if user is a created user in localStorage
      let users = [];
      try {
        const storedUsers = localStorage.getItem("eduCreatedUsers");
        if (storedUsers) {
          const parsed = JSON.parse(storedUsers);
          if (Array.isArray(parsed)) {
            users = parsed;
          }
        }
      } catch (err) {
        console.error("Error al leer usuarios creados:", err);
      }

      // Always include default users if they are not already in the list
      const defaultUsers = [
        {
          name: "Lic. Ana Reyes",
          role: "secretaria",
          roleName: "📝 Secretaria",
          phone: "+507 6200-1111",
          email: "ana.reyes@escuela.edu"
        },
        {
          name: "Ing. Carlos Mendoza",
          role: "sub administrador",
          roleName: "🔑 Sub Administrador",
          phone: "+507 6200-2222",
          email: "carlos.mendoza@escuela.edu"
        }
      ];
      defaultUsers.forEach(defUser => {
        if (!users.some(u => u.email && u.email.toLowerCase() === defUser.email.toLowerCase())) {
          users.push(defUser);
        }
      });

      const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      };

      const storedAdminEmail = localStorage.getItem("eduAdminEmail");
      const storedAdminPassword = localStorage.getItem("eduAdminPassword");

      let matchedUser = null;
      if (storedAdminEmail && email.toLowerCase() === storedAdminEmail.toLowerCase()) {
        matchedUser = {
          name: localStorage.getItem("eduAdminName") || "Egnis Cano",
          role: "admin",
          roleName: "🔑 Administrador",
          email: storedAdminEmail,
          password: storedAdminPassword
        };
      } else {
        matchedUser = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
      }

      if (matchedUser) {
        // If password is stored and does not match, show error
        if (matchedUser.password && matchedUser.password !== password) {
          showToast("Contraseña incorrecta", "❌");
          btn.disabled = false;
          btn.innerHTML = `<span class="icon">🚀</span> Ingresar al Sistema`;
          return;
        }

        // Check if role is profesores
        if (matchedUser.role === "profesores") {
          // Find matching teacher key in teachersData
          let teacherKey = null;
          const normalizedUserName = removeAccents(matchedUser.name.toLowerCase().trim());
          for (const key in teachersData) {
            const teacher = teachersData[key];
            const normalizedTeacherName = removeAccents(teacher.name.toLowerCase().trim());
            const cleanUser = normalizedUserName.replace(/^(prof\.|profa\.|profesor\.|profesora\.)\s*/, '').trim();
            const cleanTeacher = normalizedTeacherName.replace(/^(prof\.|profa\.|profesor\.|profesora\.)\s*/, '').trim();
            if (cleanUser === cleanTeacher || cleanTeacher.includes(cleanUser) || cleanUser.includes(cleanTeacher)) {
              teacherKey = key;
              break;
            }
          }

          if (!teacherKey) {
            // Create default teacher profile in memory/local
            teacherKey = matchedUser.name.toLowerCase().replace(/[^a-z]/g, "").substring(0, 10) + Math.floor(Math.random()*100);
            teachersData[teacherKey] = {
              id: teacherKey,
              name: matchedUser.name,
              employee_id: "ED-MOCK",
              cedula: "N/A",
              profile_pic: matchedUser.name.replace(/^(prof\.|profa\.|profesor\.|profesora\.)\s*/i, '').split(" ").map(w => w[0]).join("").toUpperCase().substring(0, 2) || "MD",
              isImgPath: false,
              age: 30,
              specializations: ["Docente"],
              subjects: ["Ciencias Naturales", "Física"],
              assigned_grade: "3A"
            };
            try {
              localStorage.setItem("eduTeachersData", JSON.stringify(teachersData));
            } catch(ex) {}
          }

          activeTeacher = teacherKey;
          showToast("¡Bienvenido Docente! Ingresando al portal...", "👨‍🏫");
          
          setTimeout(() => {
            const authSection = document.getElementById("authSection");
            if (authSection) {
              authSection.classList.remove("active");
              document.body.style.overflow = ""; // Unlock scroll
            }
            initializeTeacherDashboard();
            triggerPageWipe("teacher");
          }, 800);

          btn.disabled = false;
          btn.innerHTML = `<span class="icon">🚀</span> Ingresar al Sistema`;
          return;
        }
      }

      // Default Admin or other roles login
      if (matchedUser) {
        activeAdminUser = matchedUser;
      } else {
        const storedName = localStorage.getItem("eduAdminName") || "Egnis Cano";
        activeAdminUser = { name: storedName, role: "admin", roleName: "🔑 Administrador" };
      }
      activeTeacher = null;

      showToast("¡Bienvenido! Ingresando al sistema...", "🚀");
      setTimeout(() => {
        const authSection = document.getElementById("authSection");
        if (authSection) {
          authSection.classList.remove("active");
          document.body.style.overflow = ""; // Unlock scroll
        }
        updateDashboardSchoolHeader();
        triggerPageWipe("dashboard");
      }, 800);
      btn.disabled = false;
      btn.innerHTML = `<span class="icon">🚀</span> Ingresar al Sistema`;
    }, 1200);
  });

  // ── Parent Login Submit ───────────────────────────────────────────────────
  if (parentLoginForm) {
    parentLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const parentName = document.getElementById("parentLoginName")?.value.trim().toLowerCase();
      const parentCedula = document.getElementById("parentLoginCedula")?.value.trim().toLowerCase();
      if (!parentName || !parentCedula) { showToast("Completa ambos campos", "⚠️"); return; }
      
      const btn = document.getElementById("parentLoginSubmitBtn");
      btn.disabled = true;
      btn.innerHTML = `<span class="icon">⏳</span> Validando datos...`;

      setTimeout(() => {
        let matchedStudentId = null;
        const removeAccents = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const cleanInputName = removeAccents(parentName);
        const cleanInputCedula = removeAccents(parentCedula);

        for (const key in studentsData) {
          const st = studentsData[key];
          const stName = removeAccents(st.name.toLowerCase());
          const stCedula = removeAccents((st.cedula || "").toLowerCase());
          
          if (stName === cleanInputName || stName.includes(cleanInputName)) {
            if (stCedula === cleanInputCedula || cleanInputCedula.includes(stCedula)) {
              matchedStudentId = key;
              break;
            }
          }
        }

        if (matchedStudentId) {
          showToast(`¡Bienvenido Acudiente de ${studentsData[matchedStudentId].name}!`, "👪");
          const authSection = document.getElementById("authSection");
          if (authSection) {
            authSection.classList.remove("active");
            document.body.style.overflow = "";
          }
          renderParentDashboard(matchedStudentId);
          triggerPageWipe("parent");
        } else {
          showToast("No se encontró ningún estudiante con esos datos", "❌");
        }
        btn.disabled = false;
        btn.innerHTML = `<span class="icon">👪</span> Ingresar al Portal`;
      }, 1000);
    });
  }

  // ── Register Submit ───────────────────────────────────────────────────────
  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const adminName  = document.getElementById("regAdminName")?.value.trim();
    const email      = document.getElementById("regEmail")?.value.trim();
    const phone      = document.getElementById("regPhone")?.value.trim();
    const schoolName = document.getElementById("regSchoolName")?.value.trim();
    const address    = document.getElementById("regAddress")?.value.trim();
    const pw         = document.getElementById("regPassword")?.value;
    const pwConfirm  = document.getElementById("regPasswordConfirm")?.value;

    if (!adminName || !email || !phone || !schoolName || !address || !pw || !pwConfirm) {
      showToast("Por favor completa todos los campos", "⚠️"); return;
    }
    if (pw.length < 8) { showToast("Contraseña mínimo 8 caracteres", "🔒"); return; }
    if (pw !== pwConfirm) { showToast("Las contraseñas no coinciden", "❌"); return; }

    const btn = document.getElementById("registerSubmitBtn");
    btn.disabled = true;
    btn.innerHTML = `<span class="icon">⏳</span> Creando institución...`;

    // Subir logo si fue provisto
    let schoolLogoUrl = "";
    const logoInput = document.getElementById("schoolLogoInput");
    if (logoInput && logoInput.files && logoInput.files[0]) {
      schoolLogoUrl = await uploadFileToBucket(logoInput.files[0], "school-assets", "logos");
    } else if (registeredLogoDataUrl) {
      schoolLogoUrl = registeredLogoDataUrl;
    }

    setTimeout(() => {
      // Save details to localStorage
      localStorage.setItem("eduSchoolName", schoolName);
      localStorage.setItem("eduSchoolAddress", address);
      localStorage.setItem("eduAdminName", adminName);
      localStorage.setItem("eduAdminEmail", email);
      localStorage.setItem("eduAdminPassword", pw);
      activeAdminUser = { name: adminName, role: "admin", roleName: "🔑 Administrador" };
      activeTeacher = null;
      if (schoolLogoUrl) {
        localStorage.setItem("eduSchoolLogo", schoolLogoUrl);
      } else {
        localStorage.removeItem("eduSchoolLogo");
      }

      showToast(`🏫 ${schoolName} registrada. ¡Ingresando al sistema!`, "✅");
      setTimeout(() => {
        // Close the auth modal
        const authSection = document.getElementById("authSection");
        if (authSection) {
          authSection.classList.remove("active");
          document.body.style.overflow = ""; // Unlock page scroll
        }
        updateDashboardSchoolHeader();
        triggerPageWipe("dashboard");
        btn.disabled = false;
        btn.innerHTML = `<span class="icon">🏫</span> Crear mi Institución`;
      }, 1500);
    }, 1400);
  });
})();

// ==========================================================================
// 13. SCHOOL SETTINGS & USER CREATION HANDLERS
// ==========================================================================


// School Logo Input listener for modification
const modSchoolLogoInput = document.getElementById("modSchoolLogo");
const modSchoolLogoPreview = document.getElementById("modSchoolLogoPreview");
if (modSchoolLogoInput && modSchoolLogoPreview) {
  modSchoolLogoInput.addEventListener("change", () => {
    const file = modSchoolLogoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      modSchoolLogoPreview.innerHTML = `<img src="${e.target.result}" alt="Logo" style="height: 100%; object-fit: contain;">`;
      modLogoDataUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function renderCreatedUsersList() {
  const container = document.getElementById("createdUsersList");
  if (!container) return;

  // Load created users or fallback to default mock ones
  let users = [];
  try {
    const storedUsers = localStorage.getItem("eduCreatedUsers");
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers);
      if (Array.isArray(parsed)) {
        users = parsed;
      }
    }
  } catch (err) {
    console.error("Error al cargar usuarios de localStorage:", err);
  }

  // If empty, initialize with defaults
  if (users.length === 0) {
    users = [
      {
        name: "Lic. Ana Reyes",
        role: "secretaria",
        roleName: "📝 Secretaria",
        phone: "+507 6200-1111",
        email: "ana.reyes@escuela.edu"
      },
      {
        name: "Ing. Carlos Mendoza",
        role: "sub administrador",
        roleName: "🔑 Sub Administrador",
        phone: "+507 6200-2222",
        email: "carlos.mendoza@escuela.edu"
      }
    ];
    localStorage.setItem("eduCreatedUsers", JSON.stringify(users));
  }

  const schoolLogo = localStorage.getItem("eduSchoolLogo") || defaultSchoolLogo;

  let html = "";
  users.forEach((user) => {
    if (!user) return;
    const name = user.name || "Usuario";
    const role = user.role || "usuario";
    const roleName = user.roleName || role;
    const email = user.email || "";
    const phone = user.phone || "";
    const roleClass = role.replace(/\s+/g, '-').toLowerCase();

    html += `
      <div class="user-account-item">
        <div class="user-account-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="${schoolLogo}" alt="Logo" style="width: 24px; height: 24px; object-fit: contain; border-radius: 4px; border: 1px solid var(--text-main);">
            <span class="user-account-name">${name}</span>
          </div>
          <span class="user-account-role role-${roleClass}">${roleName}</span>
        </div>
        <div class="user-account-details">
          <p><strong>📧 Correo:</strong> ${email}</p>
          <p><strong>📞 Teléfono:</strong> ${phone}</p>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function updateDashboardSchoolHeader() {
  const schoolName = localStorage.getItem("eduSchoolName") || "EduLink Academia";
  const schoolAddress = localStorage.getItem("eduSchoolAddress") || "Calle 50, Ciudad de Panamá";
  const adminName = localStorage.getItem("eduAdminName") || "Egnis Cano";
  const schoolLogo = localStorage.getItem("eduSchoolLogo") || defaultSchoolLogo;

  const nameEl = document.getElementById("dashboardSchoolName");
  const adminEl = document.getElementById("dashboardAdminName");
  const logoEl = document.getElementById("dashboardSchoolLogo");

  if (nameEl) nameEl.textContent = schoolName;
  if (adminEl) adminEl.textContent = `👤 Admin: ${adminName}`;
  if (logoEl) logoEl.src = schoolLogo;

  // Pre-fill settings form
  const modSchoolName = document.getElementById("modSchoolName");
  const modSchoolAddress = document.getElementById("modSchoolAddress");
  const modAdminName = document.getElementById("modAdminName");

  if (modSchoolName) modSchoolName.value = schoolName;
  if (modSchoolAddress) modSchoolAddress.value = schoolAddress;
  if (modAdminName) modAdminName.value = adminName;

  const modSchoolLogoPreview = document.getElementById("modSchoolLogoPreview");
  if (modSchoolLogoPreview && schoolLogo) {
    modSchoolLogoPreview.innerHTML = `<img src="${schoolLogo}" alt="Logo" style="height: 100%; object-fit: contain;">`;
  }

  // Render created users list inside settings drawer
  renderCreatedUsersList();
}

// Handle School Modification Form Submit
if (modifySchoolForm) {
  modifySchoolForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = (document.getElementById("modSchoolName")?.value || "").trim();
    const address = (document.getElementById("modSchoolAddress")?.value || "").trim();
    const admin = (document.getElementById("modAdminName")?.value || "").trim();

    if (!name || !address || !admin) {
      showToast("Completa todos los campos obligatorios", "⚠️");
      return;
    }

    localStorage.setItem("eduSchoolName", name);
    localStorage.setItem("eduSchoolAddress", address);
    localStorage.setItem("eduAdminName", admin);

    // Subir logo si fue provisto
    const logoInput = document.getElementById("modSchoolLogo");
    if (logoInput && logoInput.files && logoInput.files[0]) {
      const uploadUrl = await uploadFileToBucket(logoInput.files[0], "school-assets", "logos");
      if (uploadUrl) {
        localStorage.setItem("eduSchoolLogo", uploadUrl);
      }
    } else if (modLogoDataUrl) {
      localStorage.setItem("eduSchoolLogo", modLogoDataUrl);
      modLogoDataUrl = ""; // Reset after saving
    }

    updateDashboardSchoolHeader();
    showToast("Datos de la escuela actualizados con éxito", "🏫");
    
    // Close settings drawer
    if (settingsDrawer) {
      settingsDrawer.classList.remove("open");
      document.body.classList.remove("drawer-open");
      setTimeout(() => {
        settingsDrawer.classList.add("hidden");
      }, 500);
    }
  });
}

// Handle User Creation Form Submit
if (createUserForm) {
  const userRoleSelect = document.getElementById("createUserRole");
  const nameInput = document.getElementById("createUserName");
  const teacherSelect = document.getElementById("createUserTeacherSelect");
  const nameLabel = document.getElementById("createUserNameLabel");

  if (userRoleSelect && nameInput && teacherSelect) {
    userRoleSelect.addEventListener("change", () => {
      if (userRoleSelect.value === "profesores") {
        nameInput.style.display = "none";
        teacherSelect.style.display = "block";
        if (nameLabel) nameLabel.textContent = "Seleccionar Profesor";
        
        // Populate teacher list
        teacherSelect.innerHTML = "";
        for (const key in teachersData) {
          const teacher = teachersData[key];
          const opt = document.createElement("option");
          opt.value = teacher.name;
          opt.textContent = teacher.name;
          teacherSelect.appendChild(opt);
        }
      } else {
        nameInput.style.display = "block";
        teacherSelect.style.display = "none";
        if (nameLabel) nameLabel.textContent = "Nombre Completo";
      }
    });
  }

  createUserForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userRole = document.getElementById("createUserRole")?.value;
    let userName = "";
    if (userRole === "profesores") {
      userName = document.getElementById("createUserTeacherSelect")?.value || "";
    } else {
      userName = (document.getElementById("createUserName")?.value || "").trim();
    }
    const userPhone = (document.getElementById("createUserPhone")?.value || "").trim();
    const userEmail = (document.getElementById("createUserEmail")?.value || "").trim();
    const userPassword = document.getElementById("createUserPassword")?.value;

    if (!userName || !userRole || !userPhone || !userEmail || !userPassword) {
      showToast("Completa todos los campos", "⚠️");
      return;
    }

    if (userPassword.length < 6) {
      showToast("La contraseña debe tener al menos 6 caracteres", "🔒");
      return;
    }

    const roleSelect = document.getElementById("createUserRole");
    const roleName = roleSelect ? roleSelect.options[roleSelect.selectedIndex].text : "Usuario";

    // Load current users from localStorage
    let users = [];
    try {
      const storedUsers = localStorage.getItem("eduCreatedUsers");
      if (storedUsers) {
        const parsed = JSON.parse(storedUsers);
        if (Array.isArray(parsed)) {
          users = parsed;
        }
      }
    } catch (err) {
      console.error(err);
    }

    // Add new user
    users.push({
      name: userName,
      role: userRole,
      roleName: roleName,
      phone: userPhone,
      email: userEmail,
      password: userPassword
    });

    localStorage.setItem("eduCreatedUsers", JSON.stringify(users));

    showToast(`Usuario (${roleName}) ${userName} creado con éxito`, "➕");
    createUserForm.reset();

    // Reset visibility to original state
    if (userRoleSelect && nameInput && teacherSelect && nameLabel) {
      nameInput.style.display = "block";
      teacherSelect.style.display = "none";
      nameLabel.textContent = "Nombre Completo";
    }

    // Rerender created users list
    renderCreatedUsersList();

    // Close settings drawer
    if (settingsDrawer) {
      settingsDrawer.classList.remove("open");
      document.body.classList.remove("drawer-open");
      setTimeout(() => {
        settingsDrawer.classList.add("hidden");
      }, 500);
    }
  });
}

function initializeSchoolDetails() {
  updateDashboardSchoolHeader();
}

// Call on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSchoolDetails);
} else {
  initializeSchoolDetails();
}

// ==========================================================================
// 14. PORTAL DE PROFESORES / TEACHER PORTAL LOGIC & EVENT HANDLERS
// ==========================================================================

function initializeTeacherDashboard() {
  const teacher = teachersData[activeTeacher];
  if (!teacher) return;

  // Set Active Trimester dropdown in UI
  const trimesterSelect = document.getElementById("teacherActiveTrimesterSelect");
  if (trimesterSelect) {
    trimesterSelect.value = teacher.active_trimester || 1;
  }

  // Header Details
  const teacherNameEl = document.getElementById("teacherDashboardTeacherName");
  const gradeInfoEl = document.getElementById("teacherPortalGradeInfo");
  const schoolNameEl = document.getElementById("teacherDashboardSchoolName");
  const schoolLogoEl = document.getElementById("teacherDashboardSchoolLogo");

  if (teacherNameEl) teacherNameEl.textContent = `👤 Docente: ${teacher.name}`;
  if (gradeInfoEl) gradeInfoEl.textContent = `Grado: ${teacher.assigned_grade}`;

  const schoolLogo = localStorage.getItem("eduSchoolLogo") || defaultSchoolLogo;
  const schoolName = localStorage.getItem("eduSchoolName") || "EduLink Academia";

  if (schoolNameEl) schoolNameEl.textContent = schoolName;
  if (schoolLogoEl) schoolLogoEl.src = schoolLogo;

  // Reset navigation to default: Alumnos active
  const navTeacherAlumnos = document.getElementById("navTeacherAlumnos");
  const navTeacherPlanificacion = document.getElementById("navTeacherPlanificacion");
  const teacherAppScreen = document.getElementById("teacherAppScreen");
  const teacherPlanningScreen = document.getElementById("teacherPlanningScreen");

  if (navTeacherAlumnos && navTeacherPlanificacion && teacherAppScreen && teacherPlanningScreen) {

    navTeacherAlumnos.classList.add("primary");
    navTeacherAlumnos.classList.remove("secondary");
    navTeacherPlanificacion.classList.add("secondary");
    navTeacherPlanificacion.classList.remove("primary");
    
    teacherAppScreen.classList.remove("hidden");
    teacherPlanningScreen.classList.add("hidden");
  }

  // Bind static actions for teacher portal if they are not already bound
  setupTeacherPortalStaticEvents();

  // Populate planning subject selector
  updateTeacherSubjectDropdown();

  // Load students for teacher's grade
  loadTeacherStudents();

  // Sync any grades that are only in localStorage up to Supabase
  // so the parent portal can see them in real-time
  setTimeout(() => syncLocalGradesToSupabase(), 1500);
}

let teacherEventsBound = false;
function setupTeacherPortalStaticEvents() {
  if (teacherEventsBound) return;
  teacherEventsBound = true;

  // Active Trimester Selector Listener
  const trimesterSelect = document.getElementById("teacherActiveTrimesterSelect");
  if (trimesterSelect) {
    trimesterSelect.addEventListener("change", async (e) => {
      const val = parseInt(e.target.value) || 1;
      const teacher = teachersData[activeTeacher];
      if (teacher) {
        teacher.active_trimester = val;
        try {
          localStorage.setItem("eduTeachersData", JSON.stringify(teachersData));
        } catch(err) {}

        if (useSupabaseDb && supabaseClient) {
          try {
            const { error } = await supabaseClient
              .from('teachers')
              .update({ active_trimester: val })
              .eq('id', activeTeacher);
            if (error) {
              console.error("Error al actualizar el trimestre activo en Supabase:", error);
            }
          } catch(err) {
            console.error("Error de conexión al actualizar trimestre:", err);
          }
        }
        showToast(`Cargando calificaciones del Trimestre ${val}`, "📅");
        loadTeacherStudents();
      }
    });
  }

  // Theme Toggle
  const teacherThemeToggle = document.getElementById("teacherThemeToggle");
  if (teacherThemeToggle) {
    teacherThemeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-theme");
      document.body.classList.toggle("light-theme", !isDark);
      showToast(isDark ? "Modo oscuro activado" : "Modo claro activado", "🌓");
    });
  }

  // Logout Button
  const teacherLogoutBtn = document.getElementById("teacherLogoutBtn");
  if (teacherLogoutBtn) {
    teacherLogoutBtn.addEventListener("click", () => {
      showToast("Cerrando sesión...", "🔒");
      setTimeout(() => {
        triggerPageWipe("landing");
      }, 500);
    });
  }

  // Tab Navigation Buttons
  const navTeacherAlumnos = document.getElementById("navTeacherAlumnos");
  const navTeacherPlanificacion = document.getElementById("navTeacherPlanificacion");
  const teacherAppScreen = document.getElementById("teacherAppScreen");
  const teacherPlanningScreen = document.getElementById("teacherPlanningScreen");
  const teacherChatScreen = document.getElementById("teacherChatScreen");

  function switchTeacherTab(active) {
    // Manage btn styles
    [navTeacherAlumnos, navTeacherPlanificacion, document.getElementById("navTeacherChat")].forEach(btn => {
      if (!btn) return;
      btn.classList.remove("primary");
      btn.classList.add("secondary");
    });
    if (active) { active.classList.remove("secondary"); active.classList.add("primary"); }
    // Manage screen visibility
    [teacherAppScreen, teacherPlanningScreen, teacherChatScreen].forEach(s => {
      if (s) s.classList.add("hidden");
    });
  }

  if (navTeacherAlumnos) {
    navTeacherAlumnos.addEventListener("click", () => {
      switchTeacherTab(navTeacherAlumnos);
      if (teacherAppScreen) teacherAppScreen.classList.remove("hidden");
    });
  }

  if (navTeacherPlanificacion) {
    navTeacherPlanificacion.addEventListener("click", () => {
      switchTeacherTab(navTeacherPlanificacion);
      if (teacherPlanningScreen) teacherPlanningScreen.classList.remove("hidden");
    });
  }

  const navTeacherChat = document.getElementById("navTeacherChat");
  if (navTeacherChat) {
    navTeacherChat.addEventListener("click", () => {
      switchTeacherTab(navTeacherChat);
      if (teacherChatScreen) teacherChatScreen.classList.remove("hidden");
      // Default to Tutor tab and render contacts list
      teacherActiveChatType = "tutor";
      const btnTutor = document.getElementById("teacherBtnChatTutor");
      const btnStaff = document.getElementById("teacherBtnChatStaff");
      if (btnTutor) { btnTutor.classList.add("active"); }
      if (btnStaff) { btnStaff.classList.remove("active"); }
      renderTutorContactsList(null);
      // Hide staff area, show tutor contacts
      const staffListArea = document.getElementById("teacherStaffListArea");
      const tutorContactsList = document.getElementById("teacherTutorContactsList");
      if (staffListArea) staffListArea.classList.add("hidden");
      if (tutorContactsList) tutorContactsList.style.display = "flex";
      // Reset right side to placeholder
      resetTeacherChatRightPanel();
    });
  }

  // Add Subject Button
  const teacherAddSubjectBtn = document.getElementById("teacherAddSubjectBtn");
  if (teacherAddSubjectBtn) {
    teacherAddSubjectBtn.addEventListener("click", addTeacherSubject);
  }

  // Add Activity Button
  const teacherAddActivityBtn = document.getElementById("teacherAddActivityBtn");
  if (teacherAddActivityBtn) {
    teacherAddActivityBtn.addEventListener("click", addTeacherPlanningActivityRow);
  }

  // Add Syllabus Topic Button
  const teacherAddSyllabusTopicBtn = document.getElementById("teacherAddSyllabusTopicBtn");
  if (teacherAddSyllabusTopicBtn) {
    teacherAddSyllabusTopicBtn.addEventListener("click", addTeacherPlanningSyllabusRow);
  }

  // Save Planning Button
  const teacherSavePlanningBtn = document.getElementById("teacherSavePlanningBtn");
  if (teacherSavePlanningBtn) {
    teacherSavePlanningBtn.addEventListener("click", saveTeacherPlanning);
  }

  // Planning Subject Selector change handler
  const teacherSubjectSelect = document.getElementById("teacherSubjectSelect");
  if (teacherSubjectSelect) {
    teacherSubjectSelect.addEventListener("change", loadSelectedSubjectPlanning);
  }

  // Chat message sending
  const teacherChatSendBtn = document.getElementById("teacherChatSendBtn");
  const teacherChatInputField = document.getElementById("teacherChatInputField");

  if (teacherChatSendBtn && teacherChatInputField) {
    teacherChatSendBtn.addEventListener("click", sendTeacherMessage);
    teacherChatInputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendTeacherMessage();
    });
  }

  // File attach clip click
  const teacherChatAttachBtn = document.getElementById("teacherChatAttachBtn");
  const teacherChatFileInput = document.getElementById("teacherChatFileInput");
  if (teacherChatAttachBtn && teacherChatFileInput) {
    teacherChatAttachBtn.addEventListener("click", () => {
      teacherChatFileInput.click();
    });
    
    teacherChatFileInput.addEventListener("change", handleTeacherChatFileSelection);
  }
}

function updateTeacherSubjectDropdown() {
  const select = document.getElementById("teacherSubjectSelect");
  if (!select) return;

  const teacher = teachersData[activeTeacher];
  if (!teacher || !teacher.subjects) return;

  select.innerHTML = "";
  teacher.subjects.forEach(subj => {
    const opt = document.createElement("option");
    opt.value = subj;
    opt.textContent = subj;
    select.appendChild(opt);
  });

  loadSelectedSubjectPlanning();
}

function loadSelectedSubjectPlanning() {
  const select = document.getElementById("teacherSubjectSelect");
  if (!select) return;

  const subject = select.value;
  if (!subject) {
    renderPlanningSyllabus([]);
    renderPlanningActivities([]);
    return;
  }

  // Find in global planningsData
  const planningId = `${activeTeacher}_${subject}`;
  const pl = planningsData[planningId];
  
  let topics = [];
  let activities = [];
  
  if (pl) {
    topics = pl.syllabus || [];
    activities = pl.activities || [];
  }

  // Syllabus fallback
  if (topics.length === 0) {
    const syllabusKey = `eduTeacherPlanningSyllabus_${activeTeacher}_${subject}`;
    try {
      const stored = localStorage.getItem(syllabusKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) topics = parsed;
      } else {
        // Check legacy format
        const legacyKey = `eduTeacherPlanning_${activeTeacher}_${subject}`;
        const legacyStored = localStorage.getItem(legacyKey);
        if (legacyStored) {
          const legacyParsed = JSON.parse(legacyStored);
          if (legacyParsed.syllabus) {
            topics = legacyParsed.syllabus.split(/[•;]|\r?\n/).map(s => s.trim()).filter(Boolean);
          }
        }
      }
    } catch(e) {}
  }
  if (!Array.isArray(topics) || topics.length === 0) {
    topics = ["Tema 1: Conceptos Básicos", "Tema 2: Desarrollo Práctico"];
  }
  renderPlanningSyllabus(topics);

  // Activities fallback
  if (activities.length === 0) {
    const activitiesKey = `eduTeacherPlanningActivities_${activeTeacher}_${subject}`;
    try {
      const storedActivities = localStorage.getItem(activitiesKey);
      if (storedActivities) {
        const parsed = JSON.parse(storedActivities);
        if (Array.isArray(parsed)) activities = parsed;
      }
    } catch(e) {}
  }
  if (!Array.isArray(activities) || activities.length === 0) {
    activities = ["Taller 1", "Investigación 1", "Examen parcial", "Prueba corta"];
  }
  renderPlanningActivities(activities);
}

function renderPlanningActivities(activities) {
  const container = document.getElementById("teacherActivitiesContainer");
  if (!container) return;

  container.innerHTML = "";
  activities.forEach((act, idx) => {
    const row = document.createElement("div");
    row.className = "activity-row";
    row.style.display = "flex";
    row.style.gap = "8px";
    row.style.alignItems = "center";

    row.innerHTML = `
      <span style="font-family: 'Outfit'; font-weight: bold; font-size: 0.85rem; min-width: 50px; color: var(--text-main);">Act ${idx + 1}:</span>
      <input type="text" class="activity-title-input" value="${escapeHTML(act)}" placeholder="Nombre de tarea/examen" style="flex: 1; border: 2px solid var(--text-main); border-radius: 10px; padding: 8px; font-family: 'Outfit'; font-size: 0.85rem; background: var(--card-bg); color: var(--text-main); font-weight: bold; box-sizing: border-box;">
      <button type="button" class="chubby-btn secondary delete-activity-btn" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 8px; border-color: var(--color-orange); color: var(--color-orange); height: auto; cursor: pointer;">✖</button>
    `;

    row.querySelector(".delete-activity-btn").addEventListener("click", () => {
      row.remove();
      renumberActivities();
    });

    container.appendChild(row);
  });
}

function renderPlanningSyllabus(topics) {
  const container = document.getElementById("teacherSyllabusContainer");
  if (!container) return;

  container.innerHTML = "";
  topics.forEach((topic, idx) => {
    const row = document.createElement("div");
    row.className = "syllabus-row";
    row.style.display = "flex";
    row.style.gap = "8px";
    row.style.alignItems = "center";

    row.innerHTML = `
      <span style="font-family: 'Outfit'; font-weight: bold; font-size: 0.85rem; min-width: 60px; color: var(--text-main);">Tema ${idx + 1}:</span>
      <input type="text" class="syllabus-title-input" value="${escapeHTML(topic)}" placeholder="Ej: Introducción a la materia" style="flex: 1; border: 2px solid var(--text-main); border-radius: 10px; padding: 8px; font-family: 'Outfit'; font-size: 0.85rem; background: var(--card-bg); color: var(--text-main); font-weight: bold; box-sizing: border-box;">
      <button type="button" class="chubby-btn secondary delete-syllabus-btn" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 8px; border-color: var(--color-orange); color: var(--color-orange); height: auto; cursor: pointer;">✖</button>
    `;

    row.querySelector(".delete-syllabus-btn").addEventListener("click", () => {
      row.remove();
      renumberSyllabusTopics();
    });

    container.appendChild(row);
  });
}

function renumberSyllabusTopics() {
  const container = document.getElementById("teacherSyllabusContainer");
  if (!container) return;
  const rows = container.querySelectorAll(".syllabus-row");
  rows.forEach((row, idx) => {
    const span = row.querySelector("span");
    if (span) span.textContent = `Tema ${idx + 1}:`;
  });
}

function addTeacherPlanningSyllabusRow() {
  const container = document.getElementById("teacherSyllabusContainer");
  if (!container) return;

  const count = container.querySelectorAll(".syllabus-row").length;
  if (count >= 7) {
    showToast("Se permite un máximo de 7 temas por materia", "⚠️");
    return;
  }

  const row = document.createElement("div");
  row.className = "syllabus-row";
  row.style.display = "flex";
  row.style.gap = "8px";
  row.style.alignItems = "center";

  row.innerHTML = `
    <span style="font-family: 'Outfit'; font-weight: bold; font-size: 0.85rem; min-width: 60px; color: var(--text-main);">Tema ${count + 1}:</span>
    <input type="text" class="syllabus-title-input" value="" placeholder="Ej: Introducción a la materia" style="flex: 1; border: 2px solid var(--text-main); border-radius: 10px; padding: 8px; font-family: 'Outfit'; font-size: 0.85rem; background: var(--card-bg); color: var(--text-main); font-weight: bold; box-sizing: border-box;">
    <button type="button" class="chubby-btn secondary delete-syllabus-btn" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 8px; border-color: var(--color-orange); color: var(--color-orange); height: auto; cursor: pointer;">✖</button>
  `;

  row.querySelector(".delete-syllabus-btn").addEventListener("click", () => {
    row.remove();
    renumberSyllabusTopics();
  });

  container.appendChild(row);
}

function renumberActivities() {
  const container = document.getElementById("teacherActivitiesContainer");
  if (!container) return;
  const rows = container.querySelectorAll(".activity-row");
  rows.forEach((row, idx) => {
    const span = row.querySelector("span");
    if (span) span.textContent = `Act ${idx + 1}:`;
  });
}

function addTeacherPlanningActivityRow() {
  const container = document.getElementById("teacherActivitiesContainer");
  if (!container) return;

  const count = container.querySelectorAll(".activity-row").length;
  if (count >= 7) {
    showToast("Se permite un máximo de 7 actividades por materia", "⚠️");
    return;
  }

  const row = document.createElement("div");
  row.className = "activity-row";
  row.style.display = "flex";
  row.style.gap = "8px";
  row.style.alignItems = "center";

  row.innerHTML = `
    <span style="font-family: 'Outfit'; font-weight: bold; font-size: 0.85rem; min-width: 50px; color: var(--text-main);">Act ${count + 1}:</span>
    <input type="text" class="activity-title-input" value="" placeholder="Nombre de tarea/examen" style="flex: 1; border: 2px solid var(--text-main); border-radius: 10px; padding: 8px; font-family: 'Outfit'; font-size: 0.85rem; background: var(--card-bg); color: var(--text-main); font-weight: bold; box-sizing: border-box;">
    <button type="button" class="chubby-btn secondary delete-activity-btn" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 8px; border-color: var(--color-orange); color: var(--color-orange); height: auto; cursor: pointer;">✖</button>
  `;

  row.querySelector(".delete-activity-btn").addEventListener("click", () => {
    row.remove();
    renumberActivities();
  });

  container.appendChild(row);
}

async function addTeacherSubject() {
  const input = document.getElementById("teacherNewSubjectInput");
  if (!input) return;

  const newSubj = input.value.trim();
  if (!newSubj) {
    showToast("Escribe el nombre de la materia", "⚠️");
    return;
  }

  const teacher = teachersData[activeTeacher];
  if (!teacher) return;

  if (!teacher.subjects) teacher.subjects = [];

  // Check duplicate
  const lowerSubj = newSubj.toLowerCase();
  if (teacher.subjects.some(s => s.toLowerCase() === lowerSubj)) {
    showToast("Esta asignatura ya está en tu carga académica", "⚠️");
    return;
  }

  teacher.subjects.push(newSubj);
  input.value = "";

  // Save local and global
  try {
    localStorage.setItem("eduTeachersData", JSON.stringify(teachersData));
  } catch(e) {}

  if (useSupabaseDb && supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from('teachers')
        .update({ subjects: teacher.subjects })
        .eq('id', activeTeacher);

      if (error) {
        console.error("Error al guardar materias en Supabase:", error);
      }
    } catch(err) {
      console.error(err);
    }
  }

  showToast(`Materia "${newSubj}" agregada con éxito`, "📚");

  // Refresh Dropdown
  updateTeacherSubjectDropdown();

  // Refresh Students list so new subject input shows up
  loadTeacherStudents();
}

function saveTeacherPlanning() {
  const select = document.getElementById("teacherSubjectSelect");
  if (!select) return;

  const subject = select.value;
  if (!subject) {
    showToast("Selecciona una materia primero", "⚠️");
    return;
  }

  // Get syllabus topics
  const syllabusContainer = document.getElementById("teacherSyllabusContainer");
  const syllabusInputs = syllabusContainer ? syllabusContainer.querySelectorAll(".syllabus-title-input") : [];
  const topics = [];
  syllabusInputs.forEach(inp => {
    const val = inp.value.trim();
    if (val) topics.push(val);
  });

  if (topics.length === 0) {
    showToast("Agrega al menos 1 tema del temario", "⚠️");
    return;
  }

  // Get activities
  const activitiesContainer = document.getElementById("teacherActivitiesContainer");
  const activityInputs = activitiesContainer ? activitiesContainer.querySelectorAll(".activity-title-input") : [];
  const activities = [];
  activityInputs.forEach(inp => {
    const val = inp.value.trim();
    if (val) activities.push(val);
  });

  if (activities.length === 0) {
    showToast("Agrega al menos 1 actividad evaluable", "⚠️");
    return;
  }

  // Save syllabus topics array
  const syllabusKey = `eduTeacherPlanningSyllabus_${activeTeacher}_${subject}`;
  localStorage.setItem(syllabusKey, JSON.stringify(topics));

  // Save concatenated string for legacy support
  const planningKey = `eduTeacherPlanning_${activeTeacher}_${subject}`;
  const syllabusJoined = topics.join(" • ");
  localStorage.setItem(planningKey, JSON.stringify({ syllabus: syllabusJoined }));

  // Save activities array
  const activitiesKey = `eduTeacherPlanningActivities_${activeTeacher}_${subject}`;
  localStorage.setItem(activitiesKey, JSON.stringify(activities));

  // Save to global planningsData cache
  const planningId = `${activeTeacher}_${subject}`;
  planningsData[planningId] = {
    id: planningId,
    teacher_id: activeTeacher,
    subject: subject,
    syllabus: topics,
    activities: activities
  };
  try {
    localStorage.setItem("eduPlanningsData", JSON.stringify(planningsData));
  } catch(e){}

  showToast(`Planificación de ${subject} guardada`, "💾");

  // Sync to Supabase
  if (useSupabaseDb && supabaseClient) {
    (async () => {
      try {
        const { error } = await supabaseClient
          .from('planning')
          .upsert({
            id: planningId,
            teacher_id: activeTeacher,
            subject: subject,
            syllabus: topics,
            activities: activities,
            updated_at: new Date().toISOString()
          });
        if (error) {
          console.error("Error saving planning to Supabase:", error);
          showToast("Guardado local (Error al sincronizar con la base de datos)", "⚠️");
        } else {
          showToast("Planificación sincronizada con Supabase", "✅");
        }
      } catch(err) {
        console.error("Excepción al guardar planificación en Supabase:", err);
        showToast("Guardado local (Error de conexión)", "⚠️");
      }
    })();
  }

  // Refresh students list
  loadTeacherStudents();
}

function loadTeacherStudents() {
  const teacher = teachersData[activeTeacher];
  if (!teacher) return;

  // Filter students by grade
  const grade = teacher.assigned_grade || "3A";
  const filtered = Object.values(studentsData || {}).filter(s => s.grade === grade);

  // Alphabetical sort
  filtered.sort((a, b) => a.name.localeCompare(b.name));

  renderTeacherPortalStudents(filtered);
}

// Helper functions for student sub-accordions, incidents, and averages
window.toggleSubAccordion = function(studentId, sectionKey) {
  const detailContainer = document.getElementById(`portal-details-${studentId}`);
  if (!detailContainer) return;

  const targetId = `sub-acc-${sectionKey}-${studentId}`;
  const accordions = detailContainer.querySelectorAll(".portal-sub-accordion");
  
  accordions.forEach(acc => {
    const content = acc.querySelector(".portal-sub-accordion-content");
    const chevron = acc.querySelector(".portal-sub-accordion-header .chevron");
    if (acc.id === targetId) {
      const isCurrentlyActive = acc.classList.contains("active");
      if (isCurrentlyActive) {
        acc.classList.remove("active");
        if (content) content.style.display = "none";
        if (chevron) chevron.textContent = "▶";
      } else {
        acc.classList.add("active");
        if (content) content.style.display = "block";
        if (chevron) chevron.textContent = "▼";
      }
    } else {
      acc.classList.remove("active");
      if (content) content.style.display = "none";
      if (chevron) chevron.textContent = "▶";
    }
  });
};

function renderStudentIncidents(studentId) {
  const feed = document.getElementById(`incident-feed-${studentId}`);
  if (!feed) return;

  feed.innerHTML = "";
  let incidents = [];
  try {
    if (studentsData[studentId] && studentsData[studentId].incidents) {
      incidents = studentsData[studentId].incidents;
    } else {
      const stored = localStorage.getItem(`eduStudentIncidents_${studentId}`);
      if (stored) incidents = JSON.parse(stored);
    }
  } catch(e) {}

  if (incidents.length === 0) {
    feed.innerHTML = `<p style="font-style: italic; font-size: 0.75rem; text-align: center; color: var(--text-secondary); margin: 6px 0;">No hay incidencias registradas.</p>`;
    return;
  }

  // Render from newest to oldest
  [...incidents].reverse().forEach(inc => {
    const item = document.createElement("div");
    item.className = "incident-item";
    item.innerHTML = `
      <div class="incident-header">
        <span>📅 ${escapeHTML(inc.date)}</span>
        <span>${escapeHTML(inc.time)}</span>
      </div>
      <div style="color: var(--text-main); font-weight: bold; overflow-wrap: break-word;">${escapeHTML(inc.text)}</div>
    `;
    feed.appendChild(item);
  });
}

function loadStudentNoveltyReport(studentId) {
  const container = document.getElementById(`portal-details-${studentId}`);
  if (!container) return;

  try {
    let report = null;
    if (studentsData[studentId] && studentsData[studentId].noveltyReport) {
      report = studentsData[studentId].noveltyReport;
    } else {
      const stored = localStorage.getItem(`eduStudentNovedades_${studentId}`);
      if (stored) report = JSON.parse(stored);
    }

    if (report) {
      const flags = report.flags || [];
      const checkboxes = container.querySelectorAll(`.novedad-flag[data-student-id="${studentId}"]`);
      checkboxes.forEach(chk => {
        chk.checked = flags.includes(chk.value);
      });
      const textarea = container.querySelector(`.student-novelty-textarea[data-student-id="${studentId}"]`);
      if (textarea) textarea.value = report.detail || "";
    }
  } catch(e) {}
}

function updateTrimesterAverageForStudent(studentId) {
  const container = document.getElementById(`portal-grades-container-${studentId}`);
  const trimesterLabel = document.getElementById(`trimester-avg-${studentId}`);
  if (!container || !trimesterLabel) return;

  const teacher = teachersData[activeTeacher];
  const teacherSubjects = teacher ? teacher.subjects || [] : [];
  if (teacherSubjects.length === 0) {
    trimesterLabel.textContent = "--";
    return;
  }

  let totalSum = 0;
  let totalCount = 0;
  let hasInvalids = false;

  teacherSubjects.forEach(subject => {
    const inputs = container.querySelectorAll(`input.activity-grade-input[data-subject="${subject}"]`);
    let subSum = 0;
    let subCount = 0;
    let subjectValid = true;

    inputs.forEach(input => {
      const val = input.value.trim().replace(/,/g, '.');
      if (!val) return;
      const num = parseFloat(val);
      if (isNaN(num) || num < 1.0 || num > 5.0) {
        subjectValid = false;
        hasInvalids = true;
      } else {
        subSum += num;
        subCount++;
      }
    });

    if (subjectValid && subCount > 0) {
      const subAvg = subSum / subCount;
      totalSum += subAvg;
      totalCount++;
    }
  });

  if (hasInvalids) {
    trimesterLabel.textContent = "Inválido ⚠️";
    trimesterLabel.style.color = "var(--color-orange)";
  } else if (totalCount > 0) {
    const finalAvg = (totalSum / totalCount).toFixed(1);
    trimesterLabel.textContent = finalAvg;
    
    const num = parseFloat(finalAvg);
    if (num >= 4.5) {
      trimesterLabel.style.color = "#a3e635"; // lime green
    } else if (num >= 3.0) {
      trimesterLabel.style.color = "var(--color-orange)";
    } else {
      trimesterLabel.style.color = "#ef4444"; // red
    }
  } else {
    trimesterLabel.textContent = "--";
    trimesterLabel.style.color = "var(--text-main)";
  }
}

function renderTeacherPortalStudents(students) {
  const container = document.getElementById("teacherPortalStudentsList");
  if (!container) return;

  // Detect which student card and sub-accordion were expanded/active before clearing
  let expandedStudentId = null;
  let expandedSubAccordionKey = "calif"; // Default to calif

  const openDetails = container.querySelector(".portal-student-details:not(.hidden)");
  if (openDetails) {
    expandedStudentId = openDetails.id.replace("portal-details-", "");
    const activeSub = openDetails.querySelector(".portal-sub-accordion.active");
    if (activeSub) {
      if (activeSub.id.startsWith("sub-acc-datos-")) expandedSubAccordionKey = "datos";
      else if (activeSub.id.startsWith("sub-acc-incid-")) expandedSubAccordionKey = "incid";
      else if (activeSub.id.startsWith("sub-acc-cond-")) expandedSubAccordionKey = "cond";
      else if (activeSub.id.startsWith("sub-acc-noved-")) expandedSubAccordionKey = "noved";
      else expandedSubAccordionKey = "calif";
    }
  }

  container.innerHTML = "";

  if (students.length === 0) {
    container.innerHTML = `<p class="helper-text" style="padding: 10px 14px;">No hay alumnos registrados en el grado de este docente.</p>`;
    return;
  }

  const teacher = teachersData[activeTeacher];
  const teacherSubjects = teacher ? teacher.subjects || [] : [];

  students.forEach(student => {
    const isExpanded = (student.id === expandedStudentId);
    const activeSubKey = isExpanded ? expandedSubAccordionKey : "calif";

    const card = document.createElement("div");
    card.className = "portal-student-card";
    card.id = `portal-student-${student.id}`;
    if (isExpanded) {
      card.style.borderColor = "var(--color-cyan)";
    }

    // Get attendance state from state or localStorage
    let isPresent = true;
    if (student.attendance !== undefined && student.attendance !== null) {
      isPresent = student.attendance;
    } else {
      isPresent = localStorage.getItem(`eduStudentAttendance_${student.id}`) === "true";
    }

    // Avatar HTML
    let avatarHTML = "";
    if (student.isImgPath || student.is_img_path || (student.img && student.img.startsWith('data:image/')) || (student.img && student.img.includes('/'))) {
      avatarHTML = `<img src="${student.img}" alt="${student.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">`;
    } else {
      avatarHTML = `<div class="avatar-fallback gradient-blue" style="width:100%;height:100%;color:white;font-weight:800;display:flex;align-items:center;justify-content:center;font-size: 0.95rem; border-radius: 6px;">${student.img}</div>`;
    }

    // Render grades rows for each subject
    let subjectsHtml = "";
    teacherSubjects.forEach(subject => {
      // Find activities configured
      let activities = [];
      const planningId = `${activeTeacher}_${subject}`;
      const pl = planningsData[planningId];
      if (pl && Array.isArray(pl.activities)) {
        activities = pl.activities;
      } else {
        const activitiesKey = `eduTeacherPlanningActivities_${activeTeacher}_${subject}`;
        try {
          const stored = localStorage.getItem(activitiesKey);
          if (stored) {
            activities = JSON.parse(stored);
          }
        } catch(e) {}
      }

      if (!Array.isArray(activities) || activities.length === 0) {
        activities = ["Taller 1", "Investigación 1", "Examen parcial", "Prueba corta"];
      }

      // Check planning syllabus
      let syllabusTopics = [];
      if (pl && Array.isArray(pl.syllabus)) {
        syllabusTopics = pl.syllabus;
      } else {
        const syllabusKey = `eduTeacherPlanningSyllabus_${activeTeacher}_${subject}`;
        try {
          const stored = localStorage.getItem(syllabusKey);
          if (stored) {
            syllabusTopics = JSON.parse(stored);
          }
        } catch(e) {}
      }

      let planningRefHTML = "";
      if (syllabusTopics && syllabusTopics.length > 0) {
        planningRefHTML += `<span style="display:block;">📚 <strong>Temas:</strong> ${syllabusTopics.map(t => escapeHTML(t)).join(" • ")}</span>`;
      } else {
        // Fallback legacy
        const planningKey = `eduTeacherPlanning_${activeTeacher}_${subject}`;
        try {
          const storedPlanning = localStorage.getItem(planningKey);
          if (storedPlanning) {
            const parsed = JSON.parse(storedPlanning);
            if (parsed.syllabus) {
              planningRefHTML += `<span style="display:block;">📚 <strong>Temario:</strong> ${escapeHTML(parsed.syllabus)}</span>`;
            }
          }
        } catch(e) {}
      }

      if (!planningRefHTML) {
        planningRefHTML = `<span style="font-style: italic; opacity: 0.6;">Sin temario académico asignado.</span>`;
      }

      // Load stored grades JSON array based on active trimester
      let storedGrades = [];
      const activeTrimester = teacher ? teacher.active_trimester || 1 : 1;
      const subjectKey = `${subject}_T${activeTrimester}`;
      if (student.subject_grades && Array.isArray(student.subject_grades[subjectKey])) {
        storedGrades = student.subject_grades[subjectKey];
      } else {
        const storedGradesRaw = localStorage.getItem(`eduStudentGradesJSON_${student.id}_${subjectKey}`);
        if (storedGradesRaw) {
          try {
            storedGrades = JSON.parse(storedGradesRaw);
          } catch(e) {}
        }
      }

      // Build specific grades inputs (compact layout)
      let gradesInputsHtml = "";
      activities.forEach((act, actIdx) => {
        let val = "";
        if (Array.isArray(storedGrades) && storedGrades[actIdx] !== undefined && storedGrades[actIdx] !== null) {
          val = storedGrades[actIdx];
        } else {
          // Fallback to student baseline grades array for first index based on active trimester
          const idx = teacherSubjects.indexOf(subject);
          if (idx !== -1 && student.grades && student.grades[activeTrimester - 1] !== undefined && actIdx === 0) {
            val = parseFloat(student.grades[activeTrimester - 1]).toFixed(1);
          }
        }

        gradesInputsHtml += `
          <div style="display: flex; flex-direction: column; gap: 2px; align-items: center;">
            <span style="font-size: 0.62rem; font-weight: bold; color: var(--text-secondary); max-width: 45px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center;" title="${escapeHTML(act)}">${escapeHTML(act)}</span>
            <input type="text" class="portal-activity-grade-input activity-grade-input" data-student-id="${student.id}" data-subject="${subject}" data-activity-index="${actIdx}" value="${val}" placeholder="-">
          </div>
        `;
      });

      subjectsHtml += `
        <div class="portal-grade-subject-row" style="display: flex; flex-column; gap: 6px; margin-bottom: 14px; border-bottom: 1.5px dashed rgba(0,0,0,0.06); padding-bottom: 12px; flex-direction: column;">
          <!-- Header of Subject Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <span style="font-family: 'Outfit'; font-weight: 800; font-size: 0.95rem; color: var(--text-main);">${subject}</span>
            <span class="portal-subject-avg-label" id="avg-label-${student.id}-${subject}" style="font-size: 0.78rem; padding: 2px 8px; border-radius: 6px; border: 2px solid var(--text-main); font-weight: bold; min-width: 75px; text-align: center;">Promedio: --</span>
          </div>
          
          <div class="subject-planning-reference" style="font-size: 0.72rem; color: var(--text-secondary); opacity: 0.85; line-height: 1.3;">
            ${planningRefHTML}
          </div>

          <!-- Grade inputs wrapped nicely -->
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; justify-content: flex-start;">
            ${gradesInputsHtml}
          </div>
        </div>
      `;
    });

    if (teacherSubjects.length === 0) {
      subjectsHtml = `<p class="helper-text" style="font-size: 0.8rem; margin: 0;">No tienes materias registradas. Agrega materias en la pestaña "Planificación".</p>`;
    }

    card.innerHTML = `
      <!-- CARD HEADER ROW: Profile picture, name, attendance checkbox -->
      <div class="portal-student-row" style="display: flex; align-items: center; gap: 12px; justify-content: space-between; position: relative;">
        <!-- Left: Photo & Name -->
        <div style="display: flex; align-items: center; gap: 12px;">
          <!-- Photo Wrapper -->
          <div class="portal-student-photo-wrapper" style="width: 38px; height: 38px; border-radius: 8px; overflow: hidden; border: 2px solid var(--text-main); flex-shrink: 0; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; background: var(--card-bg);">
            ${avatarHTML}
          </div>
          
          <!-- Name -->
          <span class="portal-student-name" style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.05rem; color: var(--text-main); cursor: pointer; text-decoration: underline; text-decoration-color: transparent; transition: all 0.2s;">
            ${student.name}
          </span>
        </div>

        <!-- Right: Attendance Checkbox -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-family: 'Outfit', sans-serif; font-weight: bold; font-size: 0.78rem; color: var(--text-secondary);">Asistencia:</span>
          <input type="checkbox" class="portal-attendance-chk" data-student-id="${student.id}" ${isPresent ? 'checked' : ''}>
        </div>
      </div>

      <!-- COLLAPSIBLE DETAILS SECTION (hidden by default) -->
      <div class="portal-student-details ${isExpanded ? '' : 'hidden'}" id="portal-details-${student.id}" style="margin-top: 14px; border-top: 1.5px dashed var(--text-main); padding-top: 14px; display: flex; flex-direction: column; gap: 10px;">
        
        <!-- Accordion 1: Calificaciones -->
        <div class="portal-sub-accordion ${activeSubKey === 'calif' ? 'active' : ''}" id="sub-acc-calif-${student.id}">
          <button class="portal-sub-accordion-header" onclick="toggleSubAccordion('${student.id}', 'calif')">
            <span>📊 Calificaciones Académicas</span>
            <span class="chevron">${activeSubKey === 'calif' ? '▼' : '▶'}</span>
          </button>
          <div class="portal-sub-accordion-content" style="display: ${activeSubKey === 'calif' ? 'block' : 'none'};">
            
            <!-- Overall trimester average realce -->
            <div class="trimester-avg-card">
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <span style="font-family: 'Outfit'; font-weight: 800; font-size: 0.95rem; color: var(--text-main);">Nota Final del Trimestre</span>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">Promedio general de todas tus materias</span>
              </div>
              <div class="trimester-avg-value" id="trimester-avg-${student.id}">--</div>
            </div>

            <div class="portal-grades-subjects-container" id="portal-grades-container-${student.id}">
              ${subjectsHtml}
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 8px; justify-content: flex-end;">
              <button class="chubby-btn primary save-grades-btn" data-student-id="${student.id}" style="padding: 6px 16px; font-size: 0.8rem; height: 36px;">
                <span>💾 Guardar Notas</span>
              </button>
              <button class="chubby-btn secondary siace-sync-btn" data-student-id="${student.id}" style="padding: 6px 16px; font-size: 0.8rem; height: 36px; background-color: var(--color-purple); color: white; border-color: var(--color-purple);">
                <span>⚡ Sincronizar SIACE</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Accordion 2: Datos Personales -->
        <div class="portal-sub-accordion ${activeSubKey === 'datos' ? 'active' : ''}" id="sub-acc-datos-${student.id}">
          <button class="portal-sub-accordion-header" onclick="toggleSubAccordion('${student.id}', 'datos')">
            <span>👤 Datos Personales</span>
            <span class="chevron">${activeSubKey === 'datos' ? '▼' : '▶'}</span>
          </button>
          <div class="portal-sub-accordion-content" style="display: ${activeSubKey === 'datos' ? 'block' : 'none'};">
            <div class="personal-data-grid">
              <div class="personal-data-item">
                <div class="personal-data-label">Nombre del Alumno</div>
                <div class="personal-data-value">${escapeHTML(student.name)}</div>
              </div>
              <div class="personal-data-item">
                <div class="personal-data-label">ID Estudiante / Cédula</div>
                <div class="personal-data-value">${escapeHTML(student.studentId || student.id || '')}</div>
              </div>
              <div class="personal-data-item">
                <div class="personal-data-label">Salón / Grado</div>
                <div class="personal-data-value">Grado ${escapeHTML(student.grade || '3A')}</div>
              </div>
              <div class="personal-data-item">
                <div class="personal-data-label">Tutor / Acudiente</div>
                <div class="personal-data-value">${escapeHTML(student.parentName || '')}</div>
              </div>
              <div class="personal-data-item">
                <div class="personal-data-label">Contacto Tutor</div>
                <div class="personal-data-value">${escapeHTML(student.parentPhone || '')}</div>
              </div>
              <div class="personal-data-item">
                <div class="personal-data-label">Email Tutor</div>
                <div class="personal-data-value">${escapeHTML(student.parentEmail || '')}</div>
              </div>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 12px; justify-content: flex-end;">
              <button class="chubby-btn secondary chat-acudiente-btn" data-student-id="${student.id}" style="padding: 6px 12px; font-size: 0.8rem; height: 36px;">
                <span>💬 Chat Acudiente</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Accordion 3: Registro de Incidencias -->
        <div class="portal-sub-accordion ${activeSubKey === 'incid' ? 'active' : ''}" id="sub-acc-incid-${student.id}">
          <button class="portal-sub-accordion-header" onclick="toggleSubAccordion('${student.id}', 'incid')">
            <span>⚠️ Registro de Incidencias</span>
            <span class="chevron">${activeSubKey === 'incid' ? '▼' : '▶'}</span>
          </button>
          <div class="portal-sub-accordion-content" style="display: ${activeSubKey === 'incid' ? 'block' : 'none'};">
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div class="form-group" style="margin: 0;">
                <label style="font-weight: 800; font-size: 0.85rem; margin-bottom: 6px; display: block;">Describir Nueva Incidencia:</label>
                <textarea class="student-incident-input" data-student-id="${student.id}" placeholder="Ej: No entregó la tarea de Física o interrumpió la clase..." rows="2" style="width: 100%; border: 2px solid var(--text-main); border-radius: 10px; padding: 8px; font-family: 'Outfit'; resize: vertical; box-sizing: border-box; background: var(--card-bg); color: var(--text-main); font-size: 0.82rem;"></textarea>
              </div>
              <div style="display: flex; justify-content: flex-end;">
                <button class="chubby-btn primary save-incident-btn" data-student-id="${student.id}" style="padding: 6px 14px; font-size: 0.78rem; height: 32px;">
                  <span>➕ Guardar Incidencia</span>
                </button>
              </div>
              
              <div style="margin-top: 6px;">
                <label style="font-weight: 800; font-size: 0.85rem; display: block; margin-bottom: 4px;">Historial de Incidencias:</label>
                <div class="incident-feed" id="incident-feed-${student.id}">
                  <!-- Populated dynamically -->
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Accordion 4: Conducta -->
        <div class="portal-sub-accordion ${activeSubKey === 'cond' ? 'active' : ''}" id="sub-acc-cond-${student.id}">
          <button class="portal-sub-accordion-header" onclick="toggleSubAccordion('${student.id}', 'cond')">
            <span>🌟 Calificación de Conducta</span>
            <span class="chevron">${activeSubKey === 'cond' ? '▼' : '▶'}</span>
          </button>
          <div class="portal-sub-accordion-content" style="display: ${activeSubKey === 'cond' ? 'block' : 'none'};">
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 12px;">
                <div class="form-group" style="margin: 0;">
                  <label style="font-weight: 800; font-size: 0.85rem; margin-bottom: 6px; display: block;">Nivel:</label>
                  <select class="student-conduct-select" data-student-id="${student.id}" style="width: 100%; border: 2px solid var(--text-main); border-radius: 10px; padding: 8px; font-family: 'Outfit'; font-weight: bold; background: var(--card-bg); color: var(--text-main); font-size: 0.82rem;">
                    <option value="excelente" ${student.conduct === 'excelente' ? 'selected' : ''}>Excelente</option>
                    <option value="muy bueno" ${student.conduct === 'muy bueno' ? 'selected' : ''}>Muy Bueno</option>
                    <option value="adecuado" ${student.conduct === 'adecuado' ? 'selected' : ''}>Adecuado</option>
                    <option value="enfocado" ${student.conduct === 'enfocado' ? 'selected' : ''}>Enfocado</option>
                    <option value="conversador" ${student.conduct === 'conversador' ? 'selected' : ''}>Conversador</option>
                    <option value="necesita mejorar" ${student.conduct === 'necesita mejorar' ? 'selected' : ''}>Necesita Mejorar</option>
                  </select>
                </div>
                <div class="form-group" style="margin: 0;">
                  <label style="font-weight: 800; font-size: 0.85rem; margin-bottom: 6px; display: block;">Observaciones de Conducta:</label>
                  <input type="text" class="student-conduct-notes" data-student-id="${student.id}" value="${escapeHTML(student.conduct_text || student.conductText || '')}" placeholder="Ej: Participa activamente pero interrumpe a veces." style="width: 100%; border: 2px solid var(--text-main); border-radius: 10px; padding: 8px; font-family: 'Outfit'; font-weight: bold; box-sizing: border-box; background: var(--card-bg); color: var(--text-main); font-size: 0.82rem;">
                </div>
              </div>
              <div style="display: flex; justify-content: flex-end;">
                <button class="chubby-btn primary save-conduct-btn" data-student-id="${student.id}" style="padding: 6px 14px; font-size: 0.78rem; height: 32px;">
                  <span>💾 Guardar Conducta</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Accordion 5: Informe de Novedades -->
        <div class="portal-sub-accordion ${activeSubKey === 'noved' ? 'active' : ''}" id="sub-acc-noved-${student.id}">
          <button class="portal-sub-accordion-header" onclick="toggleSubAccordion('${student.id}', 'noved')">
            <span>📝 Informe de Novedades</span>
            <span class="chevron">${activeSubKey === 'noved' ? '▼' : '▶'}</span>
          </button>
          <div class="portal-sub-accordion-content" style="display: ${activeSubKey === 'noved' ? 'block' : 'none'};">
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <label style="font-weight: 800; font-size: 0.85rem; margin-bottom: 2px; display: block;">Seleccione Novedades Observadas:</label>
              <div class="novedad-checkbox-grid">
                <label class="novedad-checkbox-label">
                  <input type="checkbox" class="novedad-flag" data-student-id="${student.id}" value="Sin material de clase">
                  <span>🎒 Sin Material</span>
                </label>
                <label class="novedad-checkbox-label">
                  <input type="checkbox" class="novedad-flag" data-student-id="${student.id}" value="Falta de participación">
                  <span>🤐 Sin Participar</span>
                </label>
                <label class="novedad-checkbox-label">
                  <input type="checkbox" class="novedad-flag" data-student-id="${student.id}" value="No entregó tareas">
                  <span>❌ Sin Tareas</span>
                </label>
                <label class="novedad-checkbox-label">
                  <input type="checkbox" class="novedad-flag" data-student-id="${student.id}" value="Dificultad de aprendizaje">
                  <span>🧠 Dificultad</span>
                </label>
                <label class="novedad-checkbox-label">
                  <input type="checkbox" class="novedad-flag" data-student-id="${student.id}" value="Mejora sobresaliente">
                  <span>📈 Gran Mejora</span>
                </label>
                <label class="novedad-checkbox-label">
                  <input type="checkbox" class="novedad-flag" data-student-id="${student.id}" value="Problema médico/salud">
                  <span>🩺 Salud</span>
                </label>
              </div>

              <div class="form-group" style="margin: 0;">
                <label style="font-weight: 800; font-size: 0.85rem; margin-bottom: 6px; display: block;">Detalle o Comentarios Adicionales:</label>
                <textarea class="student-novelty-textarea" data-student-id="${student.id}" placeholder="Detalles específicos del informe..." rows="2" style="width: 100%; border: 2px solid var(--text-main); border-radius: 10px; padding: 8px; font-family: 'Outfit'; resize: vertical; box-sizing: border-box; background: var(--card-bg); color: var(--text-main); font-size: 0.82rem;"></textarea>
              </div>

              <div style="display: flex; justify-content: flex-end;">
                <button class="chubby-btn primary save-novelty-btn" data-student-id="${student.id}" style="padding: 6px 14px; font-size: 0.78rem; height: 32px;">
                  <span>💾 Guardar Informe</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    container.appendChild(card);

    // Load initial data for incidents, novelty reports, and trimester average
    renderStudentIncidents(student.id);
    loadStudentNoveltyReport(student.id);

    // Click logic to expand photo
    const photoWrapper = card.querySelector(".portal-student-photo-wrapper");
    if (photoWrapper) {
      photoWrapper.addEventListener("click", (e) => {
        e.stopPropagation();
        photoWrapper.classList.toggle("expanded");
      });
    }

    // Click logic to expand accordion ONLY when name is clicked
    const nameEl = card.querySelector(".portal-student-name");
    if (nameEl) {
      nameEl.addEventListener("click", (e) => {
        e.stopPropagation();
        const details = document.getElementById(`portal-details-${student.id}`);
        if (details) {
          const isHidden = details.classList.toggle("hidden");
          card.style.borderColor = isHidden ? "var(--text-main)" : "var(--color-cyan)";
        }
      });
    }

    // Attendance checkbox listener
    const attChk = card.querySelector(".portal-attendance-chk");
    if (attChk) {
      attChk.addEventListener("change", (e) => {
        const checked = e.target.checked;
        localStorage.setItem(`eduStudentAttendance_${student.id}`, checked ? "true" : "false");
        
        // Update in-memory state
        if (studentsData[student.id]) {
          studentsData[student.id].attendance = checked;
        }
        try {
          localStorage.setItem("eduStudentsData", JSON.stringify(studentsData));
        } catch(err) {}

        // Sincronizar en tiempo real con Supabase
        if (useSupabaseDb && supabaseClient) {
          supabaseClient
            .from('students')
            .update({ attendance: checked })
            .eq('id', student.id)
            .then(({ error }) => {
              if (error) {
                console.error("Error al actualizar asistencia en Supabase:", error);
              }
            });
        }

        // Re-render en el dashboard de administrador si está visible
        const adminView = document.getElementById("adminDashboardView");
        if (adminView && !adminView.classList.contains("hidden")) {
          renderStudentsList();
          if (activeStudent === student.id) {
            updateStudentDetails(student.id);
          }
        }

        showToast(`${student.name}: Asistencia ${checked ? 'marcada' : 'desmarcada (Ausencia)'}`, checked ? "✔" : "❌");
      });
    }

    // Input handlers for real-time grade calculations
    const gradeInputs = card.querySelectorAll(".activity-grade-input");
    gradeInputs.forEach(input => {
      const subject = input.getAttribute("data-subject");
      updateRealtimeUIForStudentSubject(student.id, subject);

      input.addEventListener("input", () => {
        updateRealtimeUIForStudentSubject(student.id, subject);
      });

      input.addEventListener("change", () => {
        saveAndSyncGrades(student.id, false);
      });
    });

    // Chat Acudiente Button listener
    const chatBtn = card.querySelector(".chat-acudiente-btn");
    if (chatBtn) {
      chatBtn.addEventListener("click", () => {
        openTeacherChat(student.id);
      });
    }

    // Save Grades Button listener
    const saveBtn = card.querySelector(".save-grades-btn");
    if (saveBtn) {
      saveBtn.addEventListener("click", async () => {
        await saveAndSyncGrades(student.id, true);
        
        // Update details in admin if it's the active student
        if (activeStudent === student.id) {
          updateStudentDetails(student.id);
        }
        renderStudentsList();
        renderLandingAulasList();
        renderLandingDocentesList();
        if (typeof renderDashboardStats === 'function') {
          renderDashboardStats();
        }
      });
    }

    // SIACE Sync Button listener
    const siaceSyncBtn = card.querySelector(".siace-sync-btn");
    if (siaceSyncBtn) {
      siaceSyncBtn.addEventListener("click", () => {
        openSiaceSyncModal(student.id);
      });
    }

    // Save Incident button listener
    const saveIncidentBtn = card.querySelector(".save-incident-btn");
    if (saveIncidentBtn) {
      saveIncidentBtn.addEventListener("click", async () => {
        const incidentTextArea = card.querySelector(`.student-incident-input[data-student-id="${student.id}"]`);
        if (!incidentTextArea) return;

        const text = incidentTextArea.value.trim();
        if (!text) {
          showToast("Escribe una descripción de la incidencia", "⚠️");
          return;
        }

        const now = new Date();
        const dateStr = now.toLocaleDateString();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let incidents = [];
        try {
          if (studentsData[student.id].incidents) {
            incidents = [...studentsData[student.id].incidents];
          } else {
            const stored = localStorage.getItem(`eduStudentIncidents_${student.id}`);
            if (stored) incidents = JSON.parse(stored);
          }
        } catch(e) {}

        incidents.push({
          text: text,
          date: dateStr,
          time: timeStr
        });

        // Save locally
        studentsData[student.id].incidents = incidents;
        localStorage.setItem(`eduStudentIncidents_${student.id}`, JSON.stringify(incidents));
        try {
          localStorage.setItem("eduStudentsData", JSON.stringify(studentsData));
        } catch(e) {}

        incidentTextArea.value = "";

        // Sync with Supabase
        if (useSupabaseDb && supabaseClient) {
          try {
            const { error } = await supabaseClient
              .from('students')
              .update({ incidents: incidents })
              .eq('id', student.id);
            if (error) {
              console.error("Error al guardar incidencias en Supabase:", error);
              showToast("Guardado local (Error al sincronizar con Supabase)", "⚠️");
            } else {
              showToast("Incidencia guardada y sincronizada con Supabase", "✅");
            }
          } catch(err) {
            console.error(err);
            showToast("Guardado local (Error de red)", "⚠️");
          }
        } else {
          showToast("Incidencia registrada con éxito", "✅");
        }

        renderStudentIncidents(student.id);

        // Update details in admin if it's the active student
        if (activeStudent === student.id) {
          updateStudentDetails(student.id);
        }
        renderStudentsList();
        renderLandingAulasList();
        renderLandingDocentesList();
        if (typeof renderDashboardStats === 'function') {
          renderDashboardStats();
        }
      });
    }

    // Save Conduct button listener
    const saveConductBtn = card.querySelector(".save-conduct-btn");
    if (saveConductBtn) {
      saveConductBtn.addEventListener("click", async () => {
        const select = card.querySelector(`.student-conduct-select[data-student-id="${student.id}"]`);
        const notesInput = card.querySelector(`.student-conduct-notes[data-student-id="${student.id}"]`);
        if (!select || !notesInput) return;

        const conductVal = select.value;
        const conductTextVal = notesInput.value.trim();

        // Update local data
        studentsData[student.id].conduct = conductVal;
        studentsData[student.id].conduct_text = conductTextVal;

        try {
          localStorage.setItem("eduStudentsData", JSON.stringify(studentsData));
        } catch(e) {}

        // Sincronizar con Supabase si está disponible
        if (useSupabaseDb && supabaseClient) {
          try {
            const { error } = await supabaseClient
              .from('students')
              .update({ conduct: conductVal, conduct_text: conductTextVal })
              .eq('id', student.id);
            if (error) {
              console.error("Error al sincronizar conducta en Supabase:", error);
              showToast("Guardado local (Error al sincronizar con base de datos)", "⚠️");
            } else {
              showToast("Conducta guardada y sincronizada con Supabase", "✅");
            }
          } catch(err) {
            console.error(err);
            showToast("Guardado local (Error de red)", "⚠️");
          }
        } else {
          showToast("Conducta guardada localmente", "✅");
        }

        // Update details in admin if it's the active student
        if (activeStudent === student.id) {
          updateStudentDetails(student.id);
        }
        renderStudentsList();
        renderLandingAulasList();
        renderLandingDocentesList();
        if (typeof renderDashboardStats === 'function') {
          renderDashboardStats();
        }
      });
    }

    // Save Novelty button listener
    const saveNoveltyBtn = card.querySelector(".save-novelty-btn");
    if (saveNoveltyBtn) {
      saveNoveltyBtn.addEventListener("click", async () => {
        const checkboxes = card.querySelectorAll(`.novedad-flag[data-student-id="${student.id}"]:checked`);
        const textarea = card.querySelector(`.student-novelty-textarea[data-student-id="${student.id}"]`);
        if (!textarea) return;

        const flags = Array.from(checkboxes).map(chk => chk.value);
        const detail = textarea.value.trim();

        const report = {
          flags: flags,
          detail: detail,
          updated_at: new Date().toISOString()
        };

        // Save locally
        studentsData[student.id].noveltyReport = report;
        localStorage.setItem(`eduStudentNovedades_${student.id}`, JSON.stringify(report));
        try {
          localStorage.setItem("eduStudentsData", JSON.stringify(studentsData));
        } catch(e) {}

        // Sync with Supabase
        if (useSupabaseDb && supabaseClient) {
          try {
            const { error } = await supabaseClient
              .from('students')
              .update({ novelty_report: report })
              .eq('id', student.id);
            if (error) {
              console.error("Error al guardar novedades en Supabase:", error);
              showToast("Guardado local (Error al sincronizar con Supabase)", "⚠️");
            } else {
              showToast("Novedades guardadas y sincronizadas con Supabase", "✅");
            }
          } catch(err) {
            console.error(err);
            showToast("Guardado local (Error de red)", "⚠️");
          }
        } else {
          showToast("Informe de novedades guardado con éxito", "📝");
        }

        // Update details in admin if it's the active student
        if (activeStudent === student.id) {
          updateStudentDetails(student.id);
        }
        renderStudentsList();
        renderLandingAulasList();
        renderLandingDocentesList();
        if (typeof renderDashboardStats === 'function') {
          renderDashboardStats();
        }
      });
    }

  });
}

/**
 * Shared helper: computes the average of a subject grades array.
 * Ignores empty strings, nulls, and non-numeric values.
 * Returns a string like "3.8" or "--" if no valid grades.
 */
function computeSubjectAverage(gradesArray) {
  if (!Array.isArray(gradesArray)) return '--';
  const valid = gradesArray.filter(g => g !== '' && g !== null && g !== undefined && !isNaN(parseFloat(g))).map(Number);
  if (valid.length === 0) return '--';
  return (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1);
}

function updateRealtimeUIForStudentSubject(studentId, subject) {
  const container = document.getElementById(`portal-grades-container-${studentId}`);
  if (!container) return;

  const inputs = container.querySelectorAll(`input.activity-grade-input[data-subject="${subject}"]`);
  const avgLabel = document.getElementById(`avg-label-${studentId}-${subject}`);
  if (!avgLabel) return;

  let sum = 0;
  let count = 0;
  let allValid = true;
  const currentValues = [];

  inputs.forEach(input => {
    const val = input.value.trim().replace(/,/g, '.');
    if (!val) {
      currentValues.push('');
      return;
    }

    const num = parseFloat(val);
    if (isNaN(num) || num < 1.0 || num > 5.0) {
      allValid = false;
      input.style.borderColor = "var(--color-orange)";
      currentValues.push('');
    } else {
      input.style.borderColor = "var(--text-main)";
      sum += num;
      count++;
      currentValues.push(val);
    }
  });

  if (!allValid) {
    avgLabel.textContent = "Inválido ⚠️";
    avgLabel.style.borderColor = "var(--color-orange)";
    avgLabel.style.color = "var(--color-orange)";
  } else if (count > 0) {
    // Use the shared helper on the current input values so teacher & parent see same average
    const avg = computeSubjectAverage(currentValues);
    avgLabel.textContent = `Promedio: ${avg}`;
    avgLabel.style.borderColor = "var(--text-main)";
    avgLabel.style.color = "var(--text-main)";
  } else {
    avgLabel.textContent = "Promedio: --";
    avgLabel.style.borderColor = "var(--text-main)";
    avgLabel.style.color = "var(--text-main)";
  }

  // Update trimester overall average
  updateTrimesterAverageForStudent(studentId);
}


async function saveAndSyncGrades(studentId, showToastNotification = false) {
  const student = studentsData[studentId];
  if (!student) return;

  const card = document.getElementById(`portal-student-${studentId}`);
  if (!card) return;

  const teacher = teachersData[activeTeacher];
  const teacherSubjects = teacher ? teacher.subjects || [] : [];
  const activeTrimester = teacher ? teacher.active_trimester || 1 : 1;

  let allValid = true;
  const gradesKeySuffix = `_T${activeTrimester}`;

  if (!student.subject_grades) {
    student.subject_grades = {};
  }

  // Calculate subject averages for the active trimester
  let trimesterSum = 0;
  let trimesterCount = 0;

  for (const sub of teacherSubjects) {
    const inputs = card.querySelectorAll(`.activity-grade-input[data-subject="${sub}"]`);
    const gradesArray = [];

    inputs.forEach(input => {
      const val = input.value.trim().replace(/,/g, '.');
      if (!val) {
        gradesArray.push("");
        return;
      }
      const num = parseFloat(val);
      if (isNaN(num) || num < 1.0 || num > 5.0) {
        allValid = false;
        input.style.borderColor = "var(--color-orange)";
      } else {
        input.style.borderColor = "";
        gradesArray.push(val);
      }
    });

    if (allValid) {
      const subjectKey = `${sub}${gradesKeySuffix}`;
      localStorage.setItem(`eduStudentGradesJSON_${studentId}_${subjectKey}`, JSON.stringify(gradesArray));
      student.subject_grades[subjectKey] = gradesArray;
      
      const avgStr = computeSubjectAverage(gradesArray);
      if (avgStr !== '--') {
        trimesterSum += parseFloat(avgStr);
        trimesterCount++;
      }
    }
  }

  if (!allValid) {
    if (showToastNotification) {
      showToast("Corrige las notas inválidas (deben estar entre 1.0 y 5.0)", "⚠️");
    }
    return;
  }

  // Initialize student.grades if empty or not length 4
  if (!Array.isArray(student.grades) || student.grades.length < 4) {
    student.grades = [0, 0, 0, 0];
  }

  // Update the active trimester average
  const currentTrimesterAvg = trimesterCount > 0 ? parseFloat((trimesterSum / trimesterCount).toFixed(1)) : 0.0;
  student.grades[activeTrimester - 1] = currentTrimesterAvg;

  // Set any trimesters beyond the active trimester to 0
  for (let t = activeTrimester; t < 3; t++) {
    student.grades[t] = 0.0;
  }

  // Calculate the overall final average (index 3) based on trimesters that have been worked on
  let activeTrimestersSum = 0;
  let activeTrimestersCount = 0;
  for (let t = 0; t < 3; t++) {
    if (t < activeTrimester) {
      activeTrimestersSum += student.grades[t];
      activeTrimestersCount++;
    }
  }
  student.grades[3] = activeTrimestersCount > 0 ? parseFloat((activeTrimestersSum / activeTrimestersCount).toFixed(1)) : 0.0;

  try {
    localStorage.setItem("eduStudentsData", JSON.stringify(studentsData));
  } catch(e) {}

  if (useSupabaseDb && supabaseClient) {
    try {
      let { error } = await supabaseClient
        .from('students')
        .update({ 
          grades: student.grades, 
          subject_grades: student.subject_grades 
        })
        .eq('id', studentId);

      if (error) {
        console.warn("Fallo al actualizar con subject_grades, intentando fallback:", error);
        const fallback = await supabaseClient
          .from('students')
          .update({ grades: student.grades })
          .eq('id', studentId);
        error = fallback.error;
      }

      if (showToastNotification) {
        if (error) {
          console.error("Error al sincronizar calificaciones con Supabase:", error);
          showToast("Guardado local (Error al sincronizar con Supabase)", "⚠️");
        } else {
          showToast("Calificaciones guardadas y sincronizadas con Supabase", "✅");
        }
      }
    } catch(err) {
      console.error("Error al sincronizar calificaciones con Supabase:", err);
      if (showToastNotification) {
        showToast("Guardado local (Error de red)", "⚠️");
      }
    }
  } else {
    if (showToastNotification) {
      showToast("Calificaciones guardadas localmente", "✅");
    }
  }

  // After successful save, also refresh parent dashboard if open and watching this student
  const parentView = document.getElementById("parentDashboardView");
  if (parentView && !parentView.classList.contains("hidden") && activeParentStudentId === studentId) {
    // Sync trimester before refreshing parent view so T2/T3 grades show immediately
    const studentForParent = studentsData[studentId];
    if (studentForParent && typeof teachersData !== 'undefined') {
      const adviserForParent = Object.values(teachersData).find(t => t.assigned_grade === studentForParent.grade);
      if (adviserForParent && adviserForParent.active_trimester) {
        parentFollowsTeacher = true;
        parentSelectedTrimester = adviserForParent.active_trimester;
      }
    }
    if (typeof renderParentDashboardData === 'function') {
      renderParentDashboardData(studentId);
    }
  }
}

/**
 * Syncs grades stored in localStorage (eduStudentGradesJSON_) to Supabase
 * for all students of the active teacher. Called once on teacher dashboard load
 * to ensure that grades previously entered locally (before Supabase sync was available)
 * are pushed to the database so the parent portal can see them.
 */
async function syncLocalGradesToSupabase() {
  if (!useSupabaseDb || !supabaseClient) return;
  const teacher = teachersData[activeTeacher];
  if (!teacher) return;
  const teacherSubjects = teacher.subjects || [];
  if (teacherSubjects.length === 0) return;

  const grade = teacher.assigned_grade;
  const studentsInGrade = Object.values(studentsData || {}).filter(s => s.grade === grade);

  for (const student of studentsInGrade) {
    if (!student.subject_grades) student.subject_grades = {};

    let needsSync = false;

    // Loop through all three trimesters to sync trimester-specific grades
    for (let t = 1; t <= 3; t++) {
      for (const subject of teacherSubjects) {
        const subjectKey = `${subject}_T${t}`;
        const hasSupabaseGrades = Array.isArray(student.subject_grades[subjectKey]) &&
          student.subject_grades[subjectKey].some(g => g !== '' && g !== null && g !== undefined);

        if (!hasSupabaseGrades) {
          const lsKey = `eduStudentGradesJSON_${student.id}_${subjectKey}`;
          try {
            const stored = localStorage.getItem(lsKey);
            if (stored) {
              const arr = JSON.parse(stored);
              if (Array.isArray(arr) && arr.some(g => g !== '' && g !== null && g !== undefined)) {
                student.subject_grades[subjectKey] = arr;
                needsSync = true;
              }
            }
          } catch(e) {}
        }
      }
    }

    if (needsSync) {
      // Recompute grades array [T1, T2, T3, Final] for the student
      const activeTrimester = teacher.active_trimester || 1;
      let newGrades = [0.0, 0.0, 0.0, 0.0];
      
      // Calculate averages for each trimester
      for (let t = 1; t <= 3; t++) {
        if (t > activeTrimester) {
          newGrades[t - 1] = 0.0;
          continue;
        }
        
        let trimesterSum = 0;
        let trimesterCount = 0;
        for (const subject of teacherSubjects) {
          const subjectKey = `${subject}_T${t}`;
          const gradesArr = student.subject_grades[subjectKey] || [];
          const avgStr = computeSubjectAverage(gradesArr);
          if (avgStr !== '--') {
            trimesterSum += parseFloat(avgStr);
            trimesterCount++;
          }
        }
        newGrades[t - 1] = trimesterCount > 0 ? parseFloat((trimesterSum / trimesterCount).toFixed(1)) : 0.0;
      }
      
      // Calculate the final average based on active trimesters
      let activeTrimestersSum = 0;
      let activeTrimestersCount = 0;
      for (let t = 0; t < 3; t++) {
        if (t < activeTrimester) {
          activeTrimestersSum += newGrades[t];
          activeTrimestersCount++;
        }
      }
      newGrades[3] = activeTrimestersCount > 0 ? parseFloat((activeTrimestersSum / activeTrimestersCount).toFixed(1)) : 0.0;
      
      student.grades = newGrades;
      
      try {
        const { error } = await supabaseClient
          .from('students')
          .update({
            grades: student.grades,
            subject_grades: student.subject_grades
          })
          .eq('id', student.id);
        if (error) {
          console.warn(`syncLocalGradesToSupabase: error syncing ${student.id}:`, error);
        } else {
          console.log(`syncLocalGradesToSupabase: synced grades for ${student.name}`);
        }
      } catch(err) {
        console.warn(`syncLocalGradesToSupabase: exception for ${student.id}:`, err);
      }
    }
  }

  // Save updated studentsData to localStorage
  try {
    localStorage.setItem("eduStudentsData", JSON.stringify(studentsData));
  } catch(e) {}
}

// ---- Teacher Chat: Helper functions for the integrated chat screen ----

function resetTeacherChatRightPanel() {
  const placeholder = document.getElementById("teacherChatPlaceholder");
  const tutorArea = document.getElementById("teacherTutorChatArea");
  const staffBox = document.getElementById("teacherDirectChatBox");
  const inputBar = document.getElementById("teacherChatInputBar");
  const header = document.getElementById("teacherActiveChatHeader");

  if (placeholder) placeholder.style.display = "flex";
  if (tutorArea) tutorArea.style.display = "none";
  if (staffBox) staffBox.classList.add("hidden");
  if (inputBar) inputBar.style.display = "none";
  if (header) header.style.display = "none";
}

function renderTutorContactsList(activeStudentId) {
  const container = document.getElementById("teacherTutorContactsList");
  if (!container) return;
  container.innerHTML = "";

  const teacher = teachersData[activeTeacher];
  if (!teacher) {
    container.innerHTML = `<p class="chat-placeholder">No tienes un grado asignado.</p>`;
    return;
  }
  const grade = teacher.assigned_grade;
  const students = Object.values(studentsData || {})
    .filter(s => s.grade === grade)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (students.length === 0) {
    container.innerHTML = `<p class="chat-placeholder">No hay alumnos en tu grado asignado.</p>`;
    return;
  }

  students.forEach(student => {
    const isActive = student.id === activeStudentId;
    const item = document.createElement("div");
    item.className = "staff-list-item" + (isActive ? " active-contact" : "");
    item.style.cursor = "pointer";

    let avatarHTML;
    if (student.isImgPath || (student.img && (student.img.includes('/') || student.img.startsWith('data:image/')))) {
      avatarHTML = `<img src="${student.img}" alt="${student.name}" style="width:38px;height:38px;border-radius:50%;object-fit:cover;border:2px solid var(--text-main);">`;
    } else {
      const grad = getRandomGradientClass(student.id);
      avatarHTML = `<div class="avatar-fallback ${grad}" style="width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:0.85rem;border:2px solid var(--text-main);flex-shrink:0;">${student.img || "?"}</div>`;
    }

    item.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;flex:1;">
        ${avatarHTML}
        <div style="display:flex;flex-direction:column;line-height:1.3;min-width:0;">
          <strong style="color:var(--text-main);font-size:0.85rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(student.name)}</strong>
          <span style="font-size:0.72rem;color:var(--text-sub);font-weight:600;">👪 ${escapeHTML(student.parentName || "Tutor")}</span>
        </div>
      </div>
      <span style="font-size:1rem;color:var(--text-main);font-weight:bold;">💬</span>
    `;
    item.addEventListener("click", () => {
      showTeacherTutorChat(student.id);
    });
    container.appendChild(item);
  });
}

function showTeacherTutorChat(studentId) {
  activeStudent = studentId;
  const student = studentsData[studentId];
  if (!student) return;

  // Navigate to Mensajería tab
  const teacherChatScreen = document.getElementById("teacherChatScreen");
  const navTeacherChat = document.getElementById("navTeacherChat");
  if (teacherChatScreen) {
    ["teacherAppScreen", "teacherPlanningScreen"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add("hidden");
    });
    teacherChatScreen.classList.remove("hidden");
  }
  // Ensure Tutor tab is active
  teacherActiveChatType = "tutor";
  const btnTutor = document.getElementById("teacherBtnChatTutor");
  const btnStaff = document.getElementById("teacherBtnChatStaff");
  if (btnTutor) btnTutor.classList.add("active");
  if (btnStaff) btnStaff.classList.remove("active");

  // Switch left column to tutor contacts
  const staffListArea = document.getElementById("teacherStaffListArea");
  const tutorContactsList = document.getElementById("teacherTutorContactsList");
  if (staffListArea) staffListArea.classList.add("hidden");
  if (tutorContactsList) tutorContactsList.style.display = "flex";

  // Highlight selected student
  renderTutorContactsList(studentId);

  // Show right panel: tutor chat
  const placeholder = document.getElementById("teacherChatPlaceholder");
  const tutorArea = document.getElementById("teacherTutorChatArea");
  const staffBox = document.getElementById("teacherDirectChatBox");
  const inputBar = document.getElementById("teacherChatInputBar");
  const header = document.getElementById("teacherActiveChatHeader");
  const partnerInfo = document.getElementById("teacherChatPartnerInfo");

  if (placeholder) placeholder.style.display = "none";
  if (staffBox) staffBox.classList.add("hidden");
  if (tutorArea) tutorArea.style.display = "flex";
  if (inputBar) { inputBar.style.display = "flex"; }
  if (header) header.style.display = "flex";

  if (partnerInfo) {
    partnerInfo.innerHTML = `
      <span style="font-size:1.1rem;">👪</span>
      <div style="display:flex;flex-direction:column;line-height:1.2;">
        <strong style="font-size:0.88rem;color:var(--text-main);">${escapeHTML(student.parentName || "Tutor")}</strong>
        <span style="font-size:0.7rem;color:var(--text-sub);">Acudiente de ${escapeHTML(student.name)}</span>
      </div>
    `;
  }

  // Update input placeholder
  const inputField = document.getElementById("teacherChatInputField");
  if (inputField) inputField.placeholder = `Escribe un mensaje al tutor de ${student.name.split(" ")[0]}...`;

  // Update nav button styles
  [document.getElementById("navTeacherAlumnos"), document.getElementById("navTeacherPlanificacion")].forEach(b => {
    if (b) { b.classList.remove("primary"); b.classList.add("secondary"); }
  });
  if (navTeacherChat) { navTeacherChat.classList.remove("secondary"); navTeacherChat.classList.add("primary"); }

  // Load messages
  loadTeacherChatMessages(studentId);
}

function openTeacherChat(studentId) {
  // Redirects to the integrated Mensajería screen instead of the old overlay
  showTeacherTutorChat(studentId);
}

function closeTeacherChat() {
  // No-op: there is no overlay to close now. Navigate back to Alumnos tab.
  const navAlumnos = document.getElementById("navTeacherAlumnos");
  if (navAlumnos) navAlumnos.click();
}

async function handleTeacherChatFileSelection(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Validate type
  const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".xls", ".xlsx"];
  const fileNameLower = file.name.toLowerCase();
  const isAllowed = allowedExtensions.some(ext => fileNameLower.endsWith(ext));

  if (!isAllowed) {
    showToast("Solo se permiten archivos PDF, imágenes (JPG, PNG), Word o Excel", "⚠️");
    return;
  }

  // Validate size (limit to 50MB)
  const isOnline = useSupabaseDb && supabaseClient;
  const sizeLimit = 50 * 1024 * 1024;
  if (file.size > sizeLimit) {
    showToast(`El archivo es demasiado grande (máximo 50MB)`, "⚠️");
    return;
  }

  showToast(`Subiendo ${file.name}...`, "⏳");

  try {
    const fileUrl = await uploadFileToBucket(file, "school-assets", "chat");
    if (!fileUrl) {
      showToast("Fallo al procesar el archivo", "❌");
      return;
    }

    const teacher = teachersData[activeTeacher];
    if (!teacher) return;

    const filePayload = {
      name: file.name,
      type: file.type,
      data: fileUrl
    };

    const isStaff = teacherActiveChatType === "staff";
    const msgPayload = isStaff ? {
      sender: getCurrentUserId() || teacher.id,
      receiver: typeof activeTeacherChatPartner !== 'undefined' ? activeTeacherChatPartner : "admin",
      content: JSON.stringify({ text: `Archivo: ${file.name}`, file: filePayload }),
      created_at: new Date().toISOString()
    } : {
      sender: teacher.name,
      content: JSON.stringify({ text: `Archivo: ${file.name}`, file: filePayload }),
      is_sent_by_prof: true,
      student_key: activeStudent,
      created_at: new Date().toISOString()
    };

    // Reset file input
    e.target.value = "";

    // Persist
    if (isOnline) {
      const targetTable = isStaff ? 'staff_messages' : 'chat_messages';
      const { error } = await supabaseClient.from(targetTable).insert([msgPayload]);
      if (error) {
        console.error("Error sending file to Supabase:", error);
        showToast("Error DB: " + (error.message || "Error al guardar el archivo en el chat"), "❌");
      } else {
        showToast("Archivo enviado con éxito", "✅");
        loadTeacherChatMessages(activeStudent);
      }
    } else {
      if (isStaff) {
        let list = [];
        try {
          const stored = localStorage.getItem("eduStaffMessages");
          if (stored) list = JSON.parse(stored);
        } catch(e) {}
        list.push(msgPayload);
        localStorage.setItem("eduStaffMessages", JSON.stringify(list));
        appendMessageToArea(msgPayload, document.getElementById("teacherChatArea"), true);
        showToast("Archivo enviado con éxito", "✅");
      } else {
        if (!mockMessages[activeStudent]) {
          mockMessages[activeStudent] = [];
        }
        mockMessages[activeStudent].push(msgPayload);
        appendTeacherSingleMessageToUI(msgPayload);
        showToast("Archivo enviado con éxito", "✅");

        // Simulate parents reply
        setTimeout(() => {
          const currentStudent = studentsData[activeStudent];
          if (!currentStudent) return;

          const replyPayload = {
            sender: currentStudent.parentName,
            content: `¡Recibido! Acabo de ver el archivo "${file.name}". Muchas gracias.`,
            is_sent_by_prof: false,
            student_key: activeStudent,
            created_at: new Date().toISOString()
          };

          mockMessages[activeStudent].push(replyPayload);

          if (activeStudent === currentStudent.id && teacherActiveChatType === "tutor") {
            appendMessageToArea(replyPayload, document.getElementById("teacherChatArea"), false);
            showToast("Mensaje entrante del tutor", "💬");
          }
        }, 1500);
      }
    }
  } catch(err) {
    console.error("Error en handleTeacherChatFileSelection:", err);
    showToast("Error al procesar el archivo", "❌");
  }
}

async function handleAdminChatFileSelection(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Validate type
  const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".xls", ".xlsx"];
  const fileNameLower = file.name.toLowerCase();
  const isAllowed = allowedExtensions.some(ext => fileNameLower.endsWith(ext));

  if (!isAllowed) {
    showToast("Solo se permiten archivos PDF, imágenes (JPG, PNG), Word o Excel", "⚠️");
    return;
  }

  // Validate size (limit to 50MB)
  const isOnline = useSupabaseDb && supabaseClient;
  const sizeLimit = 50 * 1024 * 1024;
  if (file.size > sizeLimit) {
    showToast(`El archivo es demasiado grande (máximo 50MB)`, "⚠️");
    return;
  }

  showToast(`Subiendo ${file.name}...`, "⏳");

  try {
    const fileUrl = await uploadFileToBucket(file, "school-assets", "chat");
    if (!fileUrl) {
      showToast("Fallo al procesar el archivo", "❌");
      return;
    }

    const filePayload = {
      name: file.name,
      type: file.type,
      data: fileUrl
    };

    const isStaff = adminActiveChatType === "staff";
    let msgPayload;

    if (isStaff) {
      const myId = getCurrentUserId();
      const partnerId = activeAdminChatPartner;
      if (!partnerId) return;

      msgPayload = {
        sender: myId,
        receiver: partnerId,
        content: JSON.stringify({ text: `Archivo: ${file.name}`, file: filePayload }),
        created_at: new Date().toISOString()
      };
    } else {
      const senderName = activeAdminUser ? `Prof. ${activeAdminUser.name}` : "Prof. Egnis Cano";
      msgPayload = {
        sender: senderName,
        content: JSON.stringify({ text: `Archivo: ${file.name}`, file: filePayload }),
        is_sent_by_prof: true,
        student_key: activeStudent,
        created_at: new Date().toISOString()
      };
    }

    // Reset file input
    e.target.value = "";

    // Persist
    if (isOnline) {
      const targetTable = isStaff ? 'staff_messages' : 'chat_messages';
      const { error } = await supabaseClient.from(targetTable).insert([msgPayload]);
      if (error) {
        console.error("Error sending file to Supabase:", error);
        showToast("Error DB: " + (error.message || "Error al guardar el archivo en el chat"), "❌");
      } else {
        showToast("Archivo enviado con éxito", "✅");
        loadChatHistory(adminActiveChatType, isStaff ? activeAdminChatPartner : activeStudent, chatArea);
      }
    } else {
      if (isStaff) {
        let list = [];
        try {
          const stored = localStorage.getItem("eduStaffMessages");
          if (stored) list = JSON.parse(stored);
        } catch(e) {}
        list.push(msgPayload);
        localStorage.setItem("eduStaffMessages", JSON.stringify(list));
        appendMessageToArea(msgPayload, chatArea, true);
        showToast("Archivo enviado con éxito", "✅");
      } else {
        if (!mockMessages[activeStudent]) {
          mockMessages[activeStudent] = [];
        }
        mockMessages[activeStudent].push(msgPayload);
        appendMessageToArea(msgPayload, chatArea, false);
        showToast("Archivo enviado con éxito", "✅");
      }
    }
  } catch(err) {
    console.error("Error en handleAdminChatFileSelection:", err);
    showToast("Error al procesar el archivo", "❌");
  }
}

window.openImageModal = function(src) {
  let modal = document.getElementById("chatImageZoomModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "chatImageZoomModal";
    modal.className = "chat-image-modal";
    modal.innerHTML = `<img id="chatZoomedImg" src="">`;
    modal.addEventListener("click", () => {
      modal.classList.remove("active");
    });
    document.body.appendChild(modal);
  }
  const img = modal.querySelector("#chatZoomedImg");
  if (img) img.src = src;
  
  modal.classList.add("active");
};

async function loadTeacherChatMessages(studentKey) {
  const teacherChatArea = document.getElementById("teacherChatArea");
  loadChatHistory(teacherActiveChatType, studentKey, teacherChatArea);
}

function renderTeacherChatMessages(msgList) {
  const teacherChatArea = document.getElementById("teacherChatArea");
  renderHistoryList(msgList, teacherChatArea, teacherActiveChatType === "staff");
}

function appendTeacherSingleMessageToUI(msg) {
  const teacherChatArea = document.getElementById("teacherChatArea");
  appendMessageToArea(msg, teacherChatArea, teacherActiveChatType === "staff");
}

async function sendTeacherMessage() {
  const inputField = document.getElementById("teacherChatInputField");
  if (!inputField) return;

  const text = inputField.value.trim();
  if (!text) return;

  const teacher = teachersData[activeTeacher];
  if (!teacher) return;

  const teacherChatArea = document.getElementById("teacherChatArea");

  if (teacherActiveChatType === "staff") {
    const myId = getCurrentUserId();
    const partnerId = activeTeacherChatPartner;
    if (!partnerId) return;

    const msgPayload = {
      sender: myId,
      receiver: partnerId,
      content: text,
      created_at: new Date().toISOString()
    };

    inputField.value = "";

    if (useSupabaseDb && supabaseClient) {
      try {
        const { error } = await supabaseClient.from('staff_messages').insert([msgPayload]);
        if (error) {
          console.error("Error al guardar mensaje de personal en Supabase:", error);
          showToast("Error de conexión al guardar mensaje", "❌");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      let list = [];
      try {
        const stored = localStorage.getItem("eduStaffMessages");
        if (stored) list = JSON.parse(stored);
      } catch(e) {}
      list.push(msgPayload);
      localStorage.setItem("eduStaffMessages", JSON.stringify(list));
      appendMessageToArea(msgPayload, document.getElementById("teacherStaffChatArea"), true);
    }
  } else {
    const msgPayload = {
      sender: teacher.name,
      content: text,
      is_sent_by_prof: true,
      student_key: activeStudent,
      created_at: new Date().toISOString()
    };

    inputField.value = "";

    if (useSupabaseDb && supabaseClient) {
      try {
        const { error } = await supabaseClient.from('chat_messages').insert([msgPayload]);
        if (error) {
          console.error("Error sending message to Supabase:", error);
          showToast("Error de conexión al guardar mensaje", "❌");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      if (!mockMessages[activeStudent]) {
        mockMessages[activeStudent] = [];
      }
      mockMessages[activeStudent].push(msgPayload);
      appendMessageToArea(msgPayload, teacherChatArea, false);

      // Simulate parent reply in demo mode
      setTimeout(() => {
        const currentStudent = studentsData[activeStudent];
        if (!currentStudent) return;

        const replies = [
          `¡Entendido Profesor! Muchas gracias por el aviso. Estaré al pendiente.`,
          `Buenas tardes profesor. Sí, perfecto. Revisaremos la materia juntos hoy por la tarde.`,
          `Excelente, agradezco mucho su dedicación y comunicación directa con la familia.`,
          `Hola. Perfecto, me conectaré a la reunión de padres de la próxima semana.`
        ];
        const replyText = replies[Math.floor(Math.random() * replies.length)];

        const replyPayload = {
          sender: currentStudent.parentName,
          content: replyText,
          is_sent_by_prof: false,
          student_key: activeStudent,
          created_at: new Date().toISOString()
        };

        mockMessages[activeStudent].push(replyPayload);

        if (activeStudent === currentStudent.id && teacherActiveChatType === "tutor") {
          appendMessageToArea(replyPayload, teacherChatArea, false);
          showToast("Mensaje entrante del tutor", "💬");
        }
      }, 1500);
    }
  }
}

// ==========================================================================
// 12. SIACE & BULLETIN SYNC AND MIGRATION MODULE LOGIC
// ==========================================================================

let siaceSyncTimer = null;

function openSiaceSyncModal(studentKey) {
  const student = studentsData[studentKey];
  if (!student) return;

  const modal = document.getElementById("siaceModal");
  if (!modal) return;

  // Set student details
  document.getElementById("siaceModalStudentName").textContent = `Estudiante: ${student.name}`;
  document.getElementById("siaceModalStudentId").textContent = `Cédula: ${student.cedula || 'No Registrada'}`;

  // Reset progress and log
  const fill = document.getElementById("siaceProgressFill");
  const percentText = document.getElementById("siaceProgressPercent");
  const statusText = document.getElementById("siaceProgressStatus");
  const logBox = modal.querySelector(".siace-log-box");
  const summaryBox = document.getElementById("siaceSummaryBox");
  const confirmBtn = document.getElementById("siaceModalConfirmBtn");

  fill.style.width = "0%";
  percentText.textContent = "0%";
  statusText.textContent = "Listo para iniciar";
  logBox.innerHTML = `<div style="color: #6b7280;">[SISTEMA] Enlace listo. Presiona 'Comenzar Sincronización'.</div>`;
  summaryBox.classList.add("hidden");
  confirmBtn.classList.remove("hidden");
  confirmBtn.disabled = false;
  confirmBtn.querySelector("span").textContent = "Comenzar Sincronización";

  modal.classList.remove("hidden");

  // Clear any existing simulation timer
  if (siaceSyncTimer) clearInterval(siaceSyncTimer);

  // Bind click listener for starting
  confirmBtn.onclick = () => {
    confirmBtn.disabled = true;
    confirmBtn.querySelector("span").textContent = "Sincronizando...";
    
    let progress = 0;
    logBox.innerHTML = "";
    
    const addLog = (msg) => {
      const time = new Date().toLocaleTimeString([], { hour12: false });
      logBox.innerHTML += `<div>[${time}] ${msg}</div>`;
      logBox.scrollTop = logBox.scrollHeight;
    };

    addLog("⚡ Iniciando proceso de sincronización con SIACE...");

    const steps = [
      { p: 10, status: "Estableciendo conexión...", log: "CONEXIÓN: Abriendo túnel seguro HTTPS con el portal SIACE MEDUCA..." },
      { p: 25, status: "Conectado al servidor SIACE", log: "CONEXIÓN: Enlace seguro SSL establecido. Latencia de red: 38ms." },
      { p: 40, status: "Autenticando institución...", log: "AUTENTICACIÓN: Validando credenciales de firma electrónica institucional..." },
      { p: 55, status: "Verificando matrícula...", log: `DATOS: Validando cédula ${student.cedula || 'N/A'} con base de datos de matrícula SIACE... Encontrado.` },
      { p: 70, status: "Calculando promedios...", log: "DATOS: Compilando calificaciones registradas y promedios finales..." },
      { p: 85, status: "Transmitiendo notas...", log: "SINCRONIZACIÓN: Transmitiendo promedios acumulados por asignatura..." },
      { p: 95, status: "Guardando cambios...", log: "SINCRONIZACIÓN: Grabando promedios y solicitando hash de confirmación..." },
      { p: 100, status: "Sincronización Exitosa", log: "COMPLETADO: Transacción completada con éxito. Cierre de canal seguro SIACE." }
    ];

    let currentStepIdx = 0;

    siaceSyncTimer = setInterval(() => {
      if (currentStepIdx >= steps.length) {
        clearInterval(siaceSyncTimer);
        
        // Hide trigger button
        confirmBtn.classList.add("hidden");
        
        // Calculate grades averages sync summary
        const studentGrade = student.grade || "2B";
        const teachersForGrade = Object.values(teachersData || {}).filter(t => t.assigned_grade === studentGrade);
        const subjects = [];
        teachersForGrade.forEach(t => {
          if (t.subjects) {
            t.subjects.forEach(s => {
              if (!subjects.includes(s)) subjects.push(s);
            });
          }
        });
        if (subjects.length === 0) {
          subjects.push("Español", "Religión, Moral y Valores", "Ciencias Sociales", "Inglés", "Expresión Artística", "Matemáticas", "Ciencias Naturales", "Salud y Educación Física");
        }

        const summaryGradesContainer = document.getElementById("siaceSummaryGrades");
        summaryGradesContainer.innerHTML = "";

        let totalSum = 0;
        let count = 0;

        const adviser = Object.values(teachersData || {}).find(t => t && t.assigned_grade === studentGrade);
        const activeTrimester = adviser ? adviser.active_trimester || 1 : 1;

        subjects.forEach((subj, idx) => {
          let val = 0.0;
          const subjectKey = `${subj}_T${activeTrimester}`;
          if (student.subject_grades && student.subject_grades[subjectKey]) {
            const activeGradesNums = student.subject_grades[subjectKey].filter(Boolean).map(Number);
            val = activeGradesNums.length > 0 ? (activeGradesNums.reduce((a, b) => a + b, 0) / activeGradesNums.length) : 0.0;
          } else {
            const score = student.grades && student.grades[activeTrimester - 1];
            val = parseFloat(score !== undefined && score !== null ? score : 0.0);
          }
          if (val === 0.0) val = 4.0; // Fallback default
          
          totalSum += val;
          count++;

          summaryGradesContainer.innerHTML += `
            <div style="display:flex; justify-content:space-between; padding: 2px 4px; border-bottom: 1px dashed rgba(0,0,0,0.05);">
              <span style="font-weight:600; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:140px;">${subj}</span>
              <strong style="color:var(--color-purple);">${val.toFixed(1)}</strong>
            </div>
          `;
        });

        // Set code
        const codeEl = document.getElementById("siaceTransactionCode");
        const txCode = `SIACE-2025-${Math.floor(100000 + Math.random() * 900000)}`;
        codeEl.textContent = txCode;

        summaryBox.classList.remove("hidden");
        showToast(`SIACE Sincronizado para ${student.name}`, "✅");
        return;
      }

      const step = steps[currentStepIdx];
      progress = step.p;
      fill.style.width = `${progress}%`;
      percentText.textContent = `${progress}%`;
      statusText.textContent = step.status;
      addLog(step.log);
      
      currentStepIdx++;
    }, 600);
  };
}

function openBulletinModal(studentKey) {
  try {
    console.log("Generando boletín para el estudiante:", studentKey);
    const student = studentsData[studentKey];
    if (!student) {
      showToast("Estudiante no encontrado en la base de datos", "⚠️");
      return;
    }

    const modal = document.getElementById("bulletinModal");
    if (!modal) {
      showToast("Error: No se encontró la interfaz del boletín", "❌");
      return;
    }

    // Close any active sliding drawers in the administrator panel to avoid visual overlays
    const drawers = ["teachersDrawer", "studentsDrawer", "settingsDrawer", "financeDrawer"];
    drawers.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add("hidden");
        el.classList.remove("open");
      }
    });
    document.body.classList.remove("drawer-open");

    // Close admin dropdown menu
    const adminDropdownMenu = document.getElementById("adminDropdownMenu");
    if (adminDropdownMenu) {
      adminDropdownMenu.classList.add("hidden");
    }

    // Retrieve general school parameters
    const schoolName = localStorage.getItem("eduSchoolName") || "EduLink Academia";
    const schoolAddress = localStorage.getItem("eduSchoolAddress") || "Calle 50, Ciudad de Panamá";
    const schoolLogo = localStorage.getItem("eduSchoolLogo") || defaultSchoolLogo;
    const directorName = localStorage.getItem("eduAdminName") || "Egnis Cano";

    // Adviser
    const adviserTeacher = Object.values(teachersData || {}).find(t => t && t.assigned_grade === student.grade);
    const teacherName = adviserTeacher ? adviserTeacher.name : "Docente Consejero";

    const printArea = document.getElementById("bulletinPrintArea");
    if (printArea) {
      printArea.innerHTML = generateBulletinHTML(studentKey, student, teacherName, schoolName, schoolAddress, schoolLogo, directorName);
    }

    modal.classList.remove("hidden");
  } catch (err) {
    console.error("Error al generar el boletín escolar:", err);
    showToast("Error crítico al generar la vista previa del boletín", "❌");
  }
}

function generateBulletinHTML(studentKey, student, teacherName, schoolName, schoolAddress, schoolLogo, directorName) {
  const studentGrade = student.grade || "2B";
  const teachersForGrade = Object.values(teachersData || {}).filter(t => t && t.assigned_grade === studentGrade);
  const subjects = [];
  teachersForGrade.forEach(t => {
    if (t && Array.isArray(t.subjects)) {
      t.subjects.forEach(s => {
        if (s && !subjects.includes(s)) subjects.push(s);
      });
    }
  });
  if (subjects.length === 0) {
    subjects.push("ESPAÑOL", "RELIGION, MORAL Y VALORES", "CIENCIAS SOCIALES", "INGLES", "EXPRESION ARTISTICA", "MATEMATICA", "CIENCIAS NATURALES", "SALUD Y EDUCACION FISICA");
  }

  const getDeterministicVariance = (str, seed) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return ((Math.abs(hash + seed) % 9) - 4) * 0.1; // returns -0.4 to 0.4
  };

  const getGradeValue = (gradesArray, idx) => {
    if (!gradesArray) return 0.0;
    let val = 0.0;
    if (Array.isArray(gradesArray)) {
      val = parseFloat(gradesArray[idx]);
    } else if (typeof gradesArray === 'string') {
      try {
        const clean = gradesArray.replace(/{|}/g, '').split(',');
        val = parseFloat(clean[idx]);
      } catch(e) {
        val = 0.0;
      }
    }
    return isNaN(val) ? 0.0 : val;
  };

  const adviser = Object.values(teachersData || {}).find(t => t && t.assigned_grade === studentGrade);
  const activeTrimester = adviser ? adviser.active_trimester || 1 : 1;

  const getSubjectTrimesterGrade = (subj, trimNum) => {
    // If this trimester has not been reached yet, it must be 0.0
    if (trimNum > activeTrimester) {
      return 0.0;
    }

    // Try loading trimester-specific grades
    const key = `${subj}_T${trimNum}`;
    if (student.subject_grades && Array.isArray(student.subject_grades[key])) {
      const activeGradesNums = student.subject_grades[key].filter(Boolean).map(Number);
      if (activeGradesNums.length > 0) {
        return activeGradesNums.reduce((a, b) => a + b, 0) / activeGradesNums.length;
      }
    }

    // Fallback logic for previous trimesters (using base grade + deterministic variance if available)
    if (trimNum < activeTrimester) {
      const baseGrade = getGradeValue(student.grades, trimNum - 1);
      if (baseGrade > 0) {
        return Math.max(1.0, Math.min(5.0, baseGrade + getDeterministicVariance(subj, trimNum * 10)));
      }
    }

    return 0.0;
  };

  let totalAvgSum = 0;
  let count = 0;

  const tableRows = subjects.map((subj, i) => {
    let t1 = getSubjectTrimesterGrade(subj, 1);
    let t2 = getSubjectTrimesterGrade(subj, 2);
    let t3 = getSubjectTrimesterGrade(subj, 3);
    
    // Default fallback values if empty (new student with no grades entered yet)
    if (t1 === 0 && t2 === 0 && t3 === 0) {
      if (activeTrimester === 1) t1 = 4.0;
      else if (activeTrimester === 2) { t1 = 4.0; t2 = 4.0; }
      else { t1 = 4.0; t2 = 4.0; t3 = 4.0; }
    }

    let activeCount = 0;
    let sum = 0;
    if (activeTrimester >= 1) { sum += t1; activeCount++; }
    if (activeTrimester >= 2) { sum += t2; activeCount++; }
    if (activeTrimester >= 3) { sum += t3; activeCount++; }
    const avgFinal = activeCount > 0 ? (sum / activeCount) : 0.0;

    totalAvgSum += avgFinal;
    count++;

    const t1Str = t1 > 0 ? t1.toFixed(1) : "0.0";
    const t2Str = t2 > 0 ? t2.toFixed(1) : "0.0";
    const t3Str = t3 > 0 ? t3.toFixed(1) : "0.0";
    const avgFinalStr = avgFinal > 0 ? avgFinal.toFixed(1) : "0.0";

    // Attendance values
    // If student is Ausente (attendance === false) we mock 2 absences in Trimestre 3, else 0
    const isAbsent = student.attendance === false;
    const t1Aus = "0", t1Tar = "0";
    const t2Aus = "0", t2Tar = "0";
    const t3Aus = isAbsent ? "2" : "0";
    const t3Tar = isAbsent ? "1" : "0";

    return `
      <tr>
        <td class="left-align" style="font-weight: 800; text-transform: uppercase;">${subj}</td>
        <td>${t1Str}</td>
        <td>${t2Str}</td>
        <td>${t3Str}</td>
        <td style="font-weight: 900; background-color: #f9fafb;">${avgFinalStr}</td>
        <td>${t1Tar}</td>
        <td>${t1Aus}</td>
        <td>${t2Tar}</td>
        <td>${t2Aus}</td>
        <td>${t3Tar}</td>
        <td>${t3Aus}</td>
      </tr>
    `;
  }).join("");

  const bulletinGeneralAvg = count > 0 ? (totalAvgSum / count).toFixed(1) : "0.0";

  const habits = [
    "Responsabilidad",
    "Orden y Aseo",
    "Organización del Trabajo",
    "Autod. y Conf. en sí mismo",
    "Iniciativa",
    "Cooperación",
    "Respeto a la propiedad ajena"
  ];

  // Select habit marks based on conduct
  const conduct = student.conduct || "excelente";
  const habitRows = habits.map(h => {
    let iVal = "S", iiVal = "S", iiiVal = "S";
    if (conduct === "conversador" && h.startsWith("Autod.")) {
      iVal = "R"; iiVal = "S"; iiiVal = "R";
    } else if (conduct === "necesita mejorar") {
      if (h.startsWith("Responsabilidad") || h.startsWith("Orden")) {
        iVal = "R"; iiVal = "R"; iiiVal = "R";
      }
      if (h.startsWith("Autod.")) {
        iVal = "R"; iiVal = "X"; iiiVal = "X";
      }
    }
    return `
      <tr>
        <td class="left-align" style="text-transform: uppercase; font-weight: 500;">${h}</td>
        <td>${iVal}</td>
        <td>${iiVal}</td>
        <td>${iiiVal}</td>
      </tr>
    `;
  }).join("");

  return `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <!-- Logo de la Escuela + Datos Generales de la Escuela -->
      <div style="display: flex; gap: 15px; align-items: center;">
        <div class="bulletin-school-logo-container" style="width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #000; border-radius: 8px; overflow: hidden; padding: 4px; background: white;">
          <img src="${schoolLogo}" alt="School Logo" style="width: 100%; height: 100%; object-fit: contain;">
        </div>
        <div style="text-align: left;">
          <h4 style="margin: 0; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 0.85rem; letter-spacing: 0.5px; text-transform: uppercase; color: black;">REPÚBLICA DE PANAMÁ</h4>
          <h4 style="margin: 0; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 0.85rem; letter-spacing: 0.5px; text-transform: uppercase; color: black;">MINISTERIO DE EDUCACIÓN</h4>
          <h3 style="margin: 3px 0 0 0; font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 1.15rem; text-transform: uppercase; color: #1d3557;">${schoolName}</h3>
          <p style="margin: 2px 0 0 0; font-size: 0.68rem; color: #555; text-transform: uppercase;">${schoolAddress}</p>
        </div>
      </div>
      
      <!-- Logo MEDUCA + Año Lectivo -->
      <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="65" height="65">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#1d3557" stroke-width="2.5"/>
          <circle cx="50" cy="50" r="40" fill="none" stroke="#1d3557" stroke-width="1" stroke-dasharray="2,2"/>
          <path d="M50 20 C58 20 65 27 65 37 C65 52 50 72 50 72 C50 72 35 52 35 37 C35 27 42 20 50 20 Z" fill="#1d3557"/>
          <circle cx="50" cy="37" r="8" fill="white"/>
          <path d="M44 48 L56 48" stroke="white" stroke-width="2"/>
          <text x="50" y="86" font-family="'Outfit', sans-serif" font-size="10" font-weight="900" fill="#1d3557" text-anchor="middle">MEDUCA</text>
        </svg>
        <div style="font-size: 0.72rem; font-weight: bold; margin-top: 4px; color: black;">Año Lectivo: <span style="font-weight: 800;">2025</span></div>
        <div style="font-size: 0.65rem; color: #555;">Fecha: <span style="font-weight: bold;">${new Date().toLocaleDateString()}</span></div>
      </div>
    </div>

    <!-- Título Boletín -->
    <div style="text-align: center; border-top: 2.5px solid #000; border-bottom: 2.5px solid #000; padding: 6px 0; margin-top: 14px;">
      <h3 style="margin: 0; font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 1.15rem; letter-spacing: 1px; text-transform: uppercase; color: black;">BOLETÍN DE CALIFICACIONES</h3>
      <h4 style="margin: 2px 0 0 0; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 0.85rem; color: #555;">III TRIMESTRE</h4>
    </div>

    <!-- Generales del Estudiante -->
    <div class="bulletin-student-grid">
      <div><strong>Nombre del Estudiante:</strong> <span style="text-transform: uppercase;">${student.name}</span></div>
      <div><strong>Cédula:</strong> <span>${student.cedula || 'No Asignada'}</span></div>
      <div><strong>Plan de Estudios:</strong> <span>EDUCACIÓN BÁSICA GENERAL</span></div>
      <div><strong>Grupo / Aula:</strong> <span>${student.grade || 'Sin Asignar'}</span></div>
      <div style="grid-column: span 2;"><strong>Profesor Consejero:</strong> <span style="text-transform: uppercase;">${teacherName}</span></div>
    </div>

    <!-- Tabla Calificaciones -->
    <table class="bulletin-table">
      <thead>
        <tr>
          <th rowspan="2" style="width: 35%;">Asignaturas</th>
          <th colspan="3">Trimestres</th>
          <th rowspan="2" style="width: 12%;">Nota Final</th>
          <th colspan="2">Trimestre I</th>
          <th colspan="2">Trimestre II</th>
          <th colspan="2">Trimestre III</th>
        </tr>
        <tr>
          <th style="width: 7%;">I</th>
          <th style="width: 7%;">II</th>
          <th style="width: 7%;">III</th>
          <th style="width: 5%;">Tar</th>
          <th style="width: 5%;">Aus</th>
          <th style="width: 5%;">Tar</th>
          <th style="width: 5%;">Aus</th>
          <th style="width: 5%;">Tar</th>
          <th style="width: 5%;">Aus</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
        <tr style="background-color: #f3f4f6; font-weight: 900;">
          <td class="left-align" style="text-transform: uppercase; font-size: 0.85rem;">PROMEDIO GENERAL DEL TRIMESTRE</td>
          <td colspan="3"></td>
          <td style="font-size: 0.9rem; text-decoration: underline; border: 2.5px solid #000; background: #fff;">${bulletinGeneralAvg}</td>
          <td colspan="6"></td>
        </tr>
      </tbody>
    </table>

    <!-- Hábitos y Actitudes & Observaciones -->
    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; margin-top: 15px;">
      <!-- Hábitos & Actitudes -->
      <div>
        <h4 style="margin: 0 0 6px 0; font-family: 'Outfit'; font-weight: 900; font-size: 0.82rem; text-transform: uppercase; border-bottom: 1.5px solid #000; padding-bottom: 2px; text-align: left; color: black;">EVALUACIÓN DE HÁBITOS Y ACTITUDES</h4>
        <table class="bulletin-table" style="margin: 0; font-size: 0.72rem;">
          <thead>
            <tr>
              <th style="width: 70%;">Áreas de Desarrollo</th>
              <th style="width: 10%;">I</th>
              <th style="width: 10%;">II</th>
              <th style="width: 10%;">III</th>
            </tr>
          </thead>
          <tbody>
            ${habitRows}
          </tbody>
        </table>
      </div>

      <!-- Observaciones -->
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <h4 style="margin: 0 0 6px 0; font-family: 'Outfit'; font-weight: 900; font-size: 0.82rem; text-transform: uppercase; border-bottom: 1.5px solid #000; padding-bottom: 2px; text-align: left; color: black;">OBSERVACIONES DEL CONSEJERO</h4>
        <div style="border: 1.5px solid #000; border-radius: 8px; padding: 10px; font-size: 0.72rem; min-height: 120px; text-align: left; background: #fafafa; color: black; line-height: 1.4;">
          <div style="margin-bottom: 6px;"><strong>1er. Trimestre:</strong> Muy buena actitud en clase, sigue así.</div>
          <div style="margin-bottom: 6px;"><strong>2do. Trimestre:</strong> Muestra gran interés y participación constante.</div>
          <div><strong>3er. Trimestre:</strong> ${student.conduct_text || student.conductText || "Excelente estudiante, sigue adelante con el mismo compromiso de superación."}</div>
        </div>
      </div>
    </div>

    <!-- Leyendas -->
    <div class="bulletin-legend" style="margin-top: 15px; display: flex; justify-content: space-between; font-size: 0.62rem; color: #4b5563;">
      <div>
        <strong>CRITERIOS DE CONDUCTA:</strong> 5 - Excelente | 4 - Bueno | 3 - Regular | 2 - Apenas Regular | 1 - Mala | SN - Sin Nota
      </div>
      <div style="text-align: right;">
        <strong>HÁBITOS:</strong> S - Satisfactorio | R - Regular | X - No Satisface
      </div>
    </div>

    <!-- Firmas y Sello -->
    <div class="bulletin-signatures-container">
      <!-- Consejero -->
      <div style="display: flex; flex-direction: column; justify-content: flex-end;">
        <div class="digital-signature">${teacherName}</div>
        <div style="border-top: 1.5px solid #000; width: 85%; margin: 0 auto;"></div>
        <div style="font-size: 0.7rem; font-weight: bold; text-align: center; margin-top: 4px; text-transform: uppercase; color: black;">Profesor Consejero</div>
      </div>

      <!-- Sello Digital -->
      <div style="display: flex; align-items: center; justify-content: center; height: 100px;">
        <div class="digital-seal-demo">
          <span style="font-size: 0.45rem; border-bottom: 1px solid rgba(220, 38, 38, 0.2); margin-bottom: 1px; padding-bottom: 1px; width: 100%;">REP. DE PANAMÁ</span>
          <span style="font-size: 0.52rem; font-weight: 800; color: rgba(220, 38, 38, 0.85) !important;">MEDUCA</span>
          <span style="font-size: 0.38rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px;">${schoolName.substring(0, 15)}</span>
          <span style="font-size: 0.45rem; border-top: 1px dashed rgba(220, 38, 38, 0.4); margin-top: 2px; padding-top: 2px; font-weight: bold;">SELLO DIGITAL</span>
          <span style="font-size: 0.38rem; opacity: 0.8;">MUESTRA DE CONTROL</span>
        </div>
      </div>

      <!-- Director -->
      <div style="display: flex; flex-direction: column; justify-content: flex-end;">
        <div class="digital-signature">${directorName}</div>
        <div style="border-top: 1.5px solid #000; width: 85%; margin: 0 auto;"></div>
        <div style="font-size: 0.7rem; font-weight: bold; text-align: center; margin-top: 4px; text-transform: uppercase; color: black;">Dirección General</div>
      </div>
    </div>
  `;
}

// Document-level event delegation for SIACE Sync and Bulletin Generator
document.addEventListener("click", (e) => {
  try {
    // 1. Admin Generate Bulletin button
    const bulletinBtn = e.target.closest("#adminGenerateBulletinBtn");
    if (bulletinBtn) {
      console.log("Click detectado (delegación). Generando boletín para estudiante activo:", activeStudent);
      if (activeStudent) {
        openBulletinModal(activeStudent);
      } else {
        showToast("Selecciona un estudiante para generar boletín", "⚠️");
      }
      return;
    }

    // 2. Print Bulletin button
    const printBtn = e.target.closest("#printBulletinBtn");
    if (printBtn) {
      console.log("Click detectado (delegación). Imprimiendo boletín...");
      window.print();
      return;
    }

    // 3. Close Bulletin modal button
    const closeBulletinBtn = e.target.closest("#closeBulletinModalBtn");
    if (closeBulletinBtn) {
      const modal = document.getElementById("bulletinModal");
      if (modal) modal.classList.add("hidden");
      return;
    }

    // 4. Close SIACE modal button
    const closeSiaceBtn = e.target.closest("#closeSiaceModalBtn") || e.target.closest("#siaceModalCloseBtn");
    if (closeSiaceBtn) {
      const modal = document.getElementById("siaceModal");
      if (modal) modal.classList.add("hidden");
      return;
    }

    // 5. SIACE Sync button in Teacher portal or Admin panel
    const siaceSyncBtn = e.target.closest(".siace-sync-btn");
    if (siaceSyncBtn) {
      const studentId = siaceSyncBtn.getAttribute("data-student-id");
      console.log("Click detectado (delegación). Iniciando SIACE para:", studentId);
      if (studentId) {
        openSiaceSyncModal(studentId);
      }
      return;
    }
  } catch (err) {
    console.error("Error en delegación de eventos del módulo de boletines:", err);
  }
});


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

// Dynamically populate the student registration grade dropdown from current teachers' grades
function populateStudentGradeDropdown() {
  const selectEl = document.getElementById("regStudentGrade");
  if (!selectEl) return;

  // Clear existing options
  selectEl.innerHTML = "";

  // Get all assigned grades from teachers
  const grades = new Set();
  Object.values(teachersData || {}).forEach(t => {
    if (t.assigned_grade) {
      grades.add(t.assigned_grade);
    }
  });

  // Always include default grades if they aren't present
  const defaultGrades = ["2B", "3A", "1A"];
  defaultGrades.forEach(g => grades.add(g));

  // Sort grades alphabetically
  const sortedGrades = Array.from(grades).sort();

  sortedGrades.forEach(grade => {
    const opt = document.createElement("option");
    opt.value = grade;
    opt.textContent = `Aula ${grade}`;
    selectEl.appendChild(opt);
  });
}


function playChatNotificationSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // First beep
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    gain1.gain.setValueAtTime(0.08, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.12);
    
    // Second beep
    setTimeout(() => {
      if (ctx.state === 'closed') return;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, ctx.currentTime);
      gain2.gain.setValueAtTime(0.08, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.12);
    }, 120);
  } catch (err) {
    console.warn("Fallo al reproducir sonido con Web Audio API:", err);
  }
}

function getCurrentUserId() {
  const teacherView = document.getElementById("teacherDashboardView");
  const isTeacher = teacherView && !teacherView.classList.contains("hidden");
  if (isTeacher && activeTeacher) {
    return activeTeacher;
  }
  if (activeAdminUser && activeAdminUser.email) {
    return activeAdminUser.email;
  }
  const storedAdminEmail = localStorage.getItem("eduAdminEmail");
  if (storedAdminEmail) return storedAdminEmail;
  return "admin";
}

function getCurrentUserDisplayName() {
  const teacherView = document.getElementById("teacherDashboardView");
  const isTeacher = teacherView && !teacherView.classList.contains("hidden");
  if (isTeacher && activeTeacher) {
    const teacher = teachersData[activeTeacher];
    return teacher ? teacher.name : "Docente";
  }
  if (activeAdminUser) {
    return activeAdminUser.name || "Administrador";
  }
  return localStorage.getItem("eduAdminName") || "Administrador";
}

function getAllStaffMembers() {
  const staff = [];
  
  // 1. Admin
  const adminName = localStorage.getItem("eduAdminName") || "Egnis Cano";
  const adminEmail = localStorage.getItem("eduAdminEmail") || "admin";
  staff.push({
    id: adminEmail,
    name: adminName,
    role: "admin",
    roleName: "🔑 Administrador",
    avatar: "EC"
  });

  // 2. Created users from localStorage (like secretary, sub admin, etc.)
  let users = [];
  try {
    const storedUsers = localStorage.getItem("eduCreatedUsers");
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers);
      if (Array.isArray(parsed)) users = parsed;
    }
  } catch(e) {}
  
  // Default users if not in eduCreatedUsers yet
  const defaultUsers = [
    {
      name: "Lic. Ana Reyes",
      role: "secretaria",
      roleName: "📝 Secretaria",
      phone: "+507 6200-1111",
      email: "ana.reyes@escuela.edu"
    },
    {
      name: "Ing. Carlos Mendoza",
      role: "sub administrador",
      roleName: "🔑 Sub Administrador",
      phone: "+507 6200-2222",
      email: "carlos.mendoza@escuela.edu"
    }
  ];
  defaultUsers.forEach(def => {
    if (!users.some(u => u.email && u.email.toLowerCase() === def.email.toLowerCase())) {
      users.push(def);
    }
  });

  users.forEach(u => {
    if (u.role !== "profesores") {
      const initials = u.name.split(" ").map(w => w[0]).join("").toUpperCase().substring(0, 2);
      staff.push({
        id: u.email || u.name.toLowerCase().replace(/[^a-z]/g, ""),
        name: u.name,
        role: u.role,
        roleName: u.roleName,
        avatar: initials || "U"
      });
    }
  });

  // 3. Teachers from teachersData
  for (const key in teachersData) {
    const teacher = teachersData[key];
    const initials = teacher.name.replace("Prof. ", "").split(" ").map(w => w[0]).join("").toUpperCase().substring(0, 2);
    staff.push({
      id: teacher.id,
      name: teacher.name,
      role: "profesores",
      roleName: "👨‍🏫 Docente",
      avatar: teacher.isImgPath ? teacher.profile_pic : (initials || "MD"),
      isImg: !!teacher.isImgPath
    });
  }

  return staff;
}

function getStaffName(userId) {
  const member = getAllStaffMembers().find(m => m.id === userId);
  return member ? member.name : userId;
}

function renderStaffList(containerId, isTeacher) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  const myId = getCurrentUserId();
  const staff = getAllStaffMembers();
  
  // Filter out ourselves
  const others = staff.filter(m => m.id !== myId);

  if (others.length === 0) {
    container.innerHTML = `<p class="chat-placeholder">No hay otros miembros del personal.</p>`;
    return;
  }

  others.forEach(member => {
    const item = document.createElement("div");
    item.className = "staff-list-item";
    
    let avatarHTML = "";
    if (member.isImg) {
      avatarHTML = `<img src="${member.avatar}" alt="${member.name}" class="chat-partner-avatar" style="width: 36px; height: 36px; border-radius: 50%;">`;
    } else {
      const fallbackGrad = getRandomGradientClass(member.id);
      avatarHTML = `<div class="avatar-fallback ${fallbackGrad}" style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.85rem; border: 2px solid var(--text-main);">${member.avatar}</div>`;
    }

    item.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
        ${avatarHTML}
        <div style="display: flex; flex-direction: column; line-height: 1.2;">
          <strong style="color: var(--text-main); font-size: 0.88rem;">${member.name}</strong>
          <span style="font-size: 0.72rem; color: var(--text-sub); font-weight: 600;">${member.roleName}</span>
        </div>
      </div>
      <span style="font-size: 1.1rem; color: var(--text-main); font-weight: bold;">➔</span>
    `;

    item.addEventListener("click", () => {
      if (isTeacher) {
        showTeacherDirectChat(member.id);
      } else {
        showAdminDirectChat(member.id);
      }
    });

    container.appendChild(item);
  });
}

function showAdminDirectChat(partnerId) {
  activeAdminChatPartner = partnerId;
  const listArea = document.getElementById("adminStaffListArea");
  const chatAreaBox = document.getElementById("adminDirectChatArea");
  if (listArea) listArea.classList.add("hidden");
  if (chatAreaBox) chatAreaBox.classList.remove("hidden");

  const partnerInfo = document.getElementById("adminChatPartnerInfo");
  if (partnerInfo) {
    const member = getAllStaffMembers().find(m => m.id === partnerId);
    if (member) {
      let avatarHTML = "";
      if (member.isImg) {
        avatarHTML = `<img src="${member.avatar}" alt="${member.name}" class="chat-partner-avatar" style="width: 36px; height: 36px; border-radius: 50%;">`;
      } else {
        const fallbackGrad = getRandomGradientClass(member.id);
        avatarHTML = `<div class="avatar-fallback ${fallbackGrad}" style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.85rem; border: 2px solid var(--text-main);">${member.avatar}</div>`;
      }
      partnerInfo.innerHTML = `
        ${avatarHTML}
        <div style="display: flex; flex-direction: column; line-height: 1.2;">
          <strong style="font-size: 0.85rem; color: var(--text-main);">${member.name}</strong>
          <span style="font-size: 0.68rem; color: var(--text-sub);">${member.roleName}</span>
        </div>
      `;
    }
  }

  loadChatHistory("staff", null, document.getElementById("chatArea"));
}

function exitAdminDirectChat() {
  activeAdminChatPartner = null;
  const listArea = document.getElementById("adminStaffListArea");
  const chatAreaBox = document.getElementById("adminDirectChatArea");
  if (listArea) listArea.classList.remove("hidden");
  if (chatAreaBox) chatAreaBox.classList.add("hidden");
  
  // Re-render staff list
  renderStaffList("adminStaffListArea", false);
}

function showTeacherDirectChat(partnerId) {
  activeTeacherChatPartner = partnerId;

  // Show staff list in left column, hide tutor contacts
  const staffListArea = document.getElementById("teacherStaffListArea");
  const tutorContactsList = document.getElementById("teacherTutorContactsList");
  if (staffListArea) staffListArea.classList.add("hidden");
  if (tutorContactsList) tutorContactsList.style.display = "none";

  // Show right panel: staff chat
  const placeholder = document.getElementById("teacherChatPlaceholder");
  const tutorArea = document.getElementById("teacherTutorChatArea");
  const staffBox = document.getElementById("teacherDirectChatBox");
  const inputBar = document.getElementById("teacherChatInputBar");
  const header = document.getElementById("teacherActiveChatHeader");
  const partnerInfo = document.getElementById("teacherChatPartnerInfo");

  if (placeholder) placeholder.style.display = "none";
  if (tutorArea) tutorArea.style.display = "none";
  if (staffBox) staffBox.classList.remove("hidden");
  if (inputBar) inputBar.style.display = "flex";
  if (header) header.style.display = "flex";

  const inputField = document.getElementById("teacherChatInputField");
  if (inputField) inputField.placeholder = "Escribe un mensaje al personal...";

  if (partnerInfo) {
    const member = getAllStaffMembers().find(m => m.id === partnerId);
    if (member) {
      let avatarHTML = "";
      if (member.isImg) {
        avatarHTML = `<img src="${member.avatar}" alt="${member.name}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid var(--text-main);">`;
      } else {
        const fallbackGrad = getRandomGradientClass(member.id);
        avatarHTML = `<div class="avatar-fallback ${fallbackGrad}" style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:0.85rem;border:2px solid var(--text-main);">${member.avatar}</div>`;
      }
      partnerInfo.innerHTML = `
        ${avatarHTML}
        <div style="display:flex;flex-direction:column;line-height:1.2;">
          <strong style="font-size:0.85rem;color:var(--text-main);">${member.name}</strong>
          <span style="font-size:0.68rem;color:var(--text-sub);">${member.roleName}</span>
        </div>
      `;
    }
  }

  loadChatHistory("staff", null, document.getElementById("teacherStaffChatArea"));
}

function exitTeacherDirectChat() {
  activeTeacherChatPartner = null;
  // Return to staff list view
  const staffListArea = document.getElementById("teacherStaffListArea");
  const staffBox = document.getElementById("teacherDirectChatBox");
  const inputBar = document.getElementById("teacherChatInputBar");
  const placeholder = document.getElementById("teacherChatPlaceholder");
  const header = document.getElementById("teacherActiveChatHeader");

  if (staffListArea) staffListArea.classList.remove("hidden");
  if (staffBox) staffBox.classList.add("hidden");
  if (inputBar) inputBar.style.display = "none";
  if (placeholder) placeholder.style.display = "none";
  if (header) header.style.display = "none";

  renderStaffList("teacherStaffListArea", true);
}

function initChatTabsListeners() {
  // Admin back button
  const adminBackBtn = document.getElementById("adminChatBackBtn");
  if (adminBackBtn) {
    adminBackBtn.addEventListener("click", exitAdminDirectChat);
  }

  // Teacher Chat Dual Tabs
  const teacherBtnTutor = document.getElementById("teacherBtnChatTutor");
  const teacherBtnStaff = document.getElementById("teacherBtnChatStaff");
  
  if (teacherBtnTutor && teacherBtnStaff) {
    teacherBtnTutor.addEventListener("click", () => {
      teacherActiveChatType = "tutor";
      teacherBtnTutor.classList.add("active");
      teacherBtnStaff.classList.remove("active");
      activeTeacherChatPartner = null;
      
      // Show tutor contacts in left column
      const staffListArea = document.getElementById("teacherStaffListArea");
      const tutorContactsList = document.getElementById("teacherTutorContactsList");
      if (staffListArea) staffListArea.classList.add("hidden");
      if (tutorContactsList) tutorContactsList.style.display = "flex";
      renderTutorContactsList(activeStudent);

      // Reset right panel to placeholder (user must select a student again)
      resetTeacherChatRightPanel();
    });

    teacherBtnStaff.addEventListener("click", () => {
      teacherActiveChatType = "staff";
      teacherBtnStaff.classList.add("active");
      teacherBtnTutor.classList.remove("active");
      activeTeacherChatPartner = null;
      
      // Show staff contacts in left column
      const staffListArea = document.getElementById("teacherStaffListArea");
      const tutorContactsList = document.getElementById("teacherTutorContactsList");
      if (tutorContactsList) tutorContactsList.style.display = "none";
      if (staffListArea) staffListArea.classList.remove("hidden");
      renderStaffList("teacherStaffListArea", true);
      
      // Reset right panel to placeholder
      resetTeacherChatRightPanel();
    });
  }
}

// ==========================================================================
// 21. PORTAL ACUDIENTE / ESTUDIANTE
// ==========================================================================
let activeParentStudentId = null;

function renderParentDashboardData(studentId) {
  const student = studentsData[studentId];
  if (!student) return;

  // Set active trimester from the grade's adviser
  let activeTrimester = 1;
  if (typeof teachersData !== 'undefined') {
    const adviser = Object.values(teachersData).find(t => t.assigned_grade === student.grade);
    if (adviser && adviser.active_trimester) {
      activeTrimester = adviser.active_trimester;
    }
  }

  // If following teacher automatically (default), always show teacher's active trimester
  // If parent manually selected a trimester via dropdown, use their selection
  if (parentFollowsTeacher || parentSelectedTrimester === null || parentSelectedTrimester === undefined) {
    parentSelectedTrimester = activeTrimester;
  }


  // Update dropdown value in UI
  const parentTrimesterSelect = document.getElementById("parentActiveTrimesterSelect");
  if (parentTrimesterSelect) {
    parentTrimesterSelect.value = parentSelectedTrimester;
  }

  // Header info
  const nameEl = document.getElementById("parentStudentName");
  const gradeEl = document.getElementById("parentStudentGrade");
  if (nameEl) nameEl.textContent = student.name;
  if (gradeEl) gradeEl.textContent = `Grado: ${student.grade || '--'} | Cédula: ${student.cedula || '--'}`;

  // Update Attendance Badge
  const attendanceBadge = document.getElementById("parentStudentAttendanceBadge");
  if (attendanceBadge) {
    const isPresent = student.attendance !== false;
    attendanceBadge.textContent = isPresent ? "🟢 Presente" : "🔴 Ausente";
    attendanceBadge.style.backgroundColor = isPresent ? "rgba(163, 230, 53, 0.12)" : "rgba(239, 68, 68, 0.12)";
    attendanceBadge.style.color = isPresent ? "var(--color-lime)" : "var(--color-red)";
    attendanceBadge.style.borderColor = isPresent ? "#a3e635" : "#ef4444";
  }
  
  // Profile picture
  const avatarEl = document.getElementById("parentStudentAvatar");
  if (avatarEl) {
    if (student.isImgPath || student.is_img_path || (student.img && student.img.startsWith('data:image/')) || (student.img && student.img.includes('/'))) {
      avatarEl.innerHTML = `<img src="${student.img}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='assets/profile-fallback.png'">`;
    } else {
      avatarEl.innerHTML = `<span style="font-size:2rem; font-weight:700;">${student.img || '👤'}</span>`;
    }
  }

  // Academic Data Container
  const container = document.getElementById("parentAcademicDataContainer");
  if (container) {
    // Preserve open/collapsed accordion states
    let gradesOpen = true;
    let incidentsOpen = true;
    let conductOpen = true;
    let teachersOpen = true;
    
    const existingGradesCard = document.getElementById("parentGradesCard");
    if (existingGradesCard) {
      gradesOpen = existingGradesCard.classList.contains("open");
    }
    const existingIncidentsCard = document.getElementById("parentIncidentsCard");
    if (existingIncidentsCard) {
      incidentsOpen = existingIncidentsCard.classList.contains("open");
    }
    const existingConductCard = document.getElementById("parentConductCard");
    if (existingConductCard) {
      conductOpen = existingConductCard.classList.contains("open");
    }
    const existingTeachersCard = document.getElementById("parentTeachersCard");
    if (existingTeachersCard) {
      teachersOpen = existingTeachersCard.classList.contains("open");
    }

    container.innerHTML = "";

    // Determine all subjects for this student's grade
    const assignedSubjects = [];
    if (typeof teachersData !== 'undefined') {
      Object.values(teachersData).forEach(t => {
        if (t.assigned_grade === student.grade && Array.isArray(t.subjects)) {
          t.subjects.forEach(sub => {
            if (!assignedSubjects.includes(sub)) assignedSubjects.push(sub);
          });
        }
      });
    }

    const subjectsObj = student.subject_grades || {};

    // Merge localStorage grades into subjectsObj for any subjects with missing data
    // This ensures parent portal shows grades even if Supabase hasn't synced yet
    assignedSubjects.forEach(sub => {
      const subjectKey = `${sub}_T${parentSelectedTrimester}`;
      const hasSupabaseGrades = Array.isArray(subjectsObj[subjectKey]) &&
        subjectsObj[subjectKey].some(g => g !== '' && g !== null && g !== undefined);
      if (!hasSupabaseGrades) {
        // Try localStorage fallback using the same keys as the teacher dashboard
        const lsKey = `eduStudentGradesJSON_${student.id}_${subjectKey}`;
        try {
          const stored = localStorage.getItem(lsKey);
          if (stored) {
            const arr = JSON.parse(stored);
            if (Array.isArray(arr) && arr.some(g => g !== '' && g !== null && g !== undefined)) {
              subjectsObj[subjectKey] = arr;
            }
          }
        } catch(e) {}
      }
    });

    // Add any subjects that might be in subject_grades but not in assignedSubjects
    Object.keys(subjectsObj).forEach(sub => {
      // Strip trimester suffix for comparison
      const cleanSub = sub.replace(/_T\d+$/, '');
      if (!assignedSubjects.includes(cleanSub)) assignedSubjects.push(cleanSub);
    });

    let subjectsHtml = '';
    
    assignedSubjects.forEach((sub, subIdx) => {
      const subjectKey = `${sub}_T${parentSelectedTrimester}`;
      const grades = subjectsObj[subjectKey] || [];
      let avg = computeSubjectAverage(grades);
      
      // Use integer comparison to avoid type coercion bugs (string vs number)
      const selectedT = parseInt(parentSelectedTrimester, 10);
      
      if (avg === '--' && student.grades && student.grades[selectedT - 1] !== undefined && student.grades[selectedT - 1] > 0) {
        avg = parseFloat(student.grades[selectedT - 1]).toFixed(1);
      } else if (avg === '--') {
        avg = "0.0";
      }

      
      const color = (avg !== '--' && parseFloat(avg) < 3.0) ? 'var(--color-red)' : 'var(--color-blue)';
      
      // Determine individual subject open state
      let subjectOpen = false;
      const existingSubCard = document.getElementById(`parentSub_${subIdx}`);
      if (existingSubCard) {
        subjectOpen = existingSubCard.classList.contains("open");
      }

      // Find the teacher ID for this subject to retrieve syllabus and activities
      let teacherId = null;
      if (typeof teachersData !== 'undefined') {
        Object.entries(teachersData).forEach(([tid, t]) => {
          if (t.assigned_grade === student.grade && Array.isArray(t.subjects) && t.subjects.includes(sub)) {
            teacherId = tid;
          }
        });
      }

      let activities = [];
      let syllabusTopics = [];
      
      if (teacherId) {
        const planningId = `${teacherId}_${sub}`;
        const pl = planningsData[planningId];
        if (pl) {
          activities = pl.activities || [];
          syllabusTopics = pl.syllabus || [];
        }
      }

      // Local storage fallbacks
      if (activities.length === 0 && teacherId) {
        const activitiesKey = `eduTeacherPlanningActivities_${teacherId}_${sub}`;
        try {
          const stored = localStorage.getItem(activitiesKey);
          if (stored) activities = JSON.parse(stored);
        } catch(e){}
      }
      if (activities.length === 0) {
        activities = ["Taller 1", "Investigación 1", "Examen parcial", "Prueba corta"];
      }

      if (syllabusTopics.length === 0 && teacherId) {
        const syllabusKey = `eduTeacherPlanningSyllabus_${teacherId}_${sub}`;
        try {
          const stored = localStorage.getItem(syllabusKey);
          if (stored) syllabusTopics = JSON.parse(stored);
        } catch(e){}
      }

      let activitiesHtml = '';
      activities.forEach((act, actIdx) => {
        let val = '--';
        if (Array.isArray(grades) && grades[actIdx] !== undefined && grades[actIdx] !== null && grades[actIdx] !== '') {
          val = grades[actIdx];
        }

        const valNum = parseFloat(val);
        const gradeColor = (!isNaN(valNum) && valNum < 3.0) ? 'var(--color-red)' : (!isNaN(valNum) ? 'var(--color-lime)' : 'var(--text-sub)');
        
        activitiesHtml += `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px dashed rgba(0,0,0,0.05); font-size: 0.88rem;">
            <span style="color: var(--text-secondary); font-weight: 500;">📋 ${escapeHTML(act)}</span>
            <span style="font-weight: 700; color: ${gradeColor};">${val}</span>
          </div>
        `;
      });

      let syllabusHtml = '';
      if (syllabusTopics.length > 0) {
        syllabusHtml = `
          <div style="margin-top: 8px; font-size: 0.8rem; color: var(--text-sub); background: rgba(0,0,0,0.02); padding: 8px; border-radius: 6px; border-left: 3px solid var(--color-cyan); margin-bottom: 10px;">
            <strong>📚 Temas:</strong> ${syllabusTopics.map(t => escapeHTML(t)).join(' • ')}
          </div>
        `;
      }

      subjectsHtml += `
        <div id="parentSub_${subIdx}" class="subject-accordion-card ${subjectOpen ? 'open' : ''}" style="background: var(--bg-light); border: 1px solid var(--text-sub); border-radius: 8px; margin-bottom: 10px; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; cursor: pointer;" onclick="toggleParentSubjectAccordion(${subIdx})">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="sub-arrow" style="transition: transform 0.3s; font-size: 0.75rem; color: var(--text-sub); display: inline-block; transform: rotate(${subjectOpen ? '90deg' : '0deg'});">▶</span>
              <h4 style="margin: 0; font-size: 1.05rem; color: var(--text-main);">${sub}</h4>
            </div>
            <span style="font-size: 1.2rem; font-weight: 800; color: ${color};">${avg}</span>
          </div>
          <div id="parentSubContent_${subIdx}" style="display: ${subjectOpen ? 'block' : 'none'}; padding: 0 12px 12px 12px; border-top: 1px dashed rgba(0,0,0,0.05);">
            ${syllabusHtml}
            <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 8px;">
              ${activitiesHtml}
            </div>
          </div>
        </div>
      `;
    });

    if (!subjectsHtml) {
      subjectsHtml = '<p style="color: var(--text-sub); font-size: 0.9rem;">No hay asignaturas registradas para este estudiante.</p>';
    }

    container.innerHTML = `
      <!-- Accordion 1: Calificaciones -->
      <div class="chubby-card accordion-card ${gradesOpen ? 'open' : ''}" id="parentGradesCard" style="margin-bottom: 15px;">
        <div class="accordion-card-header" style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; cursor:pointer;" onclick="toggleParentAccordion('parentGradesCard', 'parentGradesContent')">
          <h4 style="margin:0;"><span class="icon">📚</span> Resumen de Calificaciones</h4>
          <span class="accordion-arrow" style="transition: transform 0.3s; font-size: 0.8rem; color: var(--text-muted); display: inline-block; transform: rotate(${gradesOpen ? '180deg' : '0deg'});">▼</span>
        </div>
        <div class="accordion-card-content" id="parentGradesContent" style="display: ${gradesOpen ? 'block' : 'none'}; opacity: ${gradesOpen ? '1' : '0'}; height: ${gradesOpen ? 'auto' : '0px'}; overflow: ${gradesOpen ? 'visible' : 'hidden'}; transition: height 0.4s ease, opacity 0.35s ease;">
          <div class="accordion-card-content-inner" style="padding: 12px 16px;">
            ${subjectsHtml}
          </div>
        </div>
      </div>
      
      <!-- Accordion 2: Incidencias -->
      <div class="chubby-card accordion-card ${incidentsOpen ? 'open' : ''}" id="parentIncidentsCard" style="margin-top: 15px;">
        <div class="accordion-card-header" style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; cursor:pointer;" onclick="toggleParentAccordion('parentIncidentsCard', 'parentIncidentsContent')">
          <h4 style="margin:0;"><span class="icon">⚠️</span> Incidencias / Observaciones</h4>
          <span class="accordion-arrow" style="transition: transform 0.3s; font-size: 0.8rem; color: var(--text-muted); display: inline-block; transform: rotate(${incidentsOpen ? '180deg' : '0deg'});">▼</span>
        </div>
        <div class="accordion-card-content" id="parentIncidentsContent" style="display: ${incidentsOpen ? 'block' : 'none'}; opacity: ${incidentsOpen ? '1' : '0'}; height: ${incidentsOpen ? 'auto' : '0px'}; overflow: ${incidentsOpen ? 'visible' : 'hidden'}; transition: height 0.4s ease, opacity 0.35s ease;">
          <div class="accordion-card-content-inner" style="padding: 12px 16px;">
            ${(student.incidents || []).length ? student.incidents.map(inc => `
              <div style="background: var(--bg-light); padding: 10px; border-radius: 8px; margin-bottom: 8px; border-left: 4px solid var(--color-orange);">
                <div style="font-size: 0.8rem; color: var(--text-sub);">${inc.date} ${inc.time || ''}</div>
                <div style="font-size: 0.95rem;">${escapeHTML(inc.text || inc.desc || '')}</div>
              </div>
            `).join('') : '<p style="color: var(--text-sub); font-size: 0.9rem; margin: 0;">Sin incidencias reportadas.</p>'}
          </div>
        </div>
      </div>

      <!-- Accordion 3: Conducta -->
      ${
        (() => {
          const conduct = student.conduct || 'sin_evaluar';
          const conductText = student.conductText || student.conduct_text || 'El docente aún no ha registrado observaciones de conducta.';
          const conductMap = {
            'excelente':       { label: 'Excelente',        emoji: '⭐', color: 'var(--color-lime)',   bg: 'rgba(163,230,53,0.12)',   border: '#a3e635' },
            'muy bueno':       { label: 'Muy Bueno',        emoji: '🌟', color: 'var(--color-cyan)',   bg: 'rgba(34,211,238,0.10)',   border: '#22d3ee' },
            'participativo':   { label: 'Participativo',    emoji: '🙋', color: 'var(--color-blue)',   bg: 'rgba(59,130,246,0.10)',   border: '#3b82f6' },
            'enfocado':        { label: 'Enfocado',         emoji: '🎯', color: 'var(--color-purple)', bg: 'rgba(168,85,247,0.10)',   border: '#a855f7' },
            'adecuado':        { label: 'Adecuado',         emoji: '👍', color: 'var(--color-blue)',   bg: 'rgba(59,130,246,0.08)',   border: '#3b82f6' },
            'conversador':     { label: 'Conversador',      emoji: '💬', color: 'var(--color-orange)', bg: 'rgba(251,146,60,0.10)',   border: '#fb923c' },
            'necesita mejorar':{ label: 'Necesita Mejorar', emoji: '⚡', color: 'var(--color-red)',    bg: 'rgba(239,68,68,0.10)',    border: '#ef4444' },
            'sin_evaluar':     { label: 'Sin Evaluar',      emoji: '📋', color: 'var(--text-sub)',     bg: 'rgba(0,0,0,0.04)',        border: 'var(--text-sub)' }
          };
          const cm = conductMap[conduct] || conductMap['sin_evaluar'];
          return `
          <div class="chubby-card accordion-card ${conductOpen ? 'open' : ''}" id="parentConductCard" style="margin-top: 15px;">
            <div class="accordion-card-header" style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; cursor:pointer;" onclick="toggleParentAccordion('parentConductCard', 'parentConductContent')">
              <h4 style="margin:0;"><span class="icon">🎭</span> Calificación de Conducta</h4>
              <span class="accordion-arrow" style="transition: transform 0.3s; font-size: 0.8rem; color: var(--text-muted); display: inline-block; transform: rotate(${conductOpen ? '180deg' : '0deg'});">▼</span>
            </div>
            <div class="accordion-card-content" id="parentConductContent" style="display: ${conductOpen ? 'block' : 'none'}; opacity: ${conductOpen ? '1' : '0'}; height: ${conductOpen ? 'auto' : '0px'}; overflow: ${conductOpen ? 'visible' : 'hidden'}; transition: height 0.4s ease, opacity 0.35s ease;">
              <div class="accordion-card-content-inner" style="padding: 12px 16px;">
                <div style="display: flex; align-items: center; gap: 14px; background: ${cm.bg}; border: 2px solid ${cm.border}; border-radius: 14px; padding: 14px 16px; margin-bottom: 12px;">
                  <span style="font-size: 2.2rem; flex-shrink: 0;">${cm.emoji}</span>
                  <div style="flex: 1;">
                    <div style="font-size: 1.1rem; font-weight: 800; color: ${cm.color}; font-family: 'Outfit', sans-serif; letter-spacing: -0.3px;">${cm.label}</div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 3px; line-height: 1.4;">${escapeHTML(conductText)}</div>
                  </div>
                </div>
                <div style="font-size: 0.78rem; color: var(--text-sub); text-align: center; font-style: italic; opacity: 0.7;">
                  📌 La conducta es evaluada exclusivamente por el docente
                </div>
              </div>
            </div>
          </div>
          `;
        })()
      }

      <!-- Accordion 4: Información del Docente -->
      ${
        (() => {
          const assignedTeachers = Object.values(teachersData || {}).filter(t => t.assigned_grade === student.grade);
          if (assignedTeachers.length === 0) return '';

          const teacherCardsHtml = assignedTeachers.map(t => {
            const hasPhoto = t.isImgPath || t.is_img_path || (t.profile_pic && (t.profile_pic.startsWith('data:') || t.profile_pic.includes('/')));
            const avatarHtml = hasPhoto
              ? `<img src="${t.profile_pic}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid var(--text-main);flex-shrink:0;" onerror="this.style.display='none'">`
              : `<div style="width:48px;height:48px;border-radius:50%;background:var(--color-blue);color:white;display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:800;flex-shrink:0;border:2px solid var(--text-main);">${(t.name||'?')[0].toUpperCase()}</div>`;

            const subjectsHtml = (t.subjects || []).map(s =>
              `<span style="display:inline-block;background:var(--color-blue);color:white;font-size:0.68rem;font-weight:700;padding:2px 8px;border-radius:20px;margin:2px 2px 2px 0;">${escapeHTML(s)}</span>`
            ).join('');

            const specsHtml = (t.specializations || []).map(sp =>
              `<span style="display:inline-block;background:var(--bg-light);border:1px solid var(--text-sub);color:var(--text-secondary);font-size:0.67rem;padding:2px 7px;border-radius:20px;margin:2px 2px 2px 0;text-transform:capitalize;">${escapeHTML(sp)}</span>`
            ).join('');

            return `
              <div style="background:var(--bg-light);border:1.5px solid var(--text-sub);border-radius:12px;padding:12px 14px;margin-bottom:10px;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
                  ${avatarHtml}
                  <div style="flex:1;min-width:0;">
                    <div style="font-weight:800;font-size:0.95rem;color:var(--text-main);font-family:'Outfit',sans-serif;">${escapeHTML(t.name || 'Docente')}</div>
                    <div style="font-size:0.75rem;color:var(--text-sub);margin-top:1px;">🏫 Grado: ${escapeHTML(t.assigned_grade || '--')}</div>
                  </div>
                </div>
                <div style="margin-bottom:7px;">
                  <div style="font-size:0.72rem;font-weight:700;color:var(--text-sub);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">📖 Materias que imparte</div>
                  <div>${subjectsHtml || '<span style="color:var(--text-sub);font-size:0.8rem;">Sin materias asignadas</span>'}</div>
                </div>
                ${specsHtml ? `
                <div>
                  <div style="font-size:0.72rem;font-weight:700;color:var(--text-sub);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">🎓 Formación Académica</div>
                  <div>${specsHtml}</div>
                </div>` : ''}
              </div>
            `;
          }).join('');

          return `
          <div class="chubby-card accordion-card ${teachersOpen ? 'open' : ''}" id="parentTeachersCard" style="margin-top: 15px;">
            <div class="accordion-card-header" style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; cursor:pointer;" onclick="toggleParentAccordion('parentTeachersCard', 'parentTeachersContent')">
              <h4 style="margin:0;"><span class="icon">👩‍🏫</span> Información del Docente</h4>
              <span class="accordion-arrow" style="transition: transform 0.3s; font-size: 0.8rem; color: var(--text-muted); display: inline-block; transform: rotate(${teachersOpen ? '180deg' : '0deg'});">▼</span>
            </div>
            <div class="accordion-card-content" id="parentTeachersContent" style="display: ${teachersOpen ? 'block' : 'none'}; opacity: ${teachersOpen ? '1' : '0'}; height: ${teachersOpen ? 'auto' : '0px'}; overflow: ${teachersOpen ? 'visible' : 'hidden'}; transition: height 0.4s ease, opacity 0.35s ease;">
              <div class="accordion-card-content-inner" style="padding: 12px 16px;">
                ${teacherCardsHtml}
              </div>
            </div>
          </div>
          `;
        })()
      }
    `;
  }
}

// Global toggle functions for Parent Dashboard Accordions
window.toggleParentAccordion = function(cardId, contentId) {
  const card = document.getElementById(cardId);
  const content = document.getElementById(contentId);
  if (!card || !content) return;
  const arrow = card.querySelector(".accordion-arrow");
  const isOpen = card.classList.contains("open");
  
  if (isOpen) {
    content.style.transition = "height 0.4s ease, opacity 0.3s ease";
    content.style.height = content.scrollHeight + "px";
    content.offsetHeight; // force reflow
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
    content.style.display = "block";
    const targetHeight = content.scrollHeight;
    content.style.height = "0px";
    content.style.opacity = "0";
    content.style.overflow = "hidden";
    content.offsetHeight; // force reflow
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
};

window.toggleParentSubjectAccordion = function(subIdx) {
  const card = document.getElementById(`parentSub_${subIdx}`);
  const content = document.getElementById(`parentSubContent_${subIdx}`);
  if (!card || !content) return;
  const arrow = card.querySelector(".sub-arrow");
  const isOpen = card.classList.contains("open");
  
  if (isOpen) {
    content.style.display = "none";
    card.classList.remove("open");
    if (arrow) arrow.style.transform = "rotate(0deg)";
  } else {
    content.style.display = "block";
    card.classList.add("open");
    if (arrow) arrow.style.transform = "rotate(90deg)";
  }
};

function renderParentDashboard(studentId) {
  activeParentStudentId = studentId;
  parentSelectedTrimester = null;
  parentFollowsTeacher = true; // Reset to auto-follow teacher on new student open
  renderParentDashboardData(studentId);

  // Load chat
  const chatArea = document.getElementById("parentChatArea");
  if (chatArea) {
    chatArea.innerHTML = '<p class="chat-placeholder">Cargando historial...</p>';
    setTimeout(() => {
      loadChatHistory("tutor", studentId, chatArea);
    }, 500);
  }
  const chatAreaMobile = document.getElementById("parentChatAreaMobile");
  if (chatAreaMobile) {
    chatAreaMobile.innerHTML = '<p class="chat-placeholder">Cargando historial...</p>';
    setTimeout(() => {
      loadChatHistory("tutor", studentId, chatAreaMobile);
    }, 500);
  }
}

// Bind Parent Portal Global Events
document.addEventListener("DOMContentLoaded", () => {
  const parentLogoutBtn = document.getElementById("parentLogoutBtn");
  if (parentLogoutBtn) {
    parentLogoutBtn.addEventListener("click", () => {
      activeParentStudentId = null;
      triggerPageWipe("landing");
      const authSection = document.getElementById("authSection");
      if (authSection) {
        authSection.classList.add("active"); // Optionally show auth section
        setTimeout(() => document.body.style.overflow = "hidden", 800);
      }
      const parentChatDrawer = document.getElementById("parentChatDrawer");
      if (parentChatDrawer) {
        parentChatDrawer.classList.remove("open");
      }
      const parentChatDrawerOverlay = document.getElementById("parentChatDrawerOverlay");
      if (parentChatDrawerOverlay) {
        parentChatDrawerOverlay.classList.remove("open");
      }
    });
  }

  const parentThemeToggle = document.getElementById("parentThemeToggle");
  if (parentThemeToggle) {
    parentThemeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-theme");
      document.body.classList.toggle("light-theme", !isDark);
      showToast(isDark ? "Modo oscuro activado" : "Modo claro activado", "🌓");
    });
  }

  const parentActiveTrimesterSelect = document.getElementById("parentActiveTrimesterSelect");
  if (parentActiveTrimesterSelect) {
    parentActiveTrimesterSelect.addEventListener("change", (e) => {
      parentSelectedTrimester = parseInt(e.target.value) || 1;
      parentFollowsTeacher = false; // Parent manually selected, stop auto-following teacher
      if (activeParentStudentId) {
        showToast(`Cargando información del Trimestre ${parentSelectedTrimester}`, "📅");
        renderParentDashboardData(activeParentStudentId);
      }
    });
  }


  // Parent Chat Drawer Toggles
  const parentChatToggleBtn = document.getElementById("parentChatToggleBtn");
  const parentChatDrawer = document.getElementById("parentChatDrawer");
  const closeParentChatDrawerBtn = document.getElementById("closeParentChatDrawerBtn");
  const parentChatDrawerOverlay = document.getElementById("parentChatDrawerOverlay");

  if (parentChatToggleBtn && parentChatDrawer) {
    parentChatToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      parentChatDrawer.classList.toggle("open");
      if (parentChatDrawerOverlay) {
        parentChatDrawerOverlay.classList.toggle("open", parentChatDrawer.classList.contains("open"));
      }
    });
  }

  if (closeParentChatDrawerBtn && parentChatDrawer) {
    closeParentChatDrawerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      parentChatDrawer.classList.remove("open");
      if (parentChatDrawerOverlay) {
        parentChatDrawerOverlay.classList.remove("open");
      }
    });
  }

  if (parentChatDrawerOverlay && parentChatDrawer) {
    parentChatDrawerOverlay.addEventListener("click", (e) => {
      e.stopPropagation();
      parentChatDrawer.classList.remove("open");
      parentChatDrawerOverlay.classList.remove("open");
    });
  }

  document.addEventListener("click", (e) => {
    if (parentChatDrawer && parentChatDrawer.classList.contains("open")) {
      if (!parentChatDrawer.contains(e.target) && e.target !== parentChatToggleBtn && e.target !== parentChatDrawerOverlay) {
        parentChatDrawer.classList.remove("open");
        if (parentChatDrawerOverlay) {
          parentChatDrawerOverlay.classList.remove("open");
        }
      }
    }
  });
});

