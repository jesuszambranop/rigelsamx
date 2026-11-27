# Instalación en rigelsa.com/mx/

## 1. Subir archivos

1. Guarda una copia del contenido existente de `public_html/mx/`, si existe.
2. Extrae el ZIP de cPanel dentro de `public_html/mx/`. `index.html` debe quedar directamente en esa carpeta, **no** dentro de otra carpeta `public/` o `rigelsamx/`.
3. Activa la visualización de archivos ocultos y confirma que se subieron `public_html/mx/.htaccess`, `api/.htaccess` y `api/vendor/phpmailer/.htaccess`.
4. Usa PHP 8.2 o superior con extensiones `mbstring`, `fileinfo`, `openssl`, `zip` y `session`. Configura `upload_max_filesize=5M`, `post_max_size=12M` o superior, y `memory_limit=128M` o superior.
5. Si el sitio raíz tiene reglas de WordPress o SPA, excluye el directorio real `/mx/` antes de esas reglas. No reemplaces el `.htaccess` raíz sin revisarlo.
6. Usa HTTPS y comprueba que las páginas español/inglés y los recursos carguen dentro de `/mx/`.

No se requiere instalar Node, npm o Composer en el hosting. No subas `src/`, `scripts/`, `tests/`, `.git/` ni las credenciales a la carpeta pública.

## 2. Configurar correo

El modo por defecto es `mail()` de PHP. En cPanel debe estar habilitado el envío local autorizado para el remitente `ventasmexico@rigelsa.com`. La cuenta y buzones destinatarios deben existir y tener espacio.

Para SMTP autenticado, consulta **cPanel → Cuentas de correo → ventasmexico@rigelsa.com → Conectar dispositivos**. Copia `api/config.local.example.php` como `api/config.local.php` **solo en el servidor** e introduce host, puerto, cifrado, usuario y contraseña reales. Usa 587 + `tls`, o 465 + `ssl` según indique el proveedor. No se desactiva la verificación TLS.

Alternativamente configura las variables de entorno `RIGEL_MAIL_TRANSPORT=smtp`, `RIGEL_SMTP_HOST`, `RIGEL_SMTP_PORT`, `RIGEL_SMTP_SECURE`, `RIGEL_SMTP_USER`, `RIGEL_SMTP_PASSWORD`. La selección de SMTP no cae silenciosamente a otro transporte si falla.

Los destinatarios quedan fijados en `api/config.php`:

- Contacto, cotización y soporte: **de ventasmexico@rigelsa.com a ventasmexico@rigelsa.com**.
- Empleo: **de ventasmexico@rigelsa.com a rrhh@rigelsa.com**.
- `Reply-To`: correo del visitante. No se usa como remitente, para evitar suplantar dominios ajenos.

En **Email Deliverability**, revisa SPF y DKIM de `rigelsa.com`; comprueba alineación DMARC y los registros de entrega con tu proveedor. Estos cambios se realizan en el servicio de correo/DNS, no en el repositorio.

## 3. Comprobación de producción

1. Abre `/mx/api/forms.php?action=token`: debe responder JSON, sin errores PHP ni caché.
2. Envía una consulta de prueba identificada como prueba y confirma su llegada a **ventasmexico@rigelsa.com**, From y Reply-To.
3. Envía una postulación de prueba con un CV sin datos personales (PDF, DOC o DOCX) y confirma su llegada a **rrhh@rigelsa.com**, incluido el adjunto.
4. Comprueba que el CV admita PDF, DOC o DOCX válidos, que Marketing exija un portafolio PDF y que cada archivo mayor a 5 MB o de formato inválido se rechace.
5. Prueba el formulario en español y en inglés, y la selección de M1, S70, aplicaciones y soporte.
6. Verifica que `/mx/api/config.php` y `/mx/api/vendor/` den 403 en Apache. El contenido de `config.local.php` no debe servirse como texto bajo ninguna circunstancia.
7. Verifica navegación móvil, selector de país, enlaces a rigelsa.com y cambio de idioma.

La confirmación de envío significa que el transporte de correo aceptó el mensaje. La recepción final requiere comprobar el buzón y los registros de entrega. El frontend conserva los campos si hay un error y ofrece los canales directos.

## 4. Operación

El límite predeterminado es 5 intentos por IP cada 15 minutos. Los contadores se guardan en un directorio privado del temporal PHP; no en `public_html`. El sistema utiliza `REMOTE_ADDR` y no confía en cabeceras de IP proporcionadas por visitantes. Si cPanel está detrás de un proxy, el administrador debe configurar correctamente la IP real en Apache antes de adaptar este límite.

Los CV pasan por el archivo temporal de PHP y se adjuntan al correo; no se conservan en una carpeta de uploads pública. Mantén la política interna de conservación de correos de RRHH. La información de privacidad debe revisarse y completarse por Rigel antes de su lanzamiento comercial, conforme a su operación real.

Después de editar plantillas, vuelve a generar el HTML y sube los archivos cambiados. Los assets y estilos no dependen de un dominio codificado. Mantén el canonical en `site.config.mjs` acorde a la ubicación definitiva.

## Parche del carrusel, 27 de noviembre de 2026

Extraer el ZIP del parche directamente en `public_html/mx/` y aceptar reemplazar sus cuatro archivos: `index.html`, `en/index.html`, `assets/rigel.css`, `assets/carousels.js`. No contiene archivos PHP, configuración de correo ni `.htaccess`. Después recargar la página con Ctrl+F5. El HTML apunta a las versiones nuevas de CSS/JS para evitar la caché anterior.

Como alternativa, el ZIP completo contiene la misma corrección. La CSP permanece intacta. La primera diapositiva ya no depende de medir ni restaurar estilos inline.
