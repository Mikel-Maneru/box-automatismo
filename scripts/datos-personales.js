#!/usr/bin/env node
/**
 * Ejercicio de derechos y conservacion de datos (RGPD).
 *
 * Existe para poder atender una solicitud de acceso o de supresion sin improvisar y sin
 * entrar a mano en el panel de Supabase, que es como se cometen los errores.
 *
 *   node scripts/datos-personales.js ver <email-o-telefono>
 *   node scripts/datos-personales.js borrar <email-o-telefono>          (simulacro)
 *   node scripts/datos-personales.js borrar <email-o-telefono> --de-verdad
 *   node scripts/datos-personales.js caducados                          (simulacro)
 *   node scripts/datos-personales.js caducados --de-verdad
 *
 * NADA borra sin `--de-verdad`. Por defecto solo enseña lo que haria: sobre datos de
 * personas reales, un simulacro cuesta cinco segundos y un borrado equivocado no se deshace.
 */
require('dotenv').config({ override: true });
const supabase = require('../src/lib/supabase');
const MESES = require('../shared/legal.json').conservacion_meses;

const [, , accion, criterio] = process.argv;
const DE_VERDAD = process.argv.includes('--de-verdad');

// signup_tokens y class_bookings cuelgan de signups por signup_id; se borran antes para no
// dejar huerfanos si la tabla no tiene ON DELETE CASCADE.
const DEPENDIENTES = ['signup_tokens', 'class_bookings'];

async function buscar(valor) {
  // `*` y no una lista de columnas: si se nombran, el script revienta mientras el ALTER
  // TABLE de las columnas de consentimiento siga sin ejecutarse en Supabase. Una solicitud
  // de acceso no puede depender de una migracion pendiente.
  const { data, error } = await supabase
    .from('signups')
    .select('*')
    .or(`email.eq.${valor},telefono.eq.${valor}`);
  if (error) throw error;
  return data || [];
}

async function borrarSignups(filas) {
  for (const f of filas) {
    for (const tabla of DEPENDIENTES) {
      const { error } = await supabase.from(tabla).delete().eq('signup_id', f.id);
      if (error) console.error(`   aviso: ${tabla} -> ${error.message}`);
    }
    const { error } = await supabase.from('signups').delete().eq('id', f.id);
    console.log(`   ${f.id} ${error ? 'ERROR: ' + error.message : 'borrado'}`);
  }
}

(async () => {
  if (accion === 'ver' || accion === 'borrar') {
    if (!criterio) return console.error('Falta el email o el telefono.');
    const filas = await buscar(criterio);
    if (!filas.length) return console.log('No hay datos de esa persona.');

    console.log(`\n${filas.length} registro(s):\n`);
    filas.forEach((f) => console.log(JSON.stringify(f, null, 2)));

    if (accion === 'ver') {
      console.log('\nEsto es lo que hay que entregar si pide acceso a sus datos.');
      console.log('Ojo: las conversaciones del chat NO se pueden cruzar con una persona,');
      console.log('porque se guardan por sesion anonima y no llevan email ni telefono.');
      return;
    }

    if (!DE_VERDAD) {
      console.log('\nSIMULACRO. Se borrarian esos registros y lo que cuelgue de ellos.');
      console.log('Para hacerlo de verdad, repite el comando con --de-verdad');
      return;
    }
    console.log('\nBorrando:');
    await borrarSignups(filas);
    console.log('\nHecho. Conviene responder a la persona confirmando la supresion.');
    return;
  }

  if (accion === 'caducados') {
    const limite = new Date();
    limite.setMonth(limite.getMonth() - MESES);
    const { data, error } = await supabase
      .from('signups')
      .select('id, nombre, created_at')
      .lt('created_at', limite.toISOString());
    if (error) throw error;

    console.log(`\nPlazo de conservacion: ${MESES} meses (shared/legal.json).`);
    console.log(`Anteriores a ${limite.toISOString().slice(0, 10)}: ${(data || []).length}\n`);
    (data || []).forEach((f) => console.log(`   ${f.id}  ${f.created_at.slice(0, 10)}  ${f.nombre}`));

    if (!(data || []).length) return;
    if (!DE_VERDAD) {
      console.log('\nSIMULACRO. Repite con --de-verdad para borrarlos.');
      return;
    }
    console.log('\nBorrando:');
    await borrarSignups(data);
    return;
  }

  console.log(`Uso:
  node scripts/datos-personales.js ver <email-o-telefono>
  node scripts/datos-personales.js borrar <email-o-telefono> [--de-verdad]
  node scripts/datos-personales.js caducados [--de-verdad]`);
})().catch((e) => { console.error('Error:', e.message); process.exit(1); });
