// Características técnicas contrastadas con las fichas públicas de Rigel Ecuador.
// Las condiciones comerciales y el contenido del kit dependen del mercado.
export function productData(t) {
  return {
    m1: {
      highlights: [t('Pantalla táctil de 3.5″','3.5″ touchscreen'), t('De 1 a 6 líneas','1 to 6 print lines'), '300 DPI', t('Batería de 4 a 6 horas','4 to 6 hours of battery life')],
      specs: [
        [t('Operación','Operation'),t('Manual y portátil','Handheld and portable')],
        [t('Tecnología','Technology'),t('Inyección térmica de tinta (TIJ)','Thermal inkjet (TIJ)')],
        [t('Pantalla','Display'),t('Táctil de 3.5 pulgadas','3.5-inch touchscreen')],
        [t('Líneas de impresión','Print lines'),t('De 1 a 6 líneas','1 to 6 lines')],
        [t('Altura de impresión','Print height'),'12.7 mm'],
        [t('Longitud de impresión','Print length'),'1.5 m'],
        [t('Resolución','Resolution'),'300 DPI'],
        [t('Capacidad de tinta','Ink capacity'),'42 ml'],
        [t('Tipo de tinta','Ink type'),t('Solvente','Solvent')],
        [t('Formatos de imagen','Image formats'),'JPG, PNG, BMP'],
        [t('Batería','Battery'),t('De 4 a 6 horas','4 to 6 hours')],
        [t('Peso','Weight'),'218 g'],
        [t('Dimensiones','Dimensions'),'85 × 106 mm'],
        [t('Memoria interna','Internal memory'),'65 MB'],
        [t('Alimentación y carga','Power and charging'),'110–220 V / USB-C'],
        [t('Información de impresión','Print content'),t('Fechas, lotes, textos, logotipos, códigos de barras y QR','Dates, batch numbers, text, logos, barcodes and QR codes')],
        [t('Cartucho compatible','Compatible cartridge'),'S70']
      ]
    },
    s70: {
      highlights: [t('Tinta solvente','Solvent ink'),t('Secado rápido','Fast drying'),'12.7 mm',t('Compatible con M1','Compatible with M1')],
      specs: [
        [t('Tecnología','Technology'),t('Inyección térmica TIJ','Thermal inkjet (TIJ)')],
        [t('Altura de impresión','Print height'),'12.7 mm / 0.5″'],
        [t('Tipo de tinta','Ink type'),t('Solvente de secado rápido','Fast-drying solvent ink')],
        [t('Compatibilidad','Compatibility'),'M1']
      ]
    }
  };
}

export const productHighlights = (items, extraClass='') => `<ul class="product-highlights ${extraClass}">${items.map(item=>`<li><span aria-hidden="true">+</span>${item}</li>`).join('')}</ul>`;
export const specificationTable = (rows, title) => `<table><caption class="sr-only">${title}</caption><tbody>${rows.map(([key,value])=>`<tr><th scope="row">${key}</th><td>${value}</td></tr>`).join('')}</tbody></table>`;
