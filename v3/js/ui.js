/* ===== ui.js — header, menú móvil, FAQ, scroll-reveal, fechas ===== */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var SITE = window.SITE || {};
  var root = document.documentElement;

  if (SITE.pagosActivos) root.setAttribute('data-pagos-on', '');
  if (SITE.googleFormActivo) root.setAttribute('data-gform-on', '');
  try { if (sessionStorage.getItem('lite') === '1' || (navigator.connection && navigator.connection.saveData)) root.classList.add('lite'); } catch (e) {}

  /* ---- Fechas dinámicas desde config.js ---- */
  function fechaTexto(tipo) {
    if (!SITE.fechaTaller) return { corta: 'Por anunciar', dia: 'Pronto', larga: 'Fecha por anunciar' }[tipo];
    var d = new Date(SITE.fechaTaller), tz = 'America/Caracas';
    var f = function (o) { return new Intl.DateTimeFormat('es-VE', Object.assign({ timeZone: tz }, o)).format(d); };
    var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
    if (tipo === 'dia') return f({ day: 'numeric' }) + ' ' + cap(f({ month: 'short' }).replace('.', ''));
    if (tipo === 'corta') return cap(f({ weekday: 'short' }).replace('.', '')) + '. ' + f({ day: 'numeric' }) + ' ' + cap(f({ month: 'short' }).replace('.', '')) + ', ' + f({ year: 'numeric' });
    return cap(f({ weekday: 'long' })) + ' ' + f({ day: 'numeric' }) + ' de ' + cap(f({ month: 'long' })) + ', ' + f({ year: 'numeric' }) + ' • ' + f({ hour: 'numeric', minute: '2-digit', hour12: true }).replace(/\s?a\.\s?m\./i, ' a.m.').replace(/\s?p\.\s?m\./i, ' p.m.') + ' (Hora de Venezuela)';
  }
  $$('[data-fecha]').forEach(function (el) { el.textContent = fechaTexto(el.getAttribute('data-fecha')); });
  window.fechaTexto = fechaTexto;

  /* ---- Header: fondo sólido al hacer scroll ---- */
  var header = $('#site-header');
  var onScroll = function () { if (header) header.classList.toggle('scrolled', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---- Menú móvil ---- */
  var btn = $('#mobile-menu-btn'), menu = $('#mobile-menu');
  function setMenu(open) {
    if (!btn || !menu) return;
    menu.classList.toggle('hidden', !open);
    btn.setAttribute('aria-expanded', String(open));
    if (header) header.classList.toggle('menu-open', open);
    var use = btn.querySelector('use'); if (use) use.setAttribute('href', open ? '#i-x' : '#i-menu');
  }
  if (btn) btn.addEventListener('click', function () { setMenu(menu.classList.contains('hidden')); });
  $$('.mobile-nav-link').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---- Sección activa en el menú ---- */
  var links = $$('a.nav-link[href^="#"]');
  if ('IntersectionObserver' in window && links.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) { var s = $(l.getAttribute('href')); if (s) io.observe(s); });
  }

  /* ---- FAQ acordeón ---- */
  $$('.faq-toggle').forEach(function (b) {
    var panel = b.parentElement.querySelector('.faq-content');
    b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') === 'true';
      $$('.faq-toggle').forEach(function (o) { o.setAttribute('aria-expanded', 'false'); var p = o.parentElement.querySelector('.faq-content'); if (p) p.classList.add('hidden'); });
      if (!open) { b.setAttribute('aria-expanded', 'true'); panel.classList.remove('hidden'); }
    });
  });

  /* ---- Reveal al hacer scroll ---- */
  var items = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    items.forEach(function (el) {
      var sib = $$('[data-reveal]', el.parentElement).filter(function (x) { return x.parentElement === el.parentElement; });
      el.style.transitionDelay = Math.min(sib.indexOf(el), 5) * 70 + 'ms';
    });
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { var t = e.target; t.classList.add('in'); ro.unobserve(t); setTimeout(function () { t.removeAttribute('data-reveal'); t.style.transitionDelay = ''; }, 1100); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    items.forEach(function (el) { ro.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  /* ---- Año en el pie ---- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- Service worker (solo en https o localhost) ---- */
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
})();
