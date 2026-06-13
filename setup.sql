-- ==========================================================================
-- EDULINK DATABASE SCHEMA SETUP
-- Ejecuta este script en el editor SQL de tu panel de Supabase
-- ==========================================================================

-- Limpieza previa (opcional)
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.finances CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.teachers CASCADE;
DROP TABLE IF EXISTS public.school_settings CASCADE;
DROP TABLE IF EXISTS public.school_users CASCADE;
DROP TABLE IF EXISTS public.planning CASCADE;

-- 1. Tabla de Profesores / Maestros
CREATE TABLE public.teachers (
    id TEXT PRIMARY KEY, -- Ej: 'egnis', 'maria', 'roberto'
    name TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    cedula TEXT NOT NULL,
    profile_pic TEXT NOT NULL,
    age INT NOT NULL,
    specializations TEXT[] NOT NULL, -- Array de especializaciones, cursos o licenciaturas
    subjects TEXT[] NOT NULL, -- Array de asignaturas que imparte
    assigned_grade TEXT NOT NULL, -- Salon o grado asignado (ej: '2B', '3A', '1A')
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de Estudiantes
CREATE TABLE public.students (
    id TEXT PRIMARY KEY, -- Ej: 'juan', 'sofia', 'mateo', 'valentina'
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    role_class TEXT NOT NULL,
    accent_class TEXT NOT NULL,
    student_id TEXT NOT NULL,
    img TEXT NOT NULL,
    is_img_path BOOLEAN NOT NULL DEFAULT false,
    grades NUMERIC[] NOT NULL, -- Array de 4 notas del periodo
    conduct TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    parent_email TEXT NOT NULL,
    conduct_text TEXT NOT NULL,
    grade TEXT NOT NULL DEFAULT '2B', -- Grado/Salón al que pertenece (ej: '2B', '3A')
    incidents JSONB DEFAULT '[]'::jsonb,
    novelty_report JSONB DEFAULT '{}'::jsonb,
    subject_grades JSONB DEFAULT '{}'::jsonb,
    cedula TEXT,
    age INT,
    address TEXT,
    birth_year INT,
    blood_type TEXT,
    medical_conditions TEXT,
    tutor2_name TEXT,
    tutor2_phone TEXT,
    status TEXT DEFAULT 'Nuevo',
    attendance BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla de Finanzas ERP
CREATE TABLE public.finances (
    id INT PRIMARY KEY DEFAULT 1,
    budget_fece NUMERIC NOT NULL DEFAULT 12450.00,
    petty_cash NUMERIC NOT NULL DEFAULT 320.50,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 1) -- Asegura una única fila de balance
);

-- 4. Tabla de Mensajería
CREATE TABLE public.chat_messages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sender TEXT NOT NULL,
    content TEXT NOT NULL,
    is_sent_by_prof BOOLEAN NOT NULL DEFAULT false,
    student_key TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Tabla de Mensajería del Personal (Docentes y Administrador)
CREATE TABLE public.staff_messages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sender TEXT NOT NULL,
    receiver TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Seguridad a Nivel de Fila (RLS)
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad Libres (Ideal para Demostración y Sandbox)
DROP POLICY IF EXISTS "Permitir lectura pública de profesores" ON public.teachers;
DROP POLICY IF EXISTS "Permitir actualizaciones públicas de profesores" ON public.teachers;
CREATE POLICY "Permitir lectura pública de profesores" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Permitir actualizaciones públicas de profesores" ON public.teachers FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de estudiantes" ON public.students;
DROP POLICY IF EXISTS "Permitir actualizaciones públicas de estudiantes" ON public.students;
CREATE POLICY "Permitir lectura pública de estudiantes" ON public.students FOR SELECT USING (true);
CREATE POLICY "Permitir actualizaciones públicas de estudiantes" ON public.students FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de finanzas" ON public.finances;
DROP POLICY IF EXISTS "Permitir actualizaciones públicas de finanzas" ON public.finances;
CREATE POLICY "Permitir lectura pública de finanzas" ON public.finances FOR SELECT USING (true);
CREATE POLICY "Permitir actualizaciones públicas de finanzas" ON public.finances FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de mensajes" ON public.chat_messages;
DROP POLICY IF EXISTS "Permitir inserción pública de mensajes" ON public.chat_messages;
CREATE POLICY "Permitir lectura pública de mensajes" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Permitir inserción pública de mensajes" ON public.chat_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir lectura pública de mensajes de personal" ON public.staff_messages;
DROP POLICY IF EXISTS "Permitir inserción pública de mensajes de personal" ON public.staff_messages;
CREATE POLICY "Permitir lectura pública de mensajes de personal" ON public.staff_messages FOR SELECT USING (true);
CREATE POLICY "Permitir inserción pública de mensajes de personal" ON public.staff_messages FOR INSERT WITH CHECK (true);

-- Población de Semillas Iniciales (Seed Data)

-- Semillas de Profesores
INSERT INTO public.teachers (id, name, employee_id, cedula, profile_pic, age, specializations, subjects, assigned_grade)
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
  '2B'
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
  '3A'
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
  'kinder A'
);

-- Semillas de Estudiantes
INSERT INTO public.students (
  id, name, role, role_class, accent_class, student_id, img, is_img_path, 
  grades, conduct, parent_name, parent_phone, parent_email, conduct_text, 
  grade, incidents, novelty_report, subject_grades, cedula, age, address, 
  birth_year, blood_type, medical_conditions, tutor2_name, tutor2_phone, 
  status, attendance
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
  true
);

-- Semillas de Finanzas
INSERT INTO public.finances (id, budget_fece, petty_cash)
VALUES (1, 12450.00, 320.50);

-- Semillas de Mensajería (Vacío para iniciar limpio)

-- ==========================================================================
-- 🔊 TABLAS ADICIONALES PARA CONFIGURACIONES Y PLANIFICACIÓN EN TIEMPO REAL
-- ==========================================================================

-- 5. Tabla de Configuración de la Escuela
CREATE TABLE IF NOT EXISTS public.school_settings (
    id INT PRIMARY KEY DEFAULT 1,
    school_name TEXT NOT NULL DEFAULT 'EduLink Academia',
    school_address TEXT NOT NULL DEFAULT 'Calle 50, Ciudad de Panamá',
    admin_name TEXT NOT NULL DEFAULT 'Egnis Cano',
    school_logo TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_school_settings CHECK (id = 1)
);

-- 6. Tabla de Usuarios Administrativos Adicionales
CREATE TABLE IF NOT EXISTS public.school_users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    role_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabla de Planificación Académica
CREATE TABLE IF NOT EXISTS public.planning (
    id TEXT PRIMARY KEY, -- Ej: 'egnis_Matemáticas'
    teacher_id TEXT NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    syllabus JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array de temas
    activities JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array de actividades
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS para nuevas tablas
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planning ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad Libres para Nuevas Tablas (Sandbox)
DROP POLICY IF EXISTS "Permitir lectura de settings" ON public.school_settings;
DROP POLICY IF EXISTS "Permitir actualizaciones de settings" ON public.school_settings;
CREATE POLICY "Permitir lectura de settings" ON public.school_settings FOR SELECT USING (true);
CREATE POLICY "Permitir actualizaciones de settings" ON public.school_settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura de users" ON public.school_users;
DROP POLICY IF EXISTS "Permitir actualizaciones de users" ON public.school_users;
CREATE POLICY "Permitir lectura de users" ON public.school_users FOR SELECT USING (true);
CREATE POLICY "Permitir actualizaciones de users" ON public.school_users FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir lectura de planning" ON public.planning;
DROP POLICY IF EXISTS "Permitir actualizaciones de planning" ON public.planning;
CREATE POLICY "Permitir lectura de planning" ON public.planning FOR SELECT USING (true);
CREATE POLICY "Permitir actualizaciones de planning" ON public.planning FOR ALL USING (true);

-- Población de Semillas Adicionales
INSERT INTO public.school_settings (id, school_name, school_address, admin_name, school_logo)
VALUES (1, 'EduLink Academia', 'Calle 50, Ciudad de Panamá', 'Egnis Cano', '')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.school_users (id, name, role, role_name, phone, email)
VALUES
('user1', 'Lic. Ana Reyes', 'secretaria', '📝 Secretaria', '+507 6200-1111', 'ana.reyes@escuela.edu'),
('user2', 'Ing. Carlos Mendoza', 'sub administrador', '🔑 Sub Administrador', '+507 6200-2222', 'carlos.mendoza@escuela.edu')
ON CONFLICT (id) DO NOTHING;


-- ==========================================================================
-- 🔊 ACTIVACIÓN DE REALTIME DE SUPABASE (ACTUALIZADO PARA TODAS LAS TABLAS)
-- ==========================================================================

-- Habilitar replicación para todas las tablas del sistema
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.staff_messages;
alter publication supabase_realtime add table public.students;
alter publication supabase_realtime add table public.teachers;
alter publication supabase_realtime add table public.finances;
alter publication supabase_realtime add table public.school_settings;
alter publication supabase_realtime add table public.school_users;
alter publication supabase_realtime add table public.planning;

-- REPLICA IDENTITY FULL: asegura que Supabase Realtime envíe el row completo
-- en eventos UPDATE y DELETE (necesario para sincronización correcta de todos los campos)
ALTER TABLE public.students REPLICA IDENTITY FULL;
ALTER TABLE public.teachers REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.staff_messages REPLICA IDENTITY FULL;
ALTER TABLE public.school_settings REPLICA IDENTITY FULL;
ALTER TABLE public.school_users REPLICA IDENTITY FULL;
ALTER TABLE public.planning REPLICA IDENTITY FULL;
ALTER TABLE public.finances REPLICA IDENTITY FULL;


-- ==========================================================================
-- 📦 CONFIGURACIÓN DE SUPABASE STORAGE BUCKET
-- ==========================================================================

-- Crear el bucket 'school-assets' para fotos de logos, profesores, estudiantes, etc.
INSERT INTO storage.buckets (id, name, public)
VALUES ('school-assets', 'school-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de seguridad para el bucket 'school-assets' (lectura y escritura pública para demo)
DROP POLICY IF EXISTS "Permitir lectura pública de school-assets" ON storage.objects;
DROP POLICY IF EXISTS "Permitir inserción pública de school-assets" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualización pública de school-assets" ON storage.objects;
DROP POLICY IF EXISTS "Permitir eliminación pública de school-assets" ON storage.objects;

CREATE POLICY "Permitir lectura pública de school-assets" ON storage.objects FOR SELECT USING (bucket_id = 'school-assets');
CREATE POLICY "Permitir inserción pública de school-assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'school-assets');
CREATE POLICY "Permitir actualización pública de school-assets" ON storage.objects FOR UPDATE USING (bucket_id = 'school-assets');
CREATE POLICY "Permitir eliminación pública de school-assets" ON storage.objects FOR DELETE USING (bucket_id = 'school-assets');


-- ==========================================================================
-- 🛠️ COMANDOS DE MIGRACIÓN (EJECUTAR SI YA TIENES LA BASE DE DATOS CREADA)
-- ==========================================================================
-- ALTER TABLE public.students ADD COLUMN IF NOT EXISTS incidents JSONB DEFAULT '[]'::jsonb;
-- ALTER TABLE public.students ADD COLUMN IF NOT EXISTS novelty_report JSONB DEFAULT '{}'::jsonb;
-- ALTER TABLE public.students ADD COLUMN IF NOT EXISTS subject_grades JSONB DEFAULT '{}'::jsonb;
-- ALTER TABLE public.students ADD COLUMN IF NOT EXISTS cedula TEXT;
-- ALTER TABLE public.students ADD COLUMN IF NOT EXISTS age INT;
-- ALTER TABLE public.students ADD COLUMN IF NOT EXISTS address TEXT;
-- ALTER TABLE public.students ADD COLUMN IF NOT EXISTS birth_year INT;
-- ALTER TABLE public.students ADD COLUMN IF NOT EXISTS blood_type TEXT;
-- ALTER TABLE public.students ADD COLUMN IF NOT EXISTS medical_conditions TEXT;
-- ALTER TABLE public.students ADD COLUMN IF NOT EXISTS tutor2_name TEXT;
-- ALTER TABLE public.students ADD COLUMN IF NOT EXISTS tutor2_phone TEXT;
-- ALTER TABLE public.students ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Nuevo';
-- ALTER TABLE public.students ADD COLUMN IF NOT EXISTS attendance BOOLEAN DEFAULT true;



