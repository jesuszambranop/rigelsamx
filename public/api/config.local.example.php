<?php
// Copia como config.local.php SOLO en cPanel. No lo subas a GitHub.
return [
    'transport' => 'smtp',
    'smtp_host' => 'CAMBIAR_POR_HOST_SMTP_DE_CPANEL',
    'smtp_port' => 587,
    'smtp_secure' => 'tls', // 465: usar 'ssl'. Verifica los datos en cPanel > Conectar dispositivos.
    'smtp_user' => 'ventasmexico@rigelsa.com',
    'smtp_password' => 'CONFIGURAR_EN_EL_SERVIDOR',
];
