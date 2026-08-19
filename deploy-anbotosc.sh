#!/bin/bash
set -e

echo "🌍 Verificando si anbotosc.com resuelve..."

# Intenta resolver el dominio
if nslookup anbotosc.com >/dev/null 2>&1; then
  echo "✅ anbotosc.com resuelve"
else
  echo "⏳ anbotosc.com aún no resuelve. Espera un poco más e intenta de nuevo."
  exit 1
fi

echo ""
echo "🚀 Desplegando a Vercel con anbotosc.com..."
echo ""

cd "$(dirname "$0")"
vercel --prod

echo ""
echo "✅ Deploy completado. Tu web está en https://anbotosc.com"
