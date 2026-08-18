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

-- Anboto Fitness - Real box data
INSERT INTO boxes (name, slug, widget_token, description, address, phone, schedule, membership_plans, classes, faqs, extra_info, coaches, widget_active) VALUES (
  'Anboto Fitness',
  'anboto-fitness',
  'anboto-token-2024',
  'Box de entrenamiento en Iurreta con ambiente familiar y acogedor. Valorado con 4.9/5 por más de 46 miembros. Box grande con fácil acceso, muy cerca de la salida de la autopista A8 Durango.',
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
  '[
    {"day": 1, "classes": [
      {"time": "06:30", "name": "Wod", "wodbuster_id": 13638},
      {"time": "07:45", "name": "Oinarriak", "wodbuster_id": 13641},
      {"time": "10:15", "name": "Wod", "wodbuster_id": 13643},
      {"time": "12:45", "name": "Wod", "wodbuster_id": 13646},
      {"time": "14:30", "name": "Wod", "wodbuster_id": 13648},
      {"time": "17:15", "name": "Oinarriak", "wodbuster_id": 13652},
      {"time": "18:15", "name": "Wod", "wodbuster_id": 13653},
      {"time": "19:15", "name": "Wod", "wodbuster_id": 13655},
      {"time": "20:15", "name": "Kickbox", "wodbuster_id": 13658}
    ]},
    {"day": 2, "classes": [
      {"time": "06:30", "name": "Wod", "wodbuster_id": 13638},
      {"time": "07:45", "name": "Oinarriak", "wodbuster_id": 13641},
      {"time": "10:15", "name": "Wod", "wodbuster_id": 13643},
      {"time": "12:45", "name": "Wod", "wodbuster_id": 13646},
      {"time": "14:30", "name": "Wod", "wodbuster_id": 13648},
      {"time": "17:15", "name": "Oinarriak", "wodbuster_id": 13652},
      {"time": "18:15", "name": "Wod", "wodbuster_id": 13653},
      {"time": "19:15", "name": "Wod", "wodbuster_id": 13655},
      {"time": "20:15", "name": "Kickbox", "wodbuster_id": 13658}
    ]},
    {"day": 3, "classes": [
      {"time": "06:30", "name": "Wod", "wodbuster_id": 13638},
      {"time": "07:45", "name": "Oinarriak", "wodbuster_id": 13641},
      {"time": "10:15", "name": "Wod", "wodbuster_id": 13643},
      {"time": "12:45", "name": "Wod", "wodbuster_id": 13646},
      {"time": "14:30", "name": "Wod", "wodbuster_id": 13648},
      {"time": "17:15", "name": "Oinarriak", "wodbuster_id": 13652},
      {"time": "18:15", "name": "Wod", "wodbuster_id": 13653},
      {"time": "19:15", "name": "Wod", "wodbuster_id": 13655},
      {"time": "20:15", "name": "Kickbox", "wodbuster_id": 13658}
    ]},
    {"day": 4, "classes": [
      {"time": "06:30", "name": "Wod", "wodbuster_id": 13638},
      {"time": "07:45", "name": "Oinarriak", "wodbuster_id": 13641},
      {"time": "10:15", "name": "Wod", "wodbuster_id": 13643},
      {"time": "12:45", "name": "Wod", "wodbuster_id": 13646},
      {"time": "14:30", "name": "Wod", "wodbuster_id": 13648},
      {"time": "17:15", "name": "Oinarriak", "wodbuster_id": 13652},
      {"time": "18:15", "name": "Wod", "wodbuster_id": 13653},
      {"time": "19:15", "name": "Wod", "wodbuster_id": 13655},
      {"time": "20:15", "name": "Kickbox", "wodbuster_id": 13658}
    ]},
    {"day": 5, "classes": [
      {"time": "06:30", "name": "Wod", "wodbuster_id": 13638},
      {"time": "07:45", "name": "Oinarriak", "wodbuster_id": 13641},
      {"time": "10:15", "name": "Wod", "wodbuster_id": 13643},
      {"time": "12:45", "name": "Wod", "wodbuster_id": 13646},
      {"time": "14:30", "name": "Wod", "wodbuster_id": 13648},
      {"time": "17:15", "name": "Oinarriak", "wodbuster_id": 13652},
      {"time": "18:15", "name": "Wod", "wodbuster_id": 13653},
      {"time": "19:15", "name": "Wod", "wodbuster_id": 13655},
      {"time": "20:15", "name": "Kickbox", "wodbuster_id": 13658}
    ]},
    {"day": 6, "classes": [
      {"time": "06:30", "name": "Wod", "wodbuster_id": 13638},
      {"time": "07:45", "name": "Oinarriak", "wodbuster_id": 13641},
      {"time": "10:15", "name": "Wod", "wodbuster_id": 13643},
      {"time": "12:45", "name": "Wod", "wodbuster_id": 13646},
      {"time": "14:30", "name": "Wod", "wodbuster_id": 13648},
      {"time": "17:15", "name": "Oinarriak", "wodbuster_id": 13652},
      {"time": "18:15", "name": "Wod", "wodbuster_id": 13653},
      {"time": "19:15", "name": "Wod", "wodbuster_id": 13655},
      {"time": "20:15", "name": "Kickbox", "wodbuster_id": 13658}
    ]}
  ]'::jsonb,
  '[
    {"question": "¿Necesito experiencia previa?", "answer": "No, en absoluto. Empezarás aprendiendo los movimientos básicos adaptados a tu nivel. Todos hemos empezado desde cero."},
    {"question": "¿Qué es un WOD?", "answer": "WOD significa Workout of the Day, el entrenamiento del día. Cada día es diferente y se adapta a tu nivel."},
    {"question": "¿Cómo puedo apuntarme?", "answer": "Llámanos al 688 661 924 o escríbenos a anbotocf@gmail.com y te explicamos todo."},
    {"question": "¿Dónde estáis exactamente?", "answer": "Estamos en el Polígono Ertzilla, P4, Iurreta. Muy cerca de la salida de la autopista A8 de Durango, fácil aparcamiento."},
    {"question": "¿Puedo ir a una clase de prueba?", "answer": "¡Claro! Contáctanos y te apuntamos a una clase de prueba para que veas cómo es el ambiente."}
  ]'::jsonb,
  'Usamos WodBuster para gestionar las reservas de clases. Las plazas son limitadas y siempre hay un coach pendiente de ti. Ambiente muy familiar, somos una gran comunidad en Durangaldea.',
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
  objetivo TEXT,
  como_conocio TEXT,
  origen TEXT DEFAULT 'formulario',
  followup_sent BOOLEAN DEFAULT false,
  followup_sent_at TIMESTAMPTZ,
  wants_to_join BOOLEAN,
  scheduling_email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE signup_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signup_id UUID NOT NULL REFERENCES signups(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  used BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE class_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signup_id UUID NOT NULL REFERENCES signups(id) ON DELETE CASCADE,
  box_id UUID NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,
  wodbuster_class_id INTEGER NOT NULL,
  class_date DATE NOT NULL,
  class_time TIME NOT NULL,
  class_capacity INTEGER,
  booked_at TIMESTAMPTZ DEFAULT NOW(),
  booking_status TEXT DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'cancelled', 'failed')),
  UNIQUE(signup_id, class_date, class_time)
);

CREATE INDEX idx_signup_tokens_token ON signup_tokens(token);
CREATE INDEX idx_signup_tokens_signup ON signup_tokens(signup_id);
CREATE INDEX idx_class_bookings_signup ON class_bookings(signup_id);
CREATE INDEX idx_class_bookings_date ON class_bookings(class_date, class_time);

-- WodBuster config (session cookie, etc.)
CREATE TABLE wodbuster_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);