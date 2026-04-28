<?php
/**
 * Script de contacto - Trifarma (versión final optimizada)
 */

// Headers básicos
header('Content-Type: application/json; charset=utf-8');

// Configuración
$config = [
    'destinatario' => 'info@drogueriatrifarma.com',
    'asunto' => 'Nuevo mensaje desde Trifarma Web',
    'honeypot_field' => 'url',
    'rate_limit' => [
        'max_requests' => 3,
        'time_window' => 900 // 15 min
    ]
];

// ==========================
// CONTROLADOR PRINCIPAL
// ==========================
function manejarSolicitud() {

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        enviarError(405, 'Método no permitido');
    }

    if (empty($_SERVER['HTTP_X_REQUESTED_WITH'])) {
        enviarError(400, 'Solicitud inválida');
    }

    try {
        if (!aplicarRateLimit()) {
            enviarError(429, 'Demasiadas solicitudes, intenta más tarde');
        }

        $datos = validarDatos($_POST);

        if (!enviarEmail($datos)) {
            throw new Exception('No se pudo enviar el correo');
        }

        logEvento('OK', 'Formulario enviado');

        echo json_encode([
            'success' => true,
            'message' => 'Mensaje enviado correctamente'
        ]);

    } catch (Exception $e) {
        logEvento('ERROR', $e->getMessage());
        enviarError(400, $e->getMessage());
    }
}

// ==========================
// VALIDACIÓN
// ==========================
function validarDatos($data) {
    global $config;

    // Honeypot
    if (!empty($data[$config['honeypot_field']])) {
        throw new Exception('Spam detectado');
    }

    $nombre = trim($data['nombre'] ?? '');
    $telefono = trim($data['telefono'] ?? '');
    $codigo = trim($data['codigo_pais'] ?? '+502');
    $departamento = trim($data['departamento'] ?? '');
    $mensaje = trim($data['mensaje'] ?? '');

    if (strlen($nombre) < 2 || strlen($nombre) > 100) {
        throw new Exception('Nombre inválido');
    }

    if (!preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\.]+$/', $nombre)) {
        throw new Exception('Nombre contiene caracteres inválidos');
    }

    if (!preg_match('/^\d{4}-\d{4}$/', $telefono)) {
        throw new Exception('Formato de teléfono inválido');
    }

    if (empty($departamento)) {
        throw new Exception('Selecciona un departamento');
    }

    if (strlen($mensaje) < 10 || strlen($mensaje) > 2000) {
        throw new Exception('Mensaje inválido');
    }

    return [
        'nombre' => htmlspecialchars($nombre),
        'telefono' => htmlspecialchars($codigo . ' ' . $telefono),
        'departamento' => htmlspecialchars($departamento),
        'mensaje' => htmlspecialchars($mensaje)
    ];
}

// ==========================
// ENVÍO DE CORREO
// ==========================
function enviarEmail($datos) {
    global $config;

    $contenido = construirEmail($datos);

    $headers = [
        'From: Trifarma <no-reply@drogueriatrifarma.com>',
        'Content-Type: text/html; charset=UTF-8',
        'MIME-Version: 1.0'
    ];

    return mail(
        $config['destinatario'],
        '=?UTF-8?B?' . base64_encode($config['asunto']) . '?=',
        $contenido,
        implode("\r\n", $headers)
    );
}

// ==========================
// TEMPLATE EMAIL
// ==========================
function construirEmail($d) {

    return "
    <h2>Nuevo mensaje desde Trifarma</h2>

    <p><strong>Nombre:</strong> {$d['nombre']}</p>
    <p><strong>Teléfono:</strong> {$d['telefono']}</p>
    <p><strong>Departamento:</strong> {$d['departamento']}</p>

    <p><strong>Mensaje:</strong><br>
    {$d['mensaje']}
    </p>
    ";
}

// ==========================
// RATE LIMIT
// ==========================
function aplicarRateLimit() {
    global $config;

    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $file = sys_get_temp_dir() . '/rate_' . md5($ip);
    $now = time();

    $data = file_exists($file)
        ? json_decode(file_get_contents($file), true)
        : ['t' => []];

    $data['t'] = array_filter($data['t'], fn($t) =>
        ($now - $t) < $config['rate_limit']['time_window']
    );

    if (count($data['t']) >= $config['rate_limit']['max_requests']) {
        return false;
    }

    $data['t'][] = $now;

    file_put_contents($file, json_encode($data), LOCK_EX);

    return true;
}

// ==========================
// UTILIDADES
// ==========================
function enviarError($code, $msg) {
    http_response_code($code);
    echo json_encode(['error' => $msg]);
    exit;
}

function logEvento($tipo, $msg) {
    $log = __DIR__ . '/contactos.log';
    $fecha = date('Y-m-d H:i:s');
    file_put_contents($log, "[$fecha][$tipo] $msg\n", FILE_APPEND);
}

// ==========================
// EJECUCIÓN
// ==========================
manejarSolicitud();