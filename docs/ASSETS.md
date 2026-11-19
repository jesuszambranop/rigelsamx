# Recursos

Recursos descargados el 19 de noviembre de 2026 para la web autorizada de Rigel México:

| Archivo local | Fuente |
| --- | --- |
| `rigel-logo.png` | https://rigelsa.com/co/assets/brand/rigel-horizontal.png |
| `favicon.png` | https://rigelsa.com/co/assets/brand/rigel-favicon.png |
| `m1-700.webp`, `m1-1300.webp` | https://rigelsa.com/co/assets/productos/m1/principal.webp (recorte de margen transparente y redimensionado, sin cambiar el equipo) |
| `s70.webp` | https://rigelsa.com/co/assets/productos/s70/principal.webp |
| `application-food.webp` | https://rigelsa.com/co/assets/aplicaciones/materiales/empaques-flexibles.png |
| `application-cosmetics.webp` | https://rigelsa.com/co/assets/aplicaciones/materiales/frascos-cosmeticos.png |
| `application-packaging.webp` | https://rigelsa.com/co/assets/aplicaciones/materiales/tapas.png |
| `Inter.ttf` | https://rigelsa.com/co/assets/fonts/Inter-Variable.ttf |
| `og-rigel.jpg` | Composición gráfica con logotipo y fotografía M1 anteriores |

Las imágenes de aplicación se presentan como **ilustrativas**. No constituyen testimonios, clientes reales ni ensayos certificados por Rigel México. En esta revisión se incorporaron las imágenes del archivo `F:/Rigel/web_mexico.rar`, suministradas por el propietario.

Inter: fuente de Rasmus Andersson, SIL Open Font License 1.1 (incluida en `public/assets/Inter-LICENSE.txt`). PHPMailer 7.2.0: https://github.com/PHPMailer/PHPMailer/releases/tag/v7.2.0, licencia LGPL 2.1 incluida junto al código. Solo se usa el núcleo PHPMailer/SMTP/Exception; no se integra autenticación OAuth ni un servicio de terceros.


## Imágenes suministradas en web_mexico.rar

- `slide.jpg` → `hero-cosmetica-{960,1920}.webp`.
- `Codificación de productos en supermercado copia.jpg` → `hero-productos-{960,1920}.webp`.
- `Lata de atún invertida en supermercado.png` → `hero-alimentos-{960,1920}.webp`.
- `MATERIALES/a0233412-5beb-453d-a096-20d69e15a745.png` → `material-carton-{140,900}.webp`.
- `MATERIALES/d88b1c18-a106-4e26-ab79-abe0f2c9a8b8.png` → `material-plastico-{140,900}.webp`.
- `MATERIALES/d963fc5e-6c45-482f-b412-d3edda5d85e3.png` → `material-vidrio-{140,900}.webp`.
- `MATERIALES/Etiqueta de salsa sin logotipo ni lima.png` → `material-envases-{140,900}.webp`.
- `MATERIALES/fundas.jpg` → `material-flexible-{140,900}.webp`.
- `MATERIALES/pescaod al vacio.jpg` → `material-vacio-{140,900}.webp`.

Se optimizaron a WebP y tamaños responsive, sin alterar el producto ni incrustar textos comerciales.

## Tipografía y mapas

Poppins Black (peso 900): https://github.com/google/fonts/tree/main/ofl/poppins, licencia SIL OFL incluida como `Poppins-LICENSE.txt`. Inter se usa en peso Medium (500).

Los mapas `map-*.svg` se generaron con contornos geográficos de Natural Earth 1:110m: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson. Natural Earth es de dominio público: https://www.naturalearthdata.com/about/terms-of-use/. Son siluetas de relleno continuo, sin patrones de puntos. El mapa local de México tiene un único pin para Mérida. No se modifica una ubicación a partir del idioma o de la IP.

Directorio y estructura institucional: https://rigelsa.com/co/quienes-somos.html, adaptado con México primero y URL `https://rigelsa.com/mx/`.
