/* ===== countdown.js — cuenta regresiva (solo corre cuando es visible) ===== */
(function () {
  'use strict';
  var d = document.getElementById('cd-days'); if (!d) return;
  var h = document.getElementById('cd-hours'), m = document.getElementById('cd-mins'), s = document.getElementById('cd-secs');
  var grid = document.getElementById('cd-grid'), badge = document.getElementById('cd-badge'), status = document.getElementById('countdown-status');
  var raw = window.SITE && window.SITE.fechaTaller, target = raw ? new Date(raw).getTime() : NaN, timer = null;
  var pad = function (n) { return String(n).padStart(2, '0'); };

  if (isNaN(target)) {
    if (grid) grid.classList.add('hidden');
    if (badge) badge.textContent = 'Próximamente';
    if (status) status.textContent = 'Estamos preparando la primera edición gratuita. ¡Pronto anunciamos la fecha!';
    return;
  }
  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) { d.textContent = h.textContent = m.textContent = s.textContent = '00'; if (badge) badge.textContent = '¡Zarpamos!'; clearInterval(timer); timer = null; return; }
    d.textContent = pad(Math.floor(diff / 864e5));
    h.textContent = pad(Math.floor(diff % 864e5 / 36e5));
    m.textContent = pad(Math.floor(diff % 36e5 / 6e4));
    s.textContent = pad(Math.floor(diff % 6e4 / 1e3));
  }
  if (badge) badge.textContent = 'Fecha confirmada';
  tick();
  var box = d.closest('section') || d;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { if (!timer) { tick(); timer = setInterval(tick, 1000); } }
      else if (timer) { clearInterval(timer); timer = null; }
    }).observe(box);
  } else { timer = setInterval(tick, 1000); }
})();
