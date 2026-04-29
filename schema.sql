-- Box Automatismo - Supabase Schema

CREATE TABLE boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  widget_token TEXT NOT NULL UNIQUE,
  description TEXT,
  address TEXT,
  phone TEXT,
  schedule JSONB DEFAULT '[]',
  membership_plans JSONB DEFAULT '[]',
  classes JSONB DEFAULT '[]',
  faqs JSONB DEFAULT '[]',
  extra_info TEXT,
  coaches TEXT,
  widget_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  box_id UUID NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(box_id, session_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_boxes_widget_token ON boxes(widget_token);
CREATE INDEX idx_conversations_box_session ON conversations(box_id, session_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);

-- Anboto Crossfit - Real box data
INSERT INTO boxes (name, slug, widget_token, description, address, phone, schedule, membership_plans, classes, faqs, extra_info, coaches, widget_active) VALUES (
  'Anboto Crossfit',
  'anboto-crossfit',
  'anboto-token-2024',
  'Box de crossfit en Iurreta con ambiente familiar y acogedor. Valorado con 4.9/5 por más de 46 miembros. Box grande con fácil acceso, muy cerca de la salida de la autopista A8 Durango.',
  'Polígono Ertzilla, P4, 48215 Iurreta, Bizkaia',
  '688 661 924',
  '[
    {"day": "Lunes", "hours": "6:30 - 21:15"},
    {"day": "Martes", "hours": "6:30 - 21:15"},
    {"day": "Miércoles", "hours": "6:30 - 21:15"},
    {"day": "Jueves", "hours": "6:30 - 21:15"},
    {"day": "Viernes", "hours": "6:30 - 21:15"},
    {"day": "Sábado", "hours": "9:00 - 12:00"},
    {"day": "Domingo", "hours": "Cerrado"}
  ]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '[
    {"question": "¿Necesito experiencia previa?", "answer": "No, en absoluto. Empezarás aprendiendo los movimientos básicos adaptados a tu nivel. Todos hemos empezado desde cero."},
    {"question": "¿Qué es un WOD?", "answer": "WOD significa Workout of the Day, el entrenamiento del día. Cada día es diferente y se adapta a tu nivel."},
    {"question": "¿Cómo puedo apuntarme?", "answer": "Llámanos al 688 661 924 o escríbenos a anbotocf@gmail.com y te explicamos todo."},
    {"question": "¿Dónde estáis exactamente?", "answer": "Estamos en el Polígono Ertzilla, P4, Iurreta. Muy cerca de la salida de la autopista A8 de Durango, fácil aparcamiento."},
    {"question": "¿Puedo ir a una clase de prueba?", "answer": "¡Claro! Contáctanos y te apuntamos a una clase de prueba para que veas cómo es el ambiente."}
  ]'::jsonb,
  'Usamos WodBuster para gestionar las reservas de clases. Las plazas son limitadas y siempre hay un coach pendiente de ti. Ambiente muy familiar, somos una gran comunidad crossfitera en Durangaldea.',
  'Xabi Osa (entrenador y propietario), Mikel Blanco (entrenador), Illan Setien (entrenador), Izas Gastañaga',
  true
);

CREATE TABLE signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  box_id UUID REFERENCES boxes(id),
  nombre TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  nivel TEXT,
  origen TEXT DEFAULT 'formulario',
  created_at TIMESTAMPTZ DEFAULT NOW()
);