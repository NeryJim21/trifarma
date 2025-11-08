<?php
/**
 * Script de contacto optimizado para Trifarma
 * Maneja el envío seguro de formularios con validación robusta
 * Versión: 2.0.0
 */

// =============================================================================
// CONFIGURACIÓN
// =============================================================================

// Headers de seguridad y tipo de contenido
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Configuración de la aplicación
$config = [
    // Email de destino
    'destinatario' => 'info@drogueriatrifarma.com',
    
    // Asunto del email
    'asunto' => 'Nuevo mensaje desde Trifarma Web',
    
    // Límites de longitud
    'limite_longitud' => [
        'nombre' => 100,
        'email' => 150,
        'mensaje' => 2000
    ],
    
    // Campo honeypot para detección de bots
    'honeypot_field' => 'url',
    
    // Rate limiting (protección contra spam)
    'rate_limit' => [
        'max_requests' => 3,        // Máximo de solicitudes
        'time_window' => 900        // Ventana de tiempo en segundos (15 minutos)
    ],
    
    // Dominios de email bloqueados
    'dominios_bloqueados' => [
        'example.com',
        'test.com',
        'fake.com',
        'spam.com',
        'mailinator.com',
        'guerrillamail.com'
    ]
];

// =============================================================================
// FUNCIONES PRINCIPALES
// =============================================================================

/**
 * Maneja la solicitud principal
 */
function manejarSolicitud() {
    global $config;
    
    // Validar método HTTP
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        enviarError(405, 'Método no permitido', 'Solo se permiten solicitudes POST');
        return;
    }
    
    // Verificar cabecera AJAX para solicitudes legítimas
    if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || 
        strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) !== 'xmlhttprequest') {
        enviarError(400, 'Solicitud no válida', 'Esta acción requiere una solicitud AJAX');
        return;
    }
    
    try {
        // Aplicar rate limiting
        if (!aplicarRateLimit()) {
            enviarError(429, 'Límite de solicitudes excedido', 
                       'Por favor, espera antes de enviar otro mensaje');
            return;
        }
        
        // Validar y sanitizar datos
        $datos = validarYSanitizarDatos($_POST);
        
        // Construir y enviar email
        $enviado = enviarEmail($datos, $config);
        
        if ($enviado) {
            // Log exitoso
            logEvento('EMAIL_ENVIADO', $datos['email']);
            
            // Respuesta de éxito
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Mensaje enviado correctamente. Te contactaremos pronto.',
                'timestamp' => time()
            ]);
            
        } else {
            throw new Exception('Error al enviar el correo electrónico');
        }

    } catch (Exception $e) {
        enviarError(400, 'Error de validación', $e->getMessage());
        logEvento('ERROR_ENVIO', $e->getMessage());
        
    } catch (Throwable $t) {
        enviarError(500, 'Error del servidor', 'Error interno del servidor. Por favor, intenta más tarde.');
        logEvento('ERROR_CRITICO', $t->getMessage());
    }
}

/**
 * Aplica rate limiting básico por IP
 */
function aplicarRateLimit() {
    $ip = obtenerIPCliente();
    $rateFile = sys_get_temp_dir() . '/trifarma_rate_' . md5($ip);
    $currentTime = time();
    $config = $GLOBALS['config']['rate_limit'];
    
    // Cargar datos existentes o inicializar
    if (file_exists($rateFile)) {
        $data = json_decode(file_get_contents($rateFile), true) ?: ['requests' => []];
        
        // Limpiar solicitudes antiguas
        $data['requests'] = array_filter($data['requests'], function($time) use ($currentTime, $config) {
            return ($currentTime - $time) < $config['time_window'];
        });
        
        // Verificar límite
        if (count($data['requests']) >= $config['max_requests']) {
            return false;
        }
    } else {
        $data = ['requests' => []];
    }
    
    // Agregar solicitud actual
    $data['requests'][] = $currentTime;
    
    // Guardar datos
    if (!file_put_contents($rateFile, json_encode($data), LOCK_EX)) {
        logEvento('RATE_LIMIT_ERROR', 'No se pudo guardar el archivo de rate limit');
    }
    
    return true;
}

/**
 * Valida y sanitiza los datos del formulario
 */
function validarYSanitizarDatos($postData) {
    $errores = [];
    $datos = [];
    $config = $GLOBALS['config'];
    
    // Detección de spam (honeypot)
    if (!empty($postData[$config['honeypot_field']])) {
        throw new Exception('Solicitud detectada como spam');
    }
    
    // Validar nombre
    if (empty($postData['nombre'])) {
        $errores[] = 'El nombre es obligatorio';
    } else {
        $nombre = trim($postData['nombre']);
        $nombre = filter_var($nombre, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW);
        
        if (strlen($nombre) < 2) {
            $errores[] = 'El nombre debe tener al menos 2 caracteres';
        } elseif (strlen($nombre) > $config['limite_longitud']['nombre']) {
            $errores[] = 'El nombre es demasiado largo';
        } elseif (!preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\.]+$/', $nombre)) {
            $errores[] = 'El nombre contiene caracteres no válidos';
        } else {
            $datos['nombre'] = $nombre;
        }
    }
    
    // Validar email
    if (empty($postData['email'])) {
        $errores[] = 'El email es obligatorio';
    } else {
        $email = trim($postData['email']);
        $email = filter_var($email, FILTER_SANITIZE_EMAIL);
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errores[] = 'El formato del email no es válido';
        } elseif (strlen($email) > $config['limite_longitud']['email']) {
            $errores[] = 'El email es demasiado largo';
        } elseif (esEmailBloqueado($email)) {
            $errores[] = 'El dominio de email no está permitido';
        } else {
            $datos['email'] = $email;
        }
    }
    
    // Validar mensaje
    if (empty($postData['mensaje'])) {
        $errores[] = 'El mensaje es obligatorio';
    } else {
        $mensaje = trim($postData['mensaje']);
        $mensaje = filter_var($mensaje, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW);
        
        if (strlen($mensaje) < 10) {
            $errores[] = 'El mensaje debe tener al menos 10 caracteres';
        } elseif (strlen($mensaje) > $config['limite_longitud']['mensaje']) {
            $errores[] = 'El mensaje es demasiado largo';
        } else {
            $datos['mensaje'] = $mensaje;
        }
    }
    
    if (!empty($errores)) {
        throw new Exception(implode(', ', $errores));
    }
    
    return $datos;
}

/**
 * Verifica si un email está en la lista de dominios bloqueados
 */
function esEmailBloqueado($email) {
    $config = $GLOBALS['config'];
    $dominio = strtolower(substr(strrchr($email, "@"), 1));
    
    return in_array($dominio, $config['dominios_bloqueados']);
}

/**
 * Construye y envía el email
 */
function enviarEmail($datos, $config) {
    $destinatario = $config['destinatario'];
    $asunto = $config['asunto'];
    
    // Construir contenido HTML seguro
    $contenido = construirContenidoEmail($datos);
    
    // Cabeceras de seguridad
    $headers = [
        'From: Trifarma Web <no-reply@drogueriatrifarma.com>',
        'Reply-To: ' . $datos['email'],
        'Content-Type: text/html; charset=UTF-8',
        'X-Mailer: PHP/' . phpversion(),
        'MIME-Version: 1.0',
        'X-Priority: 3',
        'X-MSMail-Priority: Normal'
    ];
    
    // Asunto codificado para UTF-8
    $asuntoCodificado = '=?UTF-8?B?' . base64_encode($asunto) . '?=';
    
    // Intentar enviar email
    $enviado = mail(
        $destinatario,
        $asuntoCodificado,
        $contenido,
        implode("\r\n", $headers)
    );
    
    return $enviado;
}

/**
 * Construye el contenido HTML del email
 */
function construirContenidoEmail($datos) {
    $fecha = date('d/m/Y H:i:s');
    $ip = obtenerIPCliente();
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Desconocido';
    
    return "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Nuevo Mensaje - Trifarma</title>
        <style>
            body { 
                font-family: 'Arial', sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 20px;
                background-color: #f9f9f9;
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white; 
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header { 
                background: linear-gradient(135deg, #004AAD, #009FE3);
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
            }
            .header h1 { 
                margin: 0; 
                font-size: 24px; 
                font-weight: 600;
            }
            .content { 
                padding: 30px; 
            }
            .field { 
                margin-bottom: 20px; 
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
            }
            .field:last-child { 
                border-bottom: none; 
            }
            .label { 
                font-weight: 600; 
                color: #004AAD; 
                display: block;
                margin-bottom: 5px;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .value { 
                color: #666; 
                font-size: 16px;
                line-height: 1.5;
            }
            .message-content {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                border-left: 4px solid #004AAD;
                white-space: pre-wrap;
            }
            .footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #666;
                font-size: 12px;
                border-top: 1px solid #eee;
            }
            .metadata {
                background: #f1f3f4;
                padding: 15px;
                border-radius: 5px;
                font-size: 12px;
                color: #666;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>📧 Nuevo Mensaje - Trifarma</h1>
            </div>
            <div class='content'>
                <div class='field'>
                    <span class='label'>👤 Nombre:</span>
                    <span class='value'>" . htmlspecialchars($datos['nombre']) . "</span>
                </div>
                <div class='field'>
                    <span class='label'>📧 Email:</span>
                    <span class='value'>" . htmlspecialchars($datos['email']) . "</span>
                </div>
                <div class='field'>
                    <span class='label'>💬 Mensaje:</span>
                    <div class='message-content'>" . nl2br(htmlspecialchars($datos['mensaje'])) . "</div>
                </div>
                <div class='metadata'>
                    <strong>Información técnica:</strong><br>
                    📅 Fecha: " . htmlspecialchars($fecha) . "<br>
                    🌐 IP: " . htmlspecialchars($ip) . "<br>
                    🖥️ Navegador: " . htmlspecialchars(substr($userAgent, 0, 100)) . "
                </div>
            </div>
            <div class='footer'>
                Este mensaje fue enviado desde el formulario de contacto de Trifarma Web.
                <br>No responder a este email - Utilizar la dirección del remitente.
            </div>
        </div>
    </body>
    </html>
    ";
}

/**
 * Obtiene la IP real del cliente
 */
function obtenerIPCliente() {
    $ip = $_SERVER['REMOTE_ADDR'];
    
    // Proxies y load balancers
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $ip = trim($ips[0]);
    } elseif (!empty($_SERVER['HTTP_X_REAL_IP'])) {
        $ip = $_SERVER['HTTP_X_REAL_IP'];
    }
    
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : 'IP no válida';
}

/**
 * Envía una respuesta de error JSON
 */
function enviarError($codigo, $error, $mensaje) {
    http_response_code($codigo);
    echo json_encode([
        'error' => $error,
        'message' => $mensaje
    ]);
}

/**
 * Log de eventos para debugging y monitoreo
 */
function logEvento($tipo, $mensaje) {
    $logFile = __DIR__ . '/contactos.log';
    $timestamp = date('Y-m-d H:i:s');
    $ip = obtenerIPCliente();
    
    $logEntry = "[$timestamp] [$ip] [$tipo] $mensaje" . PHP_EOL;
    
    // Rotación de logs básica (mantener últimos 1MB)
    if (file_exists($logFile) && filesize($logFile) > 1048576) {
        $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $lines = array_slice($lines, -500); // Mantener últimas 500 líneas
        file_put_contents($logFile, implode(PHP_EOL, $lines) . PHP_EOL, LOCK_EX);
    }
    
    @file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// =============================================================================
// EJECUCIÓN PRINCIPAL
// =============================================================================

// Manejar la solicitud
manejarSolicitud();

?>