/* Service worker: la app abre sin conexión una vez visitada */
var V = 'vexporta-v3';
var SHELL = ['./', 'index.html', 'css/base.css', 'css/utilities.css', 'css/components.css', 'css/hero.css', 'css/sponsors.css', 'css/asistente.css', 'js/config.js', 'js/ui.js', 'js/countdown.js', 'js/registro.js', 'js/hero.js', 'js/patrocinadores.js', 'js/asistente.js',
  'assets/ship3d-0.svg', 'assets/ship3d-1.svg', 'assets/ship3d-2.svg', 'assets/ship3d-3.svg', 'assets/ship3d-4.svg', 'assets/sea-top.svg', 'assets/wave-back.svg', 'assets/wave-mid.svg', 'assets/wave-front.svg', 'assets/clouds-far.svg', 'assets/clouds-near.svg', 'assets/puerto.svg', 'assets/icon.svg'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(V).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x !== V; }).map(function (x) { return caches.delete(x); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var r = e.request; if (r.method !== 'GET') return;
  var u = new URL(r.url);
  if (u.origin !== location.origin) return; // fuentes/Google Forms: red normal
  if (r.mode === 'navigate') { e.respondWith(fetch(r).then(function (res) { var cp = res.clone(); caches.open(V).then(function (c) { c.put('index.html', cp); }); return res; }).catch(function () { return caches.match('index.html'); })); return; }
  e.respondWith(caches.match(r).then(function (hit) { return hit || fetch(r).then(function (res) { var cp = res.clone(); caches.open(V).then(function (c) { c.put(r, cp); }); return res; }); }));
});
