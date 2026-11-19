# Futura redirección GeoIP (no instalada)

Esta web no redirige automáticamente por país. El selector manual enlaza los sitios regionales y guarda `rigel_country` con alcance `/` y duración de un año. La preferencia tiene prioridad sobre la detección geográfica.

La integración se hace en el servidor raíz o CDN de `rigelsa.com`, nunca desde JavaScript usando el idioma del navegador. El administrador debe usar un proveedor GeoIP fiable y datos proporcionados por infraestructura de confianza. No confiar en una cabecera de país que pueda enviar directamente cualquier visitante.

Regla lógica:

```text
Solo para GET/HEAD del documento raíz https://rigelsa.com/
  si existe una selección manual válida: no redirigir
  si país confirmado por GeoIP de confianza = MX: 302 hacia /mx/
  conservar exactamente la cadena de consulta (UTM, campañas, etc.)
  excluir /mx/, /co/, /api/, recursos estáticos y solicitudes administrativas
  no aplicar una segunda redirección desde /mx/ hacia la raíz
```

No redirigir rutas internas a supuestas equivalencias que no existan. Empezar por la portada minimiza enlaces rotos. Usar **302 temporal**, no 301. Si hay caché CDN, variar la respuesta por país y por cookie o evitar cachear estas redirecciones, para no servir una elección regional a todos los visitantes.

Pruebas antes de activar: MX sin cookie → `/mx/`; Ecuador sin cookie → raíz; elección manual Ecuador desde México → raíz sin rebote; entrada directa en `/mx/` → permanece; `?utm_source=prueba` → conservado; CSS/JS/API → no redirigidos; sin dato GeoIP → raíz. La cookie de selección solo aplica al dominio actual; `rigelsa.com.br` es un dominio independiente.
