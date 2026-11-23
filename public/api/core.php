<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

require_once __DIR__ . '/vendor/phpmailer/Exception.php';
require_once __DIR__ . '/vendor/phpmailer/PHPMailer.php';
require_once __DIR__ . '/vendor/phpmailer/SMTP.php';

final class FormError extends RuntimeException {
    public int $httpStatus;
    public string $enMessage;
    public function __construct(string $es, string $en, int $status = 422) {
        parent::__construct($es); $this->enMessage = $en; $this->httpStatus = $status;
    }
}

function field(array $input, string $key, int $max, bool $required = true): string {
    $value = $input[$key] ?? '';
    if (!is_string($value)) throw new FormError('Formato de campo inválido.', 'Invalid field format.');
    $value = trim($value);
    if (($required && $value === '') || mb_strlen($value, 'UTF-8') > $max || !mb_check_encoding($value, 'UTF-8') || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $value)) {
        throw new FormError('Revisa los campos obligatorios y su longitud.', 'Check required fields and their length.');
    }
    if ($key !== 'message' && preg_match('/[\r\n]/', $value)) throw new FormError('Un campo contiene caracteres inválidos.', 'A field contains invalid characters.');
    return $value;
}

function validate_submission(array $input): array {
    $kind = field($input, 'kind', 20);
    if (!in_array($kind, ['contact', 'careers'], true)) throw new FormError('Tipo de formulario inválido.', 'Invalid form type.');
    if (($input['consent'] ?? '') !== '1') throw new FormError('Acepta la información de privacidad para enviar.', 'Accept the privacy information to submit.');
    if (field($input, 'website', 200, false) !== '') throw new FormError('No se pudo validar la solicitud.', 'Unable to validate the request.', 400);
    $data = ['kind' => $kind];
    foreach (['name'=>100, 'email'=>150, 'city'=>100] as $key=>$max) $data[$key] = field($input, $key, $max);
    $data['message'] = field($input,'message',3000,$kind === 'contact');
    if ($kind === 'contact' && mb_strlen($data['message'],'UTF-8') < 10) throw new FormError('Describe tu consulta con al menos 10 caracteres.', 'Describe your inquiry using at least 10 characters.');
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) throw new FormError('Ingresa un correo electrónico válido.', 'Enter a valid email address.');
    $data['phone'] = field($input,'phone',30,$kind === 'careers');
    if ($data['phone'] && !preg_match('/^[0-9+() .\-]{5,30}$/', $data['phone'])) throw new FormError('Revisa el número de teléfono.', 'Check the phone number.');
    if ($kind === 'contact') {
        $data['company'] = field($input,'company',120);
        $data['product'] = field($input,'product',20);
        if (!in_array($data['product'], ['m1','s70','aplicacion','soporte'], true)) throw new FormError('Selecciona una solución válida.', 'Select a valid solution.');
        $data['material'] = field($input,'material',120,false);
        $data['volume'] = field($input,'volume',120,false);
    } else {
        $data['area'] = field($input,'area',30);
        if (!in_array($data['area'], ['sales','service','marketing','accounting','hr','other'], true)) throw new FormError('Selecciona un área válida.', 'Select a valid area.');
    }
    return $data;
}

function validate_attachment(array $file, array $allowed, string $baseName, bool $requireUploaded = true): array {
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !isset($file['tmp_name']) || !is_string($file['tmp_name']) || !is_string($file['name'] ?? null)) {
        throw new FormError('Adjunta los archivos obligatorios en el formato indicado (máximo 5 MB cada uno).', 'Attach the required files in the specified format (maximum 5 MB each).');
    }
    $path = $file['tmp_name'];
    if (($requireUploaded && !is_uploaded_file($path)) || !is_file($path)) throw new FormError('El archivo adjunto no es válido.', 'The attached file is invalid.');
    $size = filesize($path);
    if ($size === false || $size < 5 || $size > 5 * 1024 * 1024) throw new FormError('Cada archivo debe tener un tamaño máximo de 5 MB.', 'Each file must be no larger than 5 MB.');
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($extension,$allowed,true)) throw new FormError('Revisa el formato de los archivos adjuntos.', 'Check the attachment formats.');
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($path);
    $handle = fopen($path, 'rb');
    $signature = $handle ? fread($handle, 8) : '';
    if ($handle) fclose($handle);
    $valid = false;
    if ($extension === 'pdf') {
        $valid = $mime === 'application/pdf' && substr($signature,0,5) === '%PDF-';
    } elseif ($extension === 'doc') {
        $valid = $signature === hex2bin('d0cf11e0a1b11ae1') && in_array($mime,['application/msword','application/CDFV2','application/x-ole-storage','application/vnd.ms-office'],true);
    } elseif ($extension === 'docx' && class_exists('ZipArchive')) {
        $zip = new ZipArchive();
        if ($zip->open($path) === true) {
            $valid = in_array($mime,['application/zip','application/vnd.openxmlformats-officedocument.wordprocessingml.document'],true)
                && $zip->locateName('[Content_Types].xml') !== false && $zip->locateName('word/document.xml') !== false && $zip->numFiles < 2000;
            for ($i=0;$valid && $i<$zip->numFiles;$i++) {
                $entry = $zip->statIndex($i);
                if ($entry === false || $entry['size'] > 50*1024*1024 || stripos($entry['name'],'vbaProject.bin') !== false) $valid = false;
            }
            $zip->close();
        }
    }
    if (!$valid) throw new FormError('El archivo no corresponde a un documento válido del formato indicado.', 'The file is not a valid document in the specified format.');
    return ['path'=>$path, 'name'=>$baseName.'.'.$extension, 'mime'=>$extension === 'docx'?'application/vnd.openxmlformats-officedocument.wordprocessingml.document':($extension === 'doc'?'application/msword':'application/pdf')];
}

function validate_resume(array $file, bool $requireUploaded = true): array {
    return validate_attachment($file,['pdf','doc','docx'],'CV-Rigel-Mexico',$requireUploaded);
}

function validate_career_attachments(array $files, string $area, bool $requireUploaded = true): array {
    foreach (array_keys($files) as $key) if (!in_array($key,['resume','portfolio'],true)) throw new FormError('Adjunto no admitido.', 'Unsupported attachment.');
    $resume = validate_resume(is_array($files['resume'] ?? null)?$files['resume']:[],$requireUploaded);
    $portfolio = null;
    if ($area === 'marketing') {
        $portfolio = validate_attachment(is_array($files['portfolio'] ?? null)?$files['portfolio']:[],['pdf'],'Portafolio-Rigel-Mexico',$requireUploaded);
    } elseif (isset($files['portfolio']) && ($files['portfolio']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
        throw new FormError('El portafolio corresponde al área de Marketing.', 'A portfolio is required for Marketing only.');
    }
    return [$resume,$portfolio];
}

function mailer_for(array $config, array $data, ?array $resume = null, ?array $portfolio = null): PHPMailer {
    $mail = new PHPMailer(true);
    $mail->CharSet = 'UTF-8';
    $mail->Timeout = 15;
    $mail->SMTPDebug = 0;
    if ($config['transport'] === 'smtp') {
        if ($config['smtp_host'] === '') throw new RuntimeException('SMTP host missing');
        $mail->isSMTP();
        $mail->Host = $config['smtp_host'];
        $mail->Port = (int)$config['smtp_port'];
        $secure = $config['smtp_secure'];
        if (!in_array($secure,['tls','ssl','none'],true)) throw new RuntimeException('Invalid SMTP security');
        if ($secure === 'none' && !in_array($config['smtp_host'],['127.0.0.1','localhost','::1'],true)) throw new RuntimeException('Insecure SMTP is restricted to local testing');
        $mail->SMTPSecure = $secure === 'none' ? '' : $secure;
        $mail->SMTPAutoTLS = $secure !== 'none';
        $mail->SMTPAuth = $config['smtp_user'] !== '';
        $mail->Username = $config['smtp_user'];
        $mail->Password = $config['smtp_password'];
    } elseif ($config['transport'] === 'mail') {
        $mail->isMail();
    } else throw new RuntimeException('Invalid mail transport');
    $mail->setFrom($config['from'],$config['from_name']);
    $mail->Sender = $config['from'];
    $mail->addReplyTo($data['email'],$data['name']);
    $mail->addAddress($data['kind'] === 'careers' ? $config['careers_to'] : $config['contact_to']);
    $mail->isHTML(false);
    $topic = $data['kind'] === 'careers' ? 'Postulación · '.$data['area'] : 'Consulta · '.$data['product'];
    $mail->Subject = '[Rigel México] '.$topic;
    $labels = ['name'=>'Nombre','email'=>'Correo de respuesta','phone'=>'Teléfono','city'=>'Ciudad','company'=>'Empresa','product'=>'Interés','material'=>'Material','volume'=>'Volumen','area'=>'Área','message'=>'Mensaje'];
    $lines = ['Formulario web de Rigel México', ''];
    foreach ($labels as $key=>$label) if (isset($data[$key]) && $data[$key] !== '') $lines[] = $label.': '.$data[$key];
    $lines[] = ''; $lines[] = 'Consentimiento de privacidad: aceptado al enviar.';
    $mail->Body = implode("\n\n", $lines);
    foreach ([$resume,$portfolio] as $attachment) if ($attachment !== null) $mail->addAttachment($attachment['path'],$attachment['name'],'base64',$attachment['mime'] ?? 'application/pdf');
    return $mail;
}

function enforce_rate_limit(string $ip, array $config): void {
    $dir = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.'rigelmx-'.substr(hash('sha256',__DIR__),0,16);
    if (!is_dir($dir) && !@mkdir($dir,0700,true) && !is_dir($dir)) throw new RuntimeException('Rate directory unavailable');
    $file = $dir.DIRECTORY_SEPARATOR.hash('sha256',$ip.'|'.__DIR__).'.json';
    $handle = fopen($file,'c+');
    if (!$handle || !flock($handle,LOCK_EX)) throw new RuntimeException('Rate lock unavailable');
    try {
        $now = time();
        $saved = json_decode(stream_get_contents($handle) ?: '[]',true);
        $attempts = array_values(array_filter(is_array($saved)?$saved:[],fn($ts)=>is_int($ts) && $ts > $now-(int)$config['rate_window']));
        if (count($attempts) >= (int)$config['rate_limit']) throw new FormError('Has enviado varias solicitudes. Intenta de nuevo en 15 minutos.', 'You have submitted several requests. Please try again in 15 minutes.',429);
        $attempts[] = $now;
        ftruncate($handle,0);rewind($handle);fwrite($handle,json_encode($attempts));
    } finally {flock($handle,LOCK_UN);fclose($handle);}
    // Elimina solo registros caducados de este directorio privado, sin datos de formularios.
    if (random_int(1,100) === 1) foreach (glob($dir.DIRECTORY_SEPARATOR.'*.json') ?: [] as $candidate) {
        if (filemtime($candidate) < time()-(int)$config['rate_window']*2) @unlink($candidate);
    }
}
