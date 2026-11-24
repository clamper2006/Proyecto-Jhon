# Venezuela Exporta — web del taller (v2)

HTML + CSS + JS vanilla, sin frameworks ni dependencias en runtime. Es una PWA (manifest + service worker).

## Cómo ejecutarla
- **Rápido:** doble clic en `index.html` (todo funciona, salvo el service worker).
- **Recomendado:** servidor local, para probar la PWA:
  `python -m http.server 8080` y abrir http://localhost:8080
  (o la extensión *Live Server* de VS Code).

## Estructura
```
index.html              contenido (semántico, sin estilos inline)
css/base.css            reset, variables, reveal
css/utilities.css       utilidades generadas (ya no se usa Tailwind CDN)
css/components.css      botones, tarjetas, header, FAQ, ticket, impresión
css/hero.css            escena del barco: vista cenital → lateral → sale hacia arriba
css/sponsors.css        franja de patrocinadores (marquee)
css/asistente.css       botón flotante y chat
js/config.js            ← lo que más vas a editar
js/ui.js                header, menú móvil, FAQ, reveal, fechas
js/hero.js              coreografía del barco ligada al scroll + guardia de rendimiento
js/patrocinadores.js    marquee infinito (pausa fuera de pantalla)
js/asistente.js         chat de ayuda (modo demostración; punto de enganche para Gemini)
js/countdown.js         cuenta regresiva
js/registro.js          pre-registro y pase digital
assets/*.svg            barco (lateral y cenital), olas, nubes, mar, puerto
assets/sponsors/*.svg   8 placeholders de patrocinadores
sw.js, manifest.webmanifest
tools/mini_tw.py        regenera css/utilities.css si agregas clases nuevas
```

## Lo que debes completar (js/config.js y contenido)
1. `fechaTaller`: fecha y hora reales (ej. `'2026-12-10T18:00:00-04:00'`). Mientras sea `null` la web muestra "Por anunciar" y oculta el contador.
2. `pagosActivos`: `false` = primera edición gratuita (precios, cupos VIP, métodos de pago y FAQ de pago quedan ocultos, no borrados). Ponlo en `true` para volver a mostrarlos (revisa antes los textos de los "3 pasos").
3. Datos de contacto del pie (`info@venezuelaexporta.com`, `0412-000-0000`) y la sede: siguen siendo los del original.
4. El pre-registro de la página solo genera el pase en el navegador; **no guarda datos**. La inscripción real sigue en el Google Form.

## Rendimiento (pensado para equipos modestos, ej. Acer C732)
- El barco y las olas solo animan `transform` (GPU); un único listener de scroll pasivo con `requestAnimationFrame`.
- Se pausa todo cuando el hero sale de pantalla o la pestaña está oculta.
- Si los primeros cuadros van lentos se activa solo el modo `lite` (apaga nubes, destellos y espuma).
- Respeta `prefers-reduced-motion`. Sin `backdrop-filter` ni partículas JS.
- Si cambias `index.html` y usas clases nuevas: `python tools/mini_tw.py index.html css/utilities.css`.

## Hero: cómo funciona la animación
El hero mide 230vh y la escena queda fija (sticky) mientras haces scroll:
`0–30%` vista cenital del barco → `22–60%` la cámara baja y pasa a vista lateral en ángulo → `62–100%` el barco sigue de largo y sale hacia arriba.
Los tiempos están en `js/hero.js` (constantes dentro de `frame()`); la altura del scroll en `css/hero.css` (`.js .hero{height:230vh}`).

## Patrocinadores
Cada tarjeta está en `index.html` dentro de `#patrocinadores` (`<figure class="sponsor-card">`). Para poner un patrocinador real:
1. Guarda su imagen en `assets/sponsors/` (recomendado 400×300 px, WebP/JPG, < 60 KB).
2. Cambia el `src`, el `alt` y el nombre de esa tarjeta (hay dos filas; edita la misma imagen en ambas si aparece en las dos).
El marquee duplica las tarjetas por JS, no hace falta tocar nada más.

## Asistente de IA (hoy: maqueta)
Responde con una base local de preguntas frecuentes (`KB` en `js/asistente.js`). Para conectar Gemini:
1. **La clave de Gemini nunca va en el navegador.** Crea una función serverless (Vercel: `api/chat.js`) que reciba `{ mensaje, historial }`, llame a Gemini con la clave guardada en una variable de entorno y devuelva `{ respuesta: "texto" }`.
2. Pon la URL de esa función en `SITE.asistenteEndpoint` (`js/config.js`). Si falla o no existe, el chat vuelve solo a la base local.
3. GitHub Pages solo sirve archivos estáticos: sirve para probar la maqueta; el asistente real necesita Vercel (o similar) para la función.

## Decisión de stack
Se mantiene HTML/CSS/JS vanilla: es una landing estática, se mantiene entre dos personas sin React, pesa ~200 KB y despliega tal cual en GitHub Pages y Vercel. Reconsiderar (React/TS o Astro) solo si se agregan login de alumnos, progreso de cursos o un panel.
