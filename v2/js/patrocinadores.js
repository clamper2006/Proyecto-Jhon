/* ===== patrocinadores.js — marquee infinito sin saltos (duplica las tarjetas y pausa fuera de pantalla) ===== */
(function () {
  'use strict';
  var sec = document.getElementById('patrocinadores'); if (!sec) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  [].forEach.call(sec.querySelectorAll('.marquee'), function (m) {
    var track = m.querySelector('.marquee-track'); if (!track || reduce) return;
    [].slice.call(track.children).forEach(function (c) {
      var k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true');
      [].forEach.call(k.querySelectorAll('img'), function (i) { i.alt = ''; });
      track.appendChild(k);
    });
    m.classList.add('is-live');
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { sec.classList.toggle('is-paused', !es[0].isIntersecting); }, { rootMargin: '80px' }).observe(sec);
  }
})();
