# Hook Stop: revisa y actualiza archivos de memoria al finalizar la sesión.
# Usa una ventana de 45 minutos para no dispararse en cada turno de una conversación larga.

$root    = "C:\Users\Mikel\Desktop\Proyectos\Bidener"
$lastFile = "$root\memory\.last_memory_update"
$pending  = "$root\memory\.memory_update_pending"
$log      = "$root\memory\session_log.md"
$now      = Get-Date

# --- Caso 1: Claude acaba de revisar la memoria (segundo Stop tras el exit 2) ---
if (Test-Path $pending) {
    Remove-Item $pending -Force
    $ts = $now.ToString("yyyy-MM-dd HH:mm:ss")
    Set-Content -Path $lastFile -Value $ts -Encoding UTF8
    Add-Content -Path $log -Value "[$ts] Revision de memoria completada" -Encoding UTF8
    exit 0
}

# --- Caso 2: Revisión reciente (< 45 min) — no hacer nada ---
if (Test-Path $lastFile) {
    try {
        $lastUpdate = [datetime]::ParseExact(
            (Get-Content $lastFile -Raw).Trim(),
            "yyyy-MM-dd HH:mm:ss",
            [System.Globalization.CultureInfo]::InvariantCulture
        )
        if (($now - $lastUpdate).TotalMinutes -lt 45) {
            exit 0
        }
    } catch { }
}

# --- Caso 3: Pedir a Claude que actualice la memoria ---
Set-Content -Path $pending -Value ($now.ToString("yyyy-MM-dd HH:mm:ss")) -Encoding UTF8
Write-Output "La sesion esta terminando. Revisa si aprendiste algo nuevo sobre el usuario, el proyecto, las personas o las preferencias. Actualiza los archivos memory/ que correspondan. Responde SOLO con: 'Memoria actualizada: [lista de archivos]' o 'Sin cambios nuevos.'"
exit 2
