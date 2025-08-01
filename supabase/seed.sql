-- Roles
INSERT INTO op3dcloud.roles (name) VALUES
  ('admin'),
  ('planner'),
  ('client'),
  ('patient');

-- Patients
-- Seeder para op3dcloud.patients
INSERT INTO op3dcloud.patients (
  name, 
  last_name, 
  type_of_plan, 
  treatment_approach, 
  treatment_objective, 
  dental_restrictions, 
  declared_limitations, 
  suggested_adminations_and_actions, 
  observations_or_instructions, 
  files, 
  sworn_declaration
) VALUES 
  ('Ana', 'García', 'Plan Básico', 'Ortodóncia Fija', 'Corrección de apiñamiento dental', 'Alergia al níquel', 'Limitación de apertura bucal', 'Controles mensuales y uso de hilo dental', 'Evitar alimentos duros los primeros días', 'radiografia_ana_001.jpg', true),
  
  ('Carlos', 'Rodríguez', 'Plan Premium', 'Invisalign', 'Alineación dental completa', 'Ninguna conocida', 'Ninguna declarada', 'Uso de aligners 22 horas diarias', 'Cambiar aligners cada 2 semanas', 'scan_carlos_002.stl', true),
  
  ('María', 'López', 'Plan Estándar', 'Ortodóncia Interceptiva', 'Corrección temprana de mordida cruzada', 'Problemas de ATM', 'Dolor ocasional en mandíbula', 'Ejercicios de relajación mandibular', 'Monitoreo constante de dolor', 'foto_maria_003.jpg', false),
  
  ('José', 'Martínez', 'Plan Básico', 'Aparatos Removibles', 'Expansión del paladar', 'Ninguna conocida', 'Dificultad para hablar con aparatos', 'Práctica de pronunciación diaria', 'Paciencia durante adaptación', 'molde_jose_004.stl', true),
  
  ('Laura', 'Sánchez', 'Plan Premium', 'Ortodóncia Lingual', 'Corrección estética sin brackets visibles', 'Alergia a metales', 'Sensibilidad dental aumentada', 'Uso de pasta desensibilizante', 'Evitar bebidas muy frías', 'panoramica_laura_005.jpg', true),
  
  ('Pedro', 'González', 'Plan Estándar', 'Ortodóncia Fija', 'Cierre de diastema central', 'Ninguna conocida', 'Bruxismo nocturno', 'Uso de placa de descarga nocturna', 'Controlar estrés y tensión', 'estudio_pedro_006.pdf', false),
  
  ('Carmen', 'Fernández', 'Plan Básico', 'Aparatos Funcionales', 'Corrección de sobremordida', 'Problemas periodontales', 'Sangrado de encías', 'Limpieza profesional trimestral', 'Técnica de cepillado mejorada', 'periodontograma_carmen_007.jpg', true),
  
  ('Antonio', 'Ruiz', 'Plan Premium', 'Ortodóncia Autoligable', 'Alineación y nivelación completa', 'Ninguna conocida', 'Ninguna declarada', 'Controles cada 8 semanas', 'Mantener excelente higiene oral', 'cefalometria_antonio_008.jpg', true),
  
  ('Isabel', 'Jiménez', 'Plan Estándar', 'Invisalign Teen', 'Tratamiento durante crecimiento', 'Alergia al látex', 'Actividades deportivas intensas', 'Uso de protector bucal en deportes', 'Cuidado especial durante entrenamientos', 'fotos_isabel_009.zip', false),
  
  ('Miguel', 'Moreno', 'Plan Básico', 'Ortodóncia Fija', 'Corrección de mordida abierta', 'Problemas de deglución', 'Interposición lingual', 'Terapia miofuncional complementaria', 'Ejercicios de deglución diarios', 'video_deglucion_miguel_010.mp4', true),
  
  ('Rosa', 'Álvarez', 'Plan Premium', 'Ortodoncia Digital', 'Planificación 3D personalizada', 'Ninguna conocida', 'Ansiedad dental', 'Sedación consciente si es necesario', 'Ambiente relajado y música suave', 'scan3d_rosa_011.stl', true),
  
  ('Francisco', 'Romero', 'Plan Estándar', 'Aparatos Híbridos', 'Combinación de técnicas', 'Implantes dentales presentes', 'Zona implantada sensible', 'Cuidado especial en zona de implantes', 'Irrigador bucal recomendado', 'radiografia_implantes_francisco_012.jpg', false),
  
  ('Elena', 'Torres', 'Plan Básico', 'Ortodóncia Preventiva', 'Mantenimiento de espacios', 'Ninguna conocida', 'Pérdida prematura de molares', 'Mantenedores de espacio temporales', 'Control de erupción de permanentes', 'panoramica_elena_013.jpg', true),
  
  ('Raúl', 'Vargas', 'Plan Premium', 'Ortodóncia Acelerada', 'Tratamiento rápido con vibración', 'Ninguna conocida', 'Disponibilidad limitada de tiempo', 'Uso de dispositivo acelerador diario', 'Compromiso total con el tratamiento', 'plan_acelerado_raul_014.pdf', true),
  
  ('Pilar', 'Castro', 'Plan Estándar', 'Ortodóncia Estética', 'Brackets cerámicos transparentes', 'Alergia a colorantes', 'Manchas dentales previas', 'Blanqueamiento post-tratamiento', 'Evitar alimentos que tiñen', 'fotos_color_pilar_015.jpg', false),
  
  ('Sergio', 'Ortega', 'Plan Básico', 'Aparatos de Tracción', 'Corrección de caninos incluidos', 'Ninguna conocida', 'Caninos impactados bilaterales', 'Exposición quirúrgica programada', 'Coordinación con cirugía oral', 'tac_caninos_sergio_016.dcm', true),
  
  ('Lucía', 'Ramos', 'Plan Premium', 'Ortodóncia Invisible', 'Corrección discreta para adultos', 'Sensibilidad al plástico', 'Trabajo que requiere hablar mucho', 'Período de adaptación gradual', 'Práctica de dicción en casa', 'impresiones_lucia_017.stl', true),
  
  ('Alberto', 'Herrera', 'Plan Estándar', 'Ortodóncia Correctiva', 'Tratamiento integral complejo', 'Diabetes tipo 2 controlada', 'Cicatrización lenta', 'Control glucémico estricto', 'Monitoreo de cicatrización', 'historial_medico_alberto_018.pdf', false),
  
  ('Nuria', 'Peña', 'Plan Básico', 'Expansión Palatina', 'Corrección de paladar estrecho', 'Ninguna conocida', 'Respiración bucal habitual', 'Ejercicios respiratorios complementarios', 'Seguimiento con otorrinolaringólogo', 'estudio_respiratorio_nuria_019.pdf', true),
  
  ('Víctor', 'Mendoza', 'Plan Premium', 'Ortodóncia Multidisciplinar', 'Tratamiento coordinado con implantes', 'Osteoporosis en tratamiento', 'Medicación con bifosfonatos', 'Coordinación con médico tratante', 'Protocolo especial para osteoporosis', 'densitometria_victor_020.pdf', true);