<?php
declare(strict_types=1);
// No incluyas contraseñas aquí. Usa variables de entorno o config.local.php (ignorado por Git).
$config = [
    'from' => 'ventasmexico@rigelsa.com',
    'from_name' => 'Rigel México',
    'contact_to' => 'ventasmexico@rigelsa.com',
    'careers_to' => 'rrhh@rigelsa.com',
    'transport' => getenv('RIGEL_MAIL_TRANSPORT') ?: 'mail',
    'smtp_host' => getenv('RIGEL_SMTP_HOST') ?: '',
    'smtp_port' => (int) (getenv('RIGEL_SMTP_PORT') ?: 587),
    'smtp_user' => getenv('RIGEL_SMTP_USER') ?: '',
    'smtp_password' => getenv('RIGEL_SMTP_PASSWORD') ?: '',
    'smtp_secure' => getenv('RIGEL_SMTP_SECURE') ?: 'tls',
    'rate_limit' => 5,
    'rate_window' => 900,
];
$local = __DIR__ . '/config.local.php';
if (is_file($local)) {
    $override = require $local;
    if (is_array($override)) $config = array_replace($config, $override);
}
return $config;
