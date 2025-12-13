const CACHE_NAME = 'cub-cache-v1';

// まずは「成立」を最優先：PWA判定に必要な最低限
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        './',
        './cub.html',
        './cub-manifest.webmanifest',
        './cub-icon-192.png',
        './cub-icon-512.png'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve())));
    await self.clients.claim();
  })());
});

// オフライン優先（キャッシュ→ネット）
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // GET以外は触らない
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
