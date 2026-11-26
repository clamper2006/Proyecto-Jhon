/* ===== asistente.js — chat de ayuda (MODO DEMOSTRACIÓN) =====
   Hoy responde con una base local de preguntas frecuentes.
   Para conectar Gemini después: pon la URL de tu función serverless en SITE.asistenteEndpoint (js/config.js).
   La función recibe { mensaje, historial } y debe devolver { respuesta: "texto" }.
   ¡La clave de Gemini NUNCA va en este archivo! Vive en el servidor (ver README). */
(function () {
  'use strict';
  var fab = document.getElementById('as-fab-btn'), panel = document.getElementById('as-panel'); if (!fab || !panel) return;
  var tip = document.getElementById('as-fab-tip'), msgs = document.getElementById('as-msgs'), chips = document.getElementById('as-chips');
  var form = document.getElementById('as-form'), input = document.getElementById('as-input'), closeBtn = document.getElementById('as-close');
  var historial = [], busy = false, greeted = false;
  var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); };
  var fecha = function () { return typeof window.fechaTexto === 'function' ? window.fechaTexto('larga') : 'por anunciar'; };

  var KB = [
    { k: ['gratis', 'gratuito', 'costo', 'cuesta', 'precio', 'pagar', 'pago', 'cobran', 'dinero'], r: function () { return { t: 'La primera edición del taller es 100% gratuita. Más adelante, las ediciones de pago se gestionarán por los canales oficiales de la empresa.', l: ['#registro', 'Reservar mi lugar'] }; } },
    { k: ['experiencia', 'requisito', 'empresa registrada', 'desde cero', 'novato', 'principiante', 'necesito'], r: function () { return { t: 'No necesitas experiencia previa ni una empresa registrada. El taller está pensado para emprendedores, productores, comerciantes y estudiantes que parten desde cero.', l: ['#publico', '¿Es para mí?'] }; } },
    { k: ['cuando', 'fecha', 'dia', 'hora', 'horario', 'empieza', 'inicia'], r: function () { return { t: 'Próxima jornada: ' + fecha() + '. Anunciaremos la fecha oficial por nuestros canales.', l: ['#cronograma', 'Ver cronograma'] }; } },
    { k: ['modulo', 'temario', 'aprender', 'aprendere', 'contenido', 'veremos', 'programa', 'pasos'], r: function () { return { t: 'Son 6 módulos prácticos:\n1. ¿Tu producto está listo para exportar?\n2. Negociación e Incoterms 2020\n3. Permisos y documentos\n4. Empaque, logística y transporte\n5. Despacho aduanero\n6. Cobro y plan de acción', l: ['#modulos', 'Ver los módulos'] }; } },
    { k: ['certificado', 'diploma', 'constancia'], r: function () { return { t: 'Sí. Quienes participen en la jornada reciben su Certificado Oficial de Participación en formato digital.' }; } },
    { k: ['sede', 'donde', 'lugar', 'direccion', 'ubicacion', 'presencial', 'online', 'virtual'], r: function () { return { t: 'El taller es presencial y se dicta en Barquisimeto, Venezuela. La sede exacta se informará por correo y WhatsApp a las personas inscritas, con tiempo suficiente.', l: ['#registro', 'Inscribirme'] }; } },
    { k: ['inscrib', 'registr', 'anotar', 'cupo', 'reservar', 'participar', 'apuntar'], r: function () { return { t: 'Regístrate en el formulario de esta página y obtén al instante tu pase digital de acceso. Es gratis y toma menos de dos minutos.', l: ['#registro', 'Ir al registro'] }; } },
    { k: ['quien', 'publico', 'dirigido', 'para mi', 'estudiante', 'productor', 'emprendedor'], r: function () { return { t: 'Es abierto a todo público: emprendedores, artesanos, productores, comerciantes, profesionales y estudiantes con ganas de aprender a exportar.', l: ['#publico', 'Conocer el perfil'] }; } },
    { k: ['patrocin', 'aliado', 'publicidad', 'marca', 'anunciar'], r: function () { return { t: 'Si quieres que tu marca navegue con nosotros, escríbenos a info.venezuelaexporta@gmail.com o por WhatsApp al 0424-526-4461. Los patrocinadores aparecen en nuestra franja de aliados.', l: ['#patrocinadores', 'Ver patrocinadores'] }; } },
    { k: ['contact', 'whatsapp', 'telefono', 'correo', 'email', 'soporte', 'escribir', 'llamar', 'numero'], r: function () { return { t: 'Puedes escribirnos al correo info.venezuelaexporta@gmail.com o por WhatsApp (soporte oficial) al 0424-526-4461.', l: ['#contacto', 'Ver contacto'] }; } },
    { k: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos'], r: function () { return { t: '¡Hola! Soy el asistente del taller Venezuela Exporta. Puedo ayudarte con fechas, temario, requisitos e inscripción.' }; } },
    { k: ['gracias', 'listo', 'perfecto', 'genial'], r: function () { return { t: '¡Con gusto! Si te surge otra duda, aquí estoy.' }; } }
  ];
  function local(texto) {
    var n = norm(texto);
    for (var i = 0; i < KB.length; i++) for (var j = 0; j < KB[i].k.length; j++) if (n.indexOf(KB[i].k[j]) !== -1) return KB[i].r();
    return { t: 'Por ahora estoy en modo de prueba y solo conozco lo básico del taller. Prueba preguntando por el costo, la fecha, el temario, los requisitos o cómo inscribirte.', l: ['#faq', 'Ver preguntas frecuentes'] };
  }
  /* Punto de integración con Gemini (vía tu función serverless) */
  function responder(texto) {
    var ep = window.SITE && window.SITE.asistenteEndpoint;
    if (!ep) return Promise.resolve(local(texto));
    return fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mensaje: texto, historial: historial.slice(-8) }) })
      .then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); })
      .then(function (d) { if (d && d.respuesta) return { t: String(d.respuesta) }; throw new Error('vacío'); })
      .catch(function () { return local(texto); });
  }

  function add(rol, data) {
    var d = document.createElement('div'); d.className = 'as-msg ' + rol;
    d.textContent = typeof data === 'string' ? data : data.t;
    if (data.l) { var a = document.createElement('a'); a.href = data.l[0]; a.textContent = data.l[1] + ' →'; a.addEventListener('click', close); d.appendChild(document.createElement('br')); d.appendChild(a); }
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d;
  }
  function ask(texto) {
    texto = texto.trim(); if (!texto || busy) return;
    busy = true; add('user', texto); historial.push({ rol: 'usuario', texto: texto });
    if (chips) chips.style.display = 'none';
    var t = document.createElement('div'); t.className = 'as-msg bot as-typing'; t.innerHTML = '<i></i><i></i><i></i>'; msgs.appendChild(t); msgs.scrollTop = msgs.scrollHeight;
    var started = Date.now();
    responder(texto).then(function (res) {
      setTimeout(function () { t.remove(); add('bot', res); historial.push({ rol: 'asistente', texto: res.t }); busy = false; }, Math.max(0, 650 - (Date.now() - started)));
    });
  }
  function open() {
    panel.classList.add('open'); fab.setAttribute('aria-expanded', 'true'); if (tip) tip.classList.remove('show');
    if (!greeted) { greeted = true; add('bot', { t: '¡Hola! Soy el asistente de Venezuela Exporta. ¿En qué te ayudo?' }); }
    setTimeout(function () { input.focus(); }, 200);
  }
  function close() { panel.classList.remove('open'); fab.setAttribute('aria-expanded', 'false'); }
  fab.addEventListener('click', function () { panel.classList.contains('open') ? close() : open(); });
  closeBtn.addEventListener('click', function () { close(); fab.focus(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) { close(); fab.focus(); } });
  form.addEventListener('submit', function (e) { e.preventDefault(); var v = input.value; input.value = ''; ask(v); });
  [].forEach.call(document.querySelectorAll('.as-chip'), function (c) { c.addEventListener('click', function () { ask(c.textContent); }); });
  /* Globito de invitación (una sola vez, tras unos segundos) */
  setTimeout(function () { if (tip && !panel.classList.contains('open') && !sessionStorage.getItem('as-tip')) { tip.classList.add('show'); try { sessionStorage.setItem('as-tip', '1'); } catch (e) {} setTimeout(function () { tip.classList.remove('show'); }, 6000); } }, 5000);
})();
