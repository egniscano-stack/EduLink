-- ==========================================================================
-- SCRIPT DE RESTAURACIÓN DE DATOS - EDULINK
-- Ejecuta este script en el editor SQL de tu panel de Supabase para restaurar
-- los profesores y estudiantes eliminados.
-- ==========================================================================

-- 1. Restaurar Profesores Registrados
INSERT INTO public.teachers (id, name, employee_id, cedula, profile_pic, age, specializations, subjects, assigned_grade, created_at)
VALUES
(
  'ariacniesp59', 
  'Ariacni Espinoza', 
  '156342', 
  '1-716-1071', 
  'https://awwrasdjitrbkbyyrhzz.supabase.co/storage/v1/object/public/school-assets/teachers/1781305042226-evfhvhsipyr.jpg', 
  39, 
  ARRAY['Licenciatura en educacion prescolar'], 
  ARRAY['español', 'religion', 'ciencias', 'ingles', 'expresion artistica', 'matematicas', 'ciencias sociales', 'educacion fisica'], 
  '2B', 
  '2026-06-12T22:57:23.799478+00:00'
),
(
  'egniscano36', 
  'egnis cano', 
  '123659', 
  '8-772-2232', 
  'https://awwrasdjitrbkbyyrhzz.supabase.co/storage/v1/object/public/school-assets/teachers/1781306432087-kk6tvufqdno.JPG', 
  42, 
  ARRAY['licenciatura en educacion primaria', 'licenciatura en religion etica y moral'], 
  ARRAY['Español', 'Religión', 'Ciencias', 'Inglés', 'Expresión Artística', 'Matemáticas', 'Ciencias Sociales', 'Educación Física'], 
  '3A', 
  '2026-06-12T23:20:34.37288+00:00'
),
(
  'mariaperez52', 
  'maria perez', 
  '125364', 
  '1-963-785', 
  'https://awwrasdjitrbkbyyrhzz.supabase.co/storage/v1/object/public/school-assets/teachers/1781306599178-87sg0y855e.JPG', 
  36, 
  ARRAY['licenciatura en educacion prescolar'], 
  ARRAY['Español', 'Religión', 'Inglés', 'Expresión Artística'], 
  'kinder A', 
  '2026-06-12T23:23:21.251725+00:00'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  employee_id = EXCLUDED.employee_id,
  cedula = EXCLUDED.cedula,
  profile_pic = EXCLUDED.profile_pic,
  age = EXCLUDED.age,
  specializations = EXCLUDED.specializations,
  subjects = EXCLUDED.subjects,
  assigned_grade = EXCLUDED.assigned_grade,
  created_at = EXCLUDED.created_at;

-- 2. Restaurar Estudiantes Registrados
INSERT INTO public.students (
  id, name, role, role_class, accent_class, student_id, img, is_img_path, 
  grades, conduct, parent_name, parent_phone, parent_email, conduct_text, 
  grade, incidents, novelty_report, subject_grades, cedula, age, address, 
  birth_year, blood_type, medical_conditions, tutor2_name, tutor2_phone, 
  status, attendance, created_at
)
VALUES
(
  'eimycano68', 
  'eimy cano', 
  'Estudiante', 
  'badge-lime', 
  'accent-lime', 
  '#EL-78937', 
  'https://awwrasdjitrbkbyyrhzz.supabase.co/storage/v1/object/public/school-assets/students/1781304829268-gj2cuj0cz56.jpg', 
  true, 
  ARRAY[0, 0, 0, 0]::numeric[], 
  'sin_evaluar', 
  'egnis cano', 
  '62856279', 
  'egniscano@gmail.com', 
  'El docente aún no ha registrado observaciones de conducta.', 
  '2B', 
  '[]'::jsonb, 
  '{}'::jsonb, 
  '{}'::jsonb, 
  '1-896-635', 
  7, 
  'Finca 4', 
  2018, 
  'o+', 
  'ninguna', 
  'ariacni espinoza', 
  '64699748', 
  'Nuevo', 
  true, 
  '2026-06-12T22:53:50.869557+00:00'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  role_class = EXCLUDED.role_class,
  accent_class = EXCLUDED.accent_class,
  student_id = EXCLUDED.student_id,
  img = EXCLUDED.img,
  is_img_path = EXCLUDED.is_img_path,
  -- DO NOT overwrite grades/subject_grades if the existing row already has data
  grades = CASE 
    WHEN (public.students.subject_grades IS NULL OR public.students.subject_grades = '{}'::jsonb)
    THEN EXCLUDED.grades 
    ELSE public.students.grades 
  END,
  conduct = EXCLUDED.conduct,
  parent_name = EXCLUDED.parent_name,
  parent_phone = EXCLUDED.parent_phone,
  parent_email = EXCLUDED.parent_email,
  conduct_text = EXCLUDED.conduct_text,
  grade = EXCLUDED.grade,
  incidents = EXCLUDED.incidents,
  novelty_report = EXCLUDED.novelty_report,
  -- Only reset subject_grades if it's truly empty in the DB
  subject_grades = CASE 
    WHEN (public.students.subject_grades IS NULL OR public.students.subject_grades = '{}'::jsonb)
    THEN EXCLUDED.subject_grades 
    ELSE public.students.subject_grades 
  END,
  cedula = EXCLUDED.cedula,
  age = EXCLUDED.age,
  address = EXCLUDED.address,
  birth_year = EXCLUDED.birth_year,
  blood_type = EXCLUDED.blood_type,
  medical_conditions = EXCLUDED.medical_conditions,
  tutor2_name = EXCLUDED.tutor2_name,
  tutor2_phone = EXCLUDED.tutor2_phone,
  status = EXCLUDED.status,
  attendance = EXCLUDED.attendance,
  created_at = EXCLUDED.created_at;

-- 3. Inicializar balance financiero por defecto si no existe
INSERT INTO public.finances (id, budget_fece, petty_cash)
VALUES (1, 12450.00, 320.50)
ON CONFLICT (id) DO NOTHING;
