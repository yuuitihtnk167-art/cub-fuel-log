// cub-sw.js
const CACHE_NAME = 'cub-cache-v1';
const OFFLINE_URLS = [
  './cub.html',
  './cub-manifest.webmanifest',
  './cub-icon.png'
];

// インストール時に必要なファイルをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    })
  );
});

// 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

// オフライン対応（キャッシュ優先 + ナビゲーション時は cub.html をフォールバック）
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // ページ遷移時にネットワークエラーなら cub.html を返す
        if (event.request.mode === 'navigate') {
          return caches.match('./cub.html');
        }
      });
    })
  );
});