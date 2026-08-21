const CACHE_NAME = 'pilot-tools-shell-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json?v=3',
  './icon-180.png?v=3',
  './icon-192.png?v=3',
  './icon-512.png?v=3'
];
const APP_SHELL_URLS = new Set(
  APP_SHELL.map((path) => new URL(path, self.registration.scope).href)
);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => key.startsWith('pilot-tools-shell-') && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !APP_SHELL_URLS.has(event.request.url)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
