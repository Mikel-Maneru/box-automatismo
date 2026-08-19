const { createClient } = require('@supabase/supabase-js');

// Inicialización PEREZOSA: no revienta al importar el módulo. Esto permite que la
// app arranque aunque falten las env (p.ej. en un preview de Vercel sin las vars),
// sirviendo la web estática; el error solo salta si se USA Supabase sin configurar.
// En producción (con las env presentes) el comportamiento es idéntico al anterior.
let client = null;
function getClient() {
  if (client) return client;
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('SUPABASE_URL y SUPABASE_SERVICE_KEY son obligatorias');
  }
  client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  return client;
}

// Proxy: `supabase.from(...)`, `supabase.auth`, etc. siguen funcionando igual,
// pero el cliente se crea en el primer uso, no al importar.
module.exports = new Proxy({}, {
  get(_target, prop) {
    const c = getClient();
    const value = c[prop];
    return typeof value === 'function' ? value.bind(c) : value;
  },
});
