# Rigel México — rigelsamx

Web bilingüe ES/EN, catálogo M1 + S70 y formularios PHP listos para instalar en `https://rigelsa.com/mx/`. El contenido principal, navegación y páginas de idioma existen en HTML. No requiere Node en cPanel, base de datos ni WordPress.

## Entregables

- `public/`: **todo lo que se sube a `public_html/mx/`**, incluidos `.htaccess`, `en/`, `assets/` y `api/`.
- `src/pages.mjs`: plantillas y contenido bilingüe.
- `site.config.mjs`: datos de contacto y dominio canonical.
- `scripts/`: generación, revisión de rutas y vista local.
- `tests/forms.php`: validación y comprobación de los correos sin enviar.
- `.github/workflows/pages.yml`: publicación automática de la vista estática.
- `docs/CPANEL.md`: instalación, correo y validación final.
- `docs/GEOIP.md`: futura redirección geográfica, separada del sitio.

## Páginas

Inicio, catálogo, M1, ficha técnica imprimible, S70, aplicaciones, servicio técnico, quiénes somos, blog con tres guías propias, contacto, trabaja con nosotros, privacidad, confirmación y 404. Todas en español e inglés. El selector de idioma conserva producto/material y el selector de país enlaza Ecuador (`rigelsa.com`), Colombia, Brasil y México.

## Correo

| Formulario | From / envelope sender | To | Reply-To |
| --- | --- | --- | --- |
| Contacto y soporte | ventasmexico@rigelsa.com | ventasmexico@rigelsa.com | Correo validado del visitante |
| Trabaja con nosotros | ventasmexico@rigelsa.com | rrhh@rigelsa.com | Correo validado del candidato |

El servidor fija los destinos; el navegador no puede elegir destinatarios. CV únicamente PDF, hasta 5 MB, con verificación de extensión, MIME y firma. Se usa PHPMailer 7.2.0 (incluido con licencia LGPL), modo `mail()` de cPanel por defecto y SMTP autenticado configurable. No se incluyen contraseñas. Ver [instalación en cPanel](docs/CPANEL.md).

## Desarrollo (Node 20.11+; recomendado Node 22)

No hay dependencias npm ni paso de instalación.

```sh
node scripts/build.mjs
node scripts/check.mjs
php tests/forms.php
node scripts/preview.mjs
```

Vista: `http://127.0.0.1:8787/mx/` (estática, sin correo). Para probar PHP localmente: `php -S 127.0.0.1:8788 -t public` y abrir `http://127.0.0.1:8788/`. No uses el servidor integrado de PHP en producción.

Cambios de texto o datos: editar `src/pages.mjs` / `site.config.mjs`, generar otra vez y commitear también el HTML actualizado. Para otro dominio: `SITE_URL=https://ejemplo.com/mx/ node scripts/build.mjs` (en PowerShell: establecer `$env:SITE_URL` antes de ejecutar Node). Los enlaces internos son relativos y funcionan dentro de `/mx/` y `/rigelsamx/`.

## GitHub Pages

Repositorio solicitado: `https://github.com/jesuszambranop/rigelsamx`.

En **Settings → Pages → Source**, seleccionar **GitHub Actions**. Cada push a `main` revisa rutas, sintaxis PHP y tests, excluye por completo `api/` del artefacto público y despliega la web. GitHub Pages no ejecuta PHP: los formularios muestran explícitamente esta limitación y ofrecen correo/WhatsApp. No simulan envíos exitosos. El repositorio conserva PHP para cPanel.

Los canonical y sitemap apuntan por defecto a la ubicación definitiva `https://rigelsa.com/mx/`. Mantenerlos al publicar la vista en Pages evita tratar la vista como el sitio comercial principal. Para convertir Pages en sitio principal, cambiar `SITE_URL` en el build.

## Verificación y límites

- `scripts/check.mjs` revisa las 34 páginas, rutas y anclas internas, idioma, metadatos, imágenes y exclusividad del catálogo.
- `tests/forms.php` construye correos MIME sin enviarlos y verifica destinatarios, Reply-To, validación y adjuntos.
- El envío real y la llegada a bandeja de entrada requieren el servidor cPanel, la cuenta de correo y su configuración DNS. No basta con que PHP acepte el mensaje.
- Información técnica publicada: operación manual, TIJ, pantalla de 3.5 pulgadas, impresión de 12.7 mm y S70. Sin precios, stock, garantías, autonomía ni rendimiento inventados.
- La ficha M1 es una página imprimible basada en estos datos; no se presenta como un manual de fábrica ni incorpora cifras adicionales sin verificar.
- No se inventaron videos, clientes ni testimonios. Las aplicaciones se identifican como ilustrativas.

## Créditos y fuentes

Logotipo y fotos originales de M1/S70: Rigel, obtenidos de `https://rigelsa.com/co/assets/` y contrastados con `https://rigelsa.com/`. Aplicaciones ilustrativas: archivos públicos de Rigel Colombia, indicados en `docs/ASSETS.md`. El adjunto de esta conversación solo contenía la referencia del encabezado; las tres escenas adicionales mencionadas en el brief no estaban adjuntas. Se utilizaron recursos disponibles de Rigel.

Diseño propio inspirado en las referencias suministradas. Código y contenido de esta entrega destinados a Rigel; la publicación pública del repositorio no concede una licencia sobre su marca o fotografías. Las bibliotecas de terceros conservan sus licencias.
