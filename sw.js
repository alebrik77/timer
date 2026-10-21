var C = 'timer-v3';
var FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(C).then(function (c) { return c.addAll(FILES); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x !== C; }).map(function (x) { return caches.delete(x); })); }));
  self.clients.claim();
});
// Rete prima, cache come riserva: gli aggiornamenti arrivano subito, e senza connessione funziona lo stesso.
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(function (n) {
    var copy = n.clone(); caches.open(C).then(function (c) { c.put(e.request, copy); }); return n;
  }).catch(function () { return caches.match(e.request); }));
});
