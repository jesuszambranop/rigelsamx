# Verificación de entrega

Fecha: 19 de noviembre de 2026.

- Generación: 36 páginas HTML (18 por idioma).
- Revisión estática: 1.318 rutas locales, anclas, metadatos, idioma, imágenes y catálogo M1/S70 correctos.
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


## Revisión visual solicitada

- Fuente Poppins Black cargada (peso real 900) y párrafos Inter Medium (500), verificados en estilos calculados del navegador.
- Logotipo del encabezado sin palabra México ni separador. Selector regional con México primero.
- Tres panorámicas y seis materiales del RAR incorporados; controles manuales, pausa y teclado comprobados.
- La selección de imágenes de materiales mantiene idéntico el titular y el párrafo y conserva el material en la consulta.
- Portada con altura estable entre diapositivas: 540 px en escritorio y 682 px en la vista móvil probada de 390 px.
- Versión inglesa, mapas SVG renderizados y directorio con México primero y `rigelsa.com/mx/` comprobados.
- No se modificó el backend PHP de correo.
