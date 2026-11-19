<?php
declare(strict_types=1);
ini_set('display_errors','0');
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
$en = isset($_POST['lang']) && $_POST['lang'] === 'en';

function respond(int $status, array $body): void {
    global $en;
    http_response_code($status);
    if (strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false || isset($body['token'])) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } elseif ($status === 200 && ($body['ok'] ?? false)) {
        header('Location: ../'.($en?'en/':'').'gracias.html',true,303);
    } else {
        header('Content-Type: text/html; charset=utf-8');
        $message = htmlspecialchars($body['message'] ?? 'Error', ENT_QUOTES, 'UTF-8');
        $back = $en ? 'Back to contact' : 'Volver a contacto';
        echo '<!doctype html><html lang="'.($en?'en':'es-MX').'"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Rigel México</title><h1>Rigel México</h1><p>'.$message.'</p><p><a href="../'.($en?'en/':'').'contacto.html">'.$back.'</a></p></html>';
    }
    exit;
}

try {
    require __DIR__.'/core.php';
    $config = require __DIR__.'/config.php';
    $method = $_SERVER['REQUEST_METHOD'] ?? '';
    if (!in_array($method,['GET','POST'],true)) {header('Allow: GET, POST');respond(405,['ok'=>false,'message'=>'Método no permitido.']);}
    if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 7*1024*1024) respond(413,['ok'=>false,'message'=>$en?'Request too large (PDF up to 5 MB).':'Solicitud demasiado grande (PDF hasta 5 MB).']);
    session_name('rigelmx_session');
    session_set_cookie_params(['lifetime'=>0,'path'=>rtrim(str_replace('\\','/',dirname($_SERVER['SCRIPT_NAME'] ?? '/api/forms.php')),'/').'/', 'secure'=>(!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'), 'httponly'=>true, 'samesite'=>'Strict']);
    ini_set('session.use_strict_mode','1');
    if (!session_start()) throw new RuntimeException('Session unavailable');
    if (!isset($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    if ($method === 'GET') {
        if (($_GET['action'] ?? '') !== 'token') respond(400,['ok'=>false,'message'=>'Solicitud no válida.']);
        respond(200,['token'=>$_SESSION['csrf']]);
    }
    // El formulario solo acepta envíos del mismo sitio. No habilitar CORS '*'.
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        $origin = parse_url($_SERVER['HTTP_ORIGIN']);
        $expectedHost = strtolower($_SERVER['HTTP_HOST'] ?? '');
        $originHost = strtolower(($origin['host'] ?? '').(isset($origin['port'])?':'.$origin['port']:''));
        if ($expectedHost === '' || $originHost !== $expectedHost || !in_array($origin['scheme'] ?? '',['http','https'],true)) throw new FormError('Origen de solicitud no válido.','Invalid request origin.',403);
    }
    $token = $_POST['csrf'] ?? '';
    if (!is_string($token) || !hash_equals($_SESSION['csrf'],$token)) throw new FormError('La sesión venció. Recarga la página y vuelve a enviar.','Your session expired. Reload the page and submit again.',403);
    enforce_rate_limit($_SERVER['REMOTE_ADDR'] ?? 'unknown',$config);
    $data = validate_submission($_POST);
    $resume = null;
    if ($data['kind'] === 'careers') {
        if (!isset($_FILES['resume']) || !is_array($_FILES['resume'])) throw new FormError('Adjunta tu currículum en PDF.','Attach your résumé as a PDF.');
        $resume = validate_resume($_FILES['resume']);
    } elseif ($_FILES !== []) throw new FormError('El formulario de contacto no admite adjuntos.','The contact form does not accept attachments.');
    $mail = mailer_for($config,$data,$resume);
    if (!$mail->send()) throw new RuntimeException('Mail not accepted');
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
    session_write_close();
    respond(200,['ok'=>true,'message'=>$en?'Thank you. The mail server accepted your inquiry. Our team can reply to the email address you provided.':'Gracias. El servidor de correo aceptó tu solicitud. Nuestro equipo podrá responder al correo que proporcionaste.']);
} catch (FormError $error) {
    if ($error->httpStatus === 429) header('Retry-After: 900');
    respond($error->httpStatus,['ok'=>false,'message'=>$en?$error->enMessage:$error->getMessage()]);
} catch (Throwable $error) {
    // No registrar nombres, mensajes, CV, direcciones de correo ni credenciales.
    error_log('Rigel México form: mail or server configuration failure.');
    respond(503,['ok'=>false,'message'=>$en?'Unable to send right now. Please contact Rigel by email or WhatsApp.':'No fue posible enviar en este momento. Contacta a Rigel por correo o WhatsApp.']);
}
