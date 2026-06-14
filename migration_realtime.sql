-- ==========================================================================
-- MIGRACIÓN SEGURA: REPLICA IDENTITY FULL PARA SUPABASE REALTIME
-- ¡NO borra ni modifica datos! Solo cambia la configuración de replicación.
-- Ejecuta este script en el Editor SQL de Supabase cuando las tablas ya existen.
-- ==========================================================================

-- Necesario para que Supabase Realtime envíe el row completo en eventos UPDATE/DELETE.
-- Sin esto, solo llega la clave primaria y los cambios de asistencia, calificaciones, etc.
-- no se propagan correctamente al panel del administrador en tiempo real.

ALTER TABLE public.students         REPLICA IDENTITY FULL;
ALTER TABLE public.teachers         REPLICA IDENTITY FULL;

-- Agregar columna active_trimester a profesores si no existe
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS active_trimester INT DEFAULT 1;

ALTER TABLE public.chat_messages    REPLICA IDENTITY FULL;
ALTER TABLE public.staff_messages   REPLICA IDENTITY FULL;
ALTER TABLE public.school_settings  REPLICA IDENTITY FULL;
ALTER TABLE public.school_users     REPLICA IDENTITY FULL;
ALTER TABLE public.planning         REPLICA IDENTITY FULL;
ALTER TABLE public.finances         REPLICA IDENTITY FULL;

-- Verificación (opcional): lista las tablas con su REPLICA IDENTITY
-- SELECT schemaname, tablename, rowsecurity
-- FROM pg_tables WHERE schemaname = 'public';
