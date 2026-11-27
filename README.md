# Rigel México — rigelsamx

Web bilingüe ES/EN, catálogo M1 + S70 y formularios PHP listos para instalar en `https://rigelsa.com/mx/`. El contenido principal, navegación y páginas de idioma existen en HTML. No requiere Node en cPanel, base de datos ni WordPress.

## Entregables

- `public/`: **todo lo que se sube a `public_html/mx/`**, incluidos `.htaccess`, `en/`, `assets/` y `api/`.
- `src/pages.mjs`: plantillas y contenido bilingüe.
- `src/rigel-sections.mjs`: sliders, presencia y pie de página.
- `src/products.mjs`: características y especificaciones compartidas de M1 y S70.
- `src/locations.mjs`: directorio internacional, con México primero.
- `src/careers.mjs`: página de empleo con los mismos campos y disposición de Colombia.
- `site.config.mjs`: datos de contacto y dominio canonical.
- `scripts/`: generación, revisión de rutas y vista local.
- `tests/forms.php`: validación y comprobación de los correos sin enviar.
- `.github/workflows/pages.yml`: publicación automática de la vista estática.
- `docs/CPANEL.md`: instalación, correo y validación final.
- `docs/GEOIP.md`: futura redirección geográfica, separada del sitio.

## Páginas

Inicio, catálogo, M1, ficha técnica imprimible, S70, aplicaciones, servicio técnico, quiénes somos con directorio internacional, preguntas frecuentes, blog con tres artículos extensos, fotografías originales de M1, índice, tablas, preguntas frecuentes y datos estructurados BlogPosting, contacto, trabaja con nosotros, privacidad, confirmación y 404. Todas en español e inglés. El selector de idioma conserva producto/material y el selector de país enlaza Ecuador (`rigelsa.com`), Colombia, Brasil y México.

## Diseño de Rigel

Títulos en Poppins Bold (700), encabezados pequeños en Poppins Regular (400), párrafos en Inter Medium (500) y tamaños basados en Rigel Colombia. Portada con tres panorámicas y segundo carrusel con seis materiales: el titular y el párrafo permanecen fijos, solo cambian las fotografías. Los indicadores circulares permiten seleccionar y navegar con teclado. No hay controles de pausa. La portada avanza cada 6 segundos y materiales cada 5.5 segundos; se respeta movimiento reducido. La altura de la portada la calcula CSS Grid con las tres diapositivas en la misma celda; los slides ocultos conservan el espacio y quedan fuera de la interacción.

“Quiénes somos” reproduce el texto y directorio de Colombia con México primero y `https://rigelsa.com/mx/`. Los mapas usan siluetas continuas de Natural Earth, sin tramas de puntos. La portada incluye el mapa local de México y Mérida. El pie conserva su color oscuro y un mensaje sobre experiencia internacional y atención cercana, con los apartados y datos de Colombia adaptados a México.

La imagen de despiece suministrada por el propietario se integra en servicio técnico, tanto en Inicio como en su página dedicada. “Trabaja con nosotros” está disponible en el menú principal y en el pie; no solicita un mensaje adicional y muestra el portafolio únicamente para Marketing.

## Correo

| Formulario | From / envelope sender | To | Reply-To |
| --- | --- | --- | --- |
| Contacto y soporte | ventasmexico@rigelsa.com | ventasmexico@rigelsa.com | Correo validado del visitante |
| Trabaja con nosotros | ventasmexico@rigelsa.com | rrhh@rigelsa.com | Correo validado del candidato |

El servidor fija los destinos; el navegador no puede elegir destinatarios. CV en PDF, DOC o DOCX, hasta 5 MB. Marketing exige además un portafolio PDF de hasta 5 MB. Se validan extensión, tipo real y estructura de los adjuntos. Se usa PHPMailer 7.2.0 (incluido con licencia LGPL), modo `mail()` de cPanel por defecto y SMTP autenticado configurable. No se incluyen contraseñas. Ver [instalación en cPanel](docs/CPANEL.md).

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

En **Settings → Pages → Source**, seleccionar **GitHub Actions**. Cada push a `main` revisa rutas, sintaxis PHP y tests, excluye por completo `api/` del artefacto público y despliega la web. GitHub Pages no ejecuta PHP: los formularios no muestran avisos de vista previa. Si se intenta enviar desde Pages, indican que no se pudo enviar y ofrecen el correo correspondiente. No simulan envíos exitosos. El repositorio conserva PHP para cPanel.

Los canonical y sitemap apuntan por defecto a la ubicación definitiva `https://rigelsa.com/mx/`. Mantenerlos al publicar la vista en Pages evita tratar la vista como el sitio comercial principal. Para convertir Pages en sitio principal, cambiar `SITE_URL` en el build.

## Verificación y límites

- `scripts/check.mjs` revisa las 36 páginas, rutas y anclas internas, idioma, metadatos, imágenes y exclusividad del catálogo.
- `tests/forms.php` construye correos MIME sin enviarlos y verifica destinatarios, Reply-To, validación y adjuntos.
- El envío real y la llegada a bandeja de entrada requieren el servidor cPanel, la cuenta de correo y su configuración DNS. No basta con que PHP acepte el mensaje.
- Información técnica publicada: operación manual, TIJ, pantalla de 3.5 pulgadas, impresión de 12.7 mm y S70. Características ampliadas y contrastadas con las fichas públicas de Ecuador. Sin precios, stock, garantías para México ni rendimiento inventados.
- La ficha M1 es una página imprimible con los datos técnicos contrastados; no se presenta como un manual de fábrica.
- No se inventaron videos, clientes ni testimonios. Las aplicaciones se identifican como ilustrativas.

## Créditos y fuentes

Logotipo y fotos originales de M1/S70: Rigel, obtenidos de `https://rigelsa.com/co/assets/` y contrastados con `https://rigelsa.com/`. Aplicaciones ilustrativas: archivos públicos de Rigel Colombia, indicados en `docs/ASSETS.md`. El adjunto de esta conversación solo contenía la referencia del encabezado; en la revisión se incorporaron las tres panorámicas y seis imágenes de materiales de `web_mexico.rar`, suministrado por el propietario.

Diseño propio inspirado en las referencias suministradas. Código y contenido de esta entrega destinados a Rigel; la publicación pública del repositorio no concede una licencia sobre su marca o fotografías. Las bibliotecas de terceros conservan sus licencias.

## Revisión editorial y navegación, 23 de noviembre

Header con tipografía Trebuchet MS 600 y medidas de Rigel Ecuador; títulos del contenido Poppins Bold y párrafos Inter Medium. El selector de país está integrado en el header, sin franja superior. Cada slide principal tiene un único CTA blanco «Conoce la M1». Servicio técnico enlaza con «Solicitar» al formulario de contacto, con soporte preseleccionado. Los botones del directorio internacional muestran el símbolo blanco de WhatsApp y la ciudad.

Los artículos bilingües se mantienen en `src/blog.mjs`; el render conserva las URLs existentes y genera HTML completo, metadatos de artículo y JSON-LD. Fotografías del ZIP del propietario optimizadas en dos tamaños. Las observaciones de implementación no forman parte de las páginas públicas.

## Revisión del 26 de noviembre de 2026

Poppins Bold 700 sustituye Black en todos los títulos; los textos superiores de sección usan Poppins Regular 400. Mapas con etiquetas negras integradas en el SVG, próximas a las siluetas, sin líneas de unión y vinculadas al mismo sistema de coordenadas; Mérida aparece encima del pin sin recuadro HTML. Solo el título del bloque de soluciones está centrado; los textos de cada producto están alineados a la izquierda, con descripción breve y enlace «Conocer». El catálogo muestra cuatro características por producto y acceso «Ver características». El selector muestra «Ecuador». M1 dispone de 17 filas de especificaciones y S70 de 4, en ambos idiomas, con datos compartidos en `src/products.mjs`.

## Contacto flotante

Todas las páginas, incluidas las versiones inglesas, tienen un botón fijo de WhatsApp abajo a la derecha que abre el contacto de México (+52 999 635 1998). Es un enlace HTML accesible con icono local, sin depender de JavaScript. El bloque de cotización comienza directamente con «Hablemos de tu producto», sin texto superior, y tiene menor separación entre título y párrafo. Solo el título del bloque de soluciones está centrado; las descripciones están explícitamente alineadas a la izquierda.

## Corrección de carrusel en cPanel, 27 de noviembre de 2026

La medición JavaScript anterior modificaba estilos inline y, con la política CSP de cPanel, dejaba la primera diapositiva invisible y fuera del flujo, haciendo colapsar el bloque. Se sustituyó por CSS Grid: todas las diapositivas comparten celda y solo la activa es visible e interactiva. No se modifican estilos inline ni se debilita la CSP. La vista local carga la misma política desde `.htaccess`.

`rigel.css` y `carousels.js` llevan versión de URL para evitar que se reutilice la copia antigua de caché. Se puede actualizar cPanel con el paquete completo o con un parche que contiene únicamente `index.html`, `en/index.html`, `assets/rigel.css` y `assets/carousels.js`.


## Ajustes visuales del 27 de noviembre de 2026

La portada utiliza las nuevas fotografías del propietario: champú en el primer slide y pouch en el segundo, con textos centrados en la codificación. El CTA compartido «Solicitar cotización» abre WhatsApp México. Las etiquetas del mapa de Latinoamérica quedan al 70% de su tamaño anterior y sus seis países destacados al 60% de opacidad. El botón flotante incorpora un movimiento breve y halo cada 7 segundos; se detiene al pasar el cursor o enfocar y respeta movimiento reducido.

La actualización actual para cPanel se entrega como paquete completo, con las cuatro imágenes WebP nuevas, las páginas regeneradas y la hoja CSS versionada. El parche de cuatro archivos de la revisión anterior solo corresponde a la corrección del carrusel; no contiene estas nuevas fotografías.
