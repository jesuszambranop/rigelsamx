# Verificación de entrega

Fecha: 19 de noviembre de 2026.

- Generación: 34 páginas HTML (17 por idioma).
- Revisión estática: 1.088 rutas locales, anclas, metadatos, idioma, imágenes y catálogo M1/S70 correctos.
- Sintaxis PHP: archivos propios y biblioteca PHPMailer sin errores.
- Pruebas unitarias: 20 comprobaciones de validación, destinatarios, remitente, Reply-To y adjunto MIME.
- Prueba integrada: navegador HTTP de prueba → PHP real → servidor SMTP exclusivamente local. Contacto entregado al destino de ventas y empleo al destino de RRHH, ambos capturados localmente; sin correos externos.
- Rechazos verificados: CSRF inválido, origen distinto, producto inválido, honeypot, PDF falso, PDF demasiado grande y límite de intentos.
- Revisión visual en navegador: escritorio y móvil de 390 × 844; portada sin desbordamiento horizontal. Producto M1 completo, navegación y botones legibles.
- Flujo de aplicaciones: conserva producto y material en el formulario, incluso al cambiar de idioma.

Pruebas reproducibles:

```sh
node scripts/build.mjs
node scripts/check.mjs
php tests/forms.php
node tests/http.mjs
```

`tests/http.mjs` requiere PHP en PATH, o la variable `PHP_EXECUTABLE` con su ruta. Abre puertos exclusivamente en `127.0.0.1`, usa datos sintéticos y elimina su copia temporal de pruebas dentro de `work/`.

Pendiente únicamente en el hosting definitivo: configurar/verificar el transporte de correo de cPanel y comprobar la llegada real a ambos buzones. No se dispuso de una sesión de cPanel ni de credenciales SMTP. La aceptación local por SMTP no demuestra la entrega a los buzones comerciales.
