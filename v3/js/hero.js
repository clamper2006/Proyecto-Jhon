/* ===== hero.js — escena pinneada ligada al scroll (v3) =====
   El barco está pre-renderizado en 5 ángulos (assets/ship3d-0..4.svg). El scroll mezcla los cuadros:
     0 cenital → 1 → 2 (proa hacia la cámara, 3/4) → 3 → 4 lateral en ángulo con la proa visible.
   Al terminar, el barco se queda flotando en el agua y la escena sale con el scroll normal (no vuela).
   Un solo listener pasivo + rAF; solo se escriben transform/opacity. */
(function () {
  'use strict';
  var hero = document.querySelector('[data-hero]'); if (!hero) return;
  var topScene = hero.querySelector('.hero-scene--top'), sideScene = hero.querySelector('.hero-scene--side');
  var shipTop = hero.querySelector('.s3d--top'), shipSide = hero.querySelector('.s3d--side');
  var content = hero.querySelector('.hero-content'), cue = hero.querySelector('.hero-cue');
  var frames = [].slice.call(hero.querySelectorAll('.s3d-f')).sort(function (a, b) { return a.dataset.f - b.dataset.f; });
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var H = hero.offsetHeight, vh = window.innerHeight, D = 0, ticking = false, last = '';
  var clamp = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  var smooth = function (x) { x = clamp(x); return x * x * (3 - 2 * x); };

  function setF(i, w) {
    var el = frames[i]; if (!el) return;
    el.style.opacity = w.toFixed(3);
    el.style.visibility = w <= 0.002 ? 'hidden' : 'visible';
  }
  function frame() {
    ticking = false;
    var range = Math.max(H - vh, 1), p = clamp(window.pageYOffset / range);
    var key = p.toFixed(4); if (key === last) return; last = key;
    var f = 4 * smooth((p - 0.05) / 0.62);          // 0..4: posición en la "vuelta" del barco
    var side = smooth(f - 2);                         // el cielo/horizonte aparece entre f=2 y f=3

    topScene.style.opacity = side >= 1 ? '0' : '1';
    topScene.style.visibility = side >= 1 ? 'hidden' : 'visible';
    shipTop.style.transform = 'translate3d(0,' + (D * smooth(f / 3)).toFixed(1) + 'px,0)';
    sideScene.style.opacity = side.toFixed(3);
    sideScene.style.visibility = side <= 0 ? 'hidden' : 'visible';

    setF(0, 1 - clamp(f));
    setF(1, Math.max(0, 1 - Math.abs(f - 1)));
    setF(2, clamp(f - 1));
    setF(3, 1 - clamp(f - 3));
    setF(4, clamp(f - 3));

    var co = clamp(1 - p / 0.24);
    content.style.opacity = co.toFixed(3);
    content.style.transform = 'translate3d(0,' + (-p * 60).toFixed(1) + 'px,0)';
    content.style.pointerEvents = co < 0.15 ? 'none' : '';
    if (cue) cue.style.opacity = clamp(1 - p / 0.06).toFixed(2);

    hero.classList.toggle('side-off', side <= 0);
    hero.classList.toggle('top-off', side >= 1);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  function measure() { H = hero.offsetHeight; vh = window.innerHeight; D = shipSide.offsetTop - shipTop.offsetTop; last = ''; frame(); }

  if (!reduce) {
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(measure, 150); });
    window.addEventListener('load', measure);
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
