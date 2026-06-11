-- ==========================================================================
-- EDULINK DATABASE SCHEMA SETUP
-- Ejecuta este script en el editor SQL de tu panel de Supabase
-- ==========================================================================

-- Limpieza previa (opcional)
DROP TABLE IF EXISTS public.chat_messages;
DROP TABLE IF EXISTS public.finances;
DROP TABLE IF EXISTS public.students;
DROP TABLE IF EXISTS public.teachers;

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

-- Habilitar Seguridad a Nivel de Fila (RLS)
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad Libres (Ideal para Demostración y Sandbox)
CREATE POLICY "Permitir lectura pública de profesores" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Permitir actualizaciones públicas de profesores" ON public.teachers FOR ALL USING (true);

CREATE POLICY "Permitir lectura pública de estudiantes" ON public.students FOR SELECT USING (true);
CREATE POLICY "Permitir actualizaciones públicas de estudiantes" ON public.students FOR ALL USING (true);

CREATE POLICY "Permitir lectura pública de finanzas" ON public.finances FOR SELECT USING (true);
CREATE POLICY "Permitir actualizaciones públicas de finanzas" ON public.finances FOR ALL USING (true);

CREATE POLICY "Permitir lectura pública de mensajes" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Permitir inserción pública de mensajes" ON public.chat_messages FOR INSERT WITH CHECK (true);

-- Población de Semillas Iniciales (Seed Data)

-- Semillas de Profesores
INSERT INTO public.teachers (id, name, employee_id, cedula, profile_pic, age, specializations, subjects, assigned_grade)
VALUES
('egnis', 'Prof. Egnis Cano', 'ED-90210', '8-990-1234', 'assets/prof_egnis.png', 32, '{"Lic. en Educación Matemática", "MSc. en Docencia Superior", "Curso Superior de Álgebra"}', '{"Matemáticas", "Geometría", "Álgebra"}', '2B'),
('maria', 'Prof. María Delgado', 'ED-40812', '4-780-5543', 'MD', 28, '{"Lic. en Ciencias de la Educación", "Diplomado en Robótica Educativa", "Curso de Física Teórica"}', '{"Ciencias Naturales", "Física"}', '3A');

-- Semillas de Estudiantes (relacionados por grade)
INSERT INTO public.students (id, name, role, role_class, accent_class, student_id, img, is_img_path, grades, conduct, parent_name, parent_phone, parent_email, conduct_text, grade)
VALUES
('juan', 'Juan Pérez', 'Estudiante Destacado', 'badge-lime', 'accent-lime', '#EL-20412', 'assets/student_juan.png', true, '{4.5, 4.8, 4.6}', 'excelente', 'Carlos Pérez (Padre)', '+507 6890-4432', 'carlos.perez@email.com', 'Juan demuestra gran liderazgo y participación constante. ¡Sigue así!', '2B'),
('sofia', 'Sofía Gómez', 'Ayudante de Clase', 'badge-cyan', 'accent-purple', '#EL-20413', 'SG', false, '{4.5, 4.2, 4.4}', 'enfocado', 'Marta Gómez (Madre)', '+507 6221-5589', 'marta.gomez@email.com', 'Sofía es sumamente disciplinada, atenta y siempre apoya a sus compañeros.', '2B'),
('mateo', 'Mateo Díaz', 'En Crecimiento', 'badge-orange', 'accent-orange', '#EL-20414', 'MD', false, '{3.5, 3.2, 3.8}', 'conversador', 'Felipe Díaz (Tutor)', '+507 6445-1290', 'felipe.diaz@email.com', 'Mateo es muy creativo, pero se distrae conversando. Necesita apoyo adicional.', '3A'),
('valentina', 'Valentina Torres', 'Excelencia Académica', 'badge-yellow', 'accent-cyan', '#EL-20415', 'VT', false, '{4.8, 4.9, 5.0}', 'participativo', 'Ana Torres (Madre)', '+507 6112-9876', 'ana.torres@email.com', 'Valentina mantiene el promedio más alto. Participa activamente en todas las clases.', '2B'),
('diego', 'Diego Rojas', 'Ayudante de Laboratorio', 'badge-cyan', 'accent-lime', '#EL-20416', 'DR', false, '{4.0, 4.1, 4.2}', 'enfocado', 'Julia Rojas (Madre)', '+507 6332-9011', 'julia.rojas@email.com', 'Diego demuestra gran interés en experimentos prácticos y apoyo técnico.', '3A'),
('camila', 'Camila Vega', 'Líder de Proyecto', 'badge-yellow', 'accent-cyan', '#EL-20417', 'CV', false, '{4.6, 4.7, 4.8}', 'excelente', 'Oscar Vega (Padre)', '+507 6554-3210', 'oscar.vega@email.com', 'Camila es muy proactiva y dirige las dinámicas de grupo de manera sobresaliente.', '3A');

-- Semillas de Finanzas
INSERT INTO public.finances (id, budget_fece, petty_cash)
VALUES (1, 12450.00, 320.50);

-- Semillas de Mensajería
INSERT INTO public.chat_messages (sender, content, is_sent_by_prof, student_key)
VALUES
('Papá de Juan', 'Buenos días Prof. Egnis, ¿cómo va el progreso de Juan en matemáticas?', false, 'juan'),
('Prof. Egnis Cano', '¡Hola Carlos! Juan va excelente. Hoy sacó 4.8 en su examen práctico.', true, 'juan'),
('Felipe Díaz (Tutor)', 'Hola profesor, ¿ha mejorado la concentración de Mateo en el aula?', false, 'mateo');

-- ==========================================================================
-- 🔊 ACTIVACIÓN DE REALTIME DE SUPABASE
-- Esto permite la actualización automática del chat de padres-profesores
-- ==========================================================================
alter publication supabase_realtime add table public.chat_messages;

-- ==========================================================================
-- 📦 CONFIGURACIÓN DE SUPABASE STORAGE BUCKET
-- ==========================================================================

-- Crear el bucket 'school-assets' para fotos de logos, profesores, estudiantes, etc.
INSERT INTO storage.buckets (id, name, public)
VALUES ('school-assets', 'school-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de seguridad para el bucket 'school-assets' (lectura y escritura pública para demo)
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


