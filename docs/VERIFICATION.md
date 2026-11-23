# Verificación de entrega

Fecha de última revisión: 23 de noviembre de 2026.

- Generación: 36 páginas HTML (18 por idioma).
- Revisión estática: 1.446 rutas locales, anclas, metadatos, idioma, imágenes y catálogo M1/S70 correctos.
- Sintaxis PHP: archivos propios y biblioteca PHPMailer sin errores.
- Pruebas unitarias: 31 comprobaciones de validación, destinatarios, remitente, Reply-To y adjunto MIME.
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
- Tres panorámicas y seis materiales del RAR incorporados; indicadores, selección manual y teclado comprobados.
- La selección de imágenes de materiales mantiene idéntico el titular y el párrafo y conserva el material en la consulta.
- Portada con altura estable entre diapositivas: 540 px en escritorio y 682 px en la vista móvil probada de 390 px.
- Versión inglesa, mapas SVG renderizados y directorio con México primero y `rigelsa.com/mx/` comprobados.
- El backend PHP de empleo valida CV PDF/DOC/DOCX y el portafolio PDF obligatorio para Marketing.


## Revisión del 23 de noviembre

- Eliminados todos los controles de pausa de portada y materiales. La selección manual ya no detiene permanentemente la rotación.
- Portada configurada a 6.000 ms (antes 7.000 ms); materiales conservan 5.500 ms. Avance automático comprobado en navegador.
- Indicadores de portada con `border-radius: 50%`, comprobado en estilos calculados.
- Empleo visible en el menú principal; título, texto, áreas y campos equivalentes a Colombia, sin campo extra de mensaje.
- Portafolio visible y obligatorio al elegir Marketing; oculto, desactivado y no obligatorio al cambiar a otra área.
- 31 comprobaciones PHP y prueba HTTP → PHP → SMTP local correctas: tres mensajes capturados localmente (contacto, empleo normal y Marketing con CV y portafolio), sin envío a buzones externos. Se verifican From ventasmexico@rigelsa.com y To rrhh@rigelsa.com para empleo.
- Rechazo de Marketing sin portafolio, archivos falsos, formatos incorrectos y archivos de más de 5 MB. DOCX validado por la estructura del contenedor Word.
- Imagen de servicio técnico integrada con transparencia y tamaños responsive. Vista móvil de 390 px sin desbordamiento y formulario bilingüe.

## Correcciones de CTA, header y blog

- Un único CTA blanco por slide: «Conoce la M1» → `m1.html`; se conservan 6 segundos y círculos sin controles de pausa.
- «Solicitar» en servicio técnico → `contacto.html?producto=soporte`, sin enlace circular ni WhatsApp adicional.
- Ocho botones del directorio con icono SVG blanco y nombre de ciudad; sin texto WhatsApp ni punto separador.
- Selector de país en el header y eliminación de la franja descriptiva superior. Tipografía del menú contrastada con Ecuador en estilos calculados.
- Eliminados avisos estáticos de implementación; se conservan errores honestos al intentar enviar sin backend.
- Tres artículos originales, bilingües, con seis secciones, tablas, índice, dos fotografías, FAQ, artículos relacionados y JSON-LD por página. Enlaces de GS1 aportan la referencia técnica sobre calidad de códigos.
- Fotografías aportadas por el propietario: cinco imágenes en dos tamaños WebP.
- Validación: 36 páginas y 1.446 rutas; 31 comprobaciones PHP; prueba integrada con tres mensajes capturados solo por SMTP local.
- Revisión visual en escritorio y 390 × 844: header, selector regional, portada, blog y directorio sin desbordamiento.
