self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('cub-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/cub.html',
        '/cub.css',
        '/cub.js',  // これらのファイルをキャッシュ
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
