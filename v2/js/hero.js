/* ===== hero.js — escena pinneada ligada al scroll =====
   0 → .3  vista cenital del barco (cámara arriba)
   .22 → .6 la cámara baja: transición a vista lateral en ángulo
   .62 → 1  el barco sigue de largo y sale hacia arriba
   Un solo listener pasivo + rAF; solo se escriben transform/opacity. */
(function () {
  'use strict';
  var hero = document.querySelector('[data-hero]'); if (!hero) return;
  var topScene = hero.querySelector('.hero-scene--top'), sideScene = hero.querySelector('.hero-scene--side');
  var shipTop = hero.querySelector('.ship-top'), shipSide = hero.querySelector('.hero-ship'), content = hero.querySelector('.hero-content');
  var cue = hero.querySelector('.hero-cue');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var H = hero.offsetHeight, vh = window.innerHeight, ticking = false, last = '';
  var clamp = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  var smooth = function (x) { x = clamp(x); return x * x * (3 - 2 * x); };

  function frame() {
    ticking = false;
    var range = Math.max(H - vh, 1), p = clamp(window.pageYOffset / range);
    var key = p.toFixed(4); if (key === last) return; last = key;
    var t1 = smooth((p - 0.22) / 0.38), fTop = smooth((p - 0.30) / 0.22), fSide = smooth((p - 0.30) / 0.26), q = smooth((p - 0.62) / 0.38);

    topScene.style.opacity = (1 - fTop).toFixed(3);
    topScene.style.visibility = fTop >= 1 ? 'hidden' : 'visible';
    shipTop.style.transform = 'rotateX(' + (t1 * 74).toFixed(1) + 'deg) translate3d(0,' + (-t1 * 5).toFixed(1) + '%,0) scale(' + (1 - t1 * 0.2).toFixed(3) + ')';
    shipTop.style.opacity = (1 - smooth((t1 - 0.35) / 0.45)).toFixed(3);

    sideScene.style.opacity = fSide.toFixed(3);
    sideScene.style.visibility = fSide <= 0 ? 'hidden' : 'visible';
    sideScene.style.transform = 'scale(' + (1.16 - 0.16 * t1).toFixed(3) + ')';
    shipSide.style.transform = 'translate3d(0,' + (-q * vh * 0.9).toFixed(1) + 'px,0) scale(' + (1 + q * 0.15).toFixed(3) + ') rotate(' + (-q * 2).toFixed(2) + 'deg)';

    var co = clamp(1 - p / 0.26);
    content.style.opacity = co.toFixed(3);
    content.style.transform = 'translate3d(0,' + (-p * 70).toFixed(1) + 'px,0)';
    content.style.pointerEvents = co < 0.15 ? 'none' : '';
    if (cue) cue.style.opacity = clamp(1 - p / 0.08).toFixed(2);

    hero.classList.toggle('side-off', fSide <= 0);
    hero.classList.toggle('top-off', fTop >= 1);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  function measure() { H = hero.offsetHeight; vh = window.innerHeight; last = ''; frame(); }

  if (!reduce) {
    window.addEventListener('scroll', onScroll, { passive: true });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(measure, 150); });
    frame();
  }

  /* Pausar animaciones fuera de pantalla o con la pestaña oculta */
  var offscreen = false;
  function sync() { hero.classList.toggle('is-paused', offscreen || document.hidden); }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { offscreen = !es[0].isIntersecting; sync(); }).observe(hero);
  document.addEventListener('visibilitychange', sync);

  /* Guardia de rendimiento: si los primeros cuadros van lentos, modo "lite" */
  if (!document.documentElement.classList.contains('lite') && !reduce) {
    var n = 0, t0 = 0, slow = 0;
    (function sample(t) {
      if (n > 0 && t - t0 > 34) slow++;
      t0 = t; n++;
      if (n < 100) requestAnimationFrame(sample);
      else if (slow > 35) { document.documentElement.classList.add('lite'); try { sessionStorage.setItem('lite', '1'); } catch (e) {} }
    })(performance.now());
  }
})();
