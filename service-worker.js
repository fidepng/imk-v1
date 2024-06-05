const cacheName = 'sw-v6';

// Daftar file yang perlu di-cache
const cacheFiles = [
  '/imk-v1/',
  '/imk-v1/index.html',
  '/imk-v1/manifest.json',
  '/imk-v1/pages/menu.html',
  '/imk-v1/pages/math-quiz.html',
  '/imk-v1/pages/common-knowledge-quiz.html',
  '/imk-v1/scripts/math-quiz.js',
  '/imk-v1/scripts/common-knowledge-quiz.js',
  '/imk-v1/scripts/accessibility.js',
  '/imk-v1/scripts/darkmode.js',
  '/imk-v1/styles/home.css',
  '/imk-v1/styles/math-quiz.css',
  '/imk-v1/styles/common-knowledge-quiz.css',
  '/imk-v1/styles/menu.css',
  '/imk-v1/styles/accessibility.css',
  '/imk-v1/styles/darkmode.css',
  '/imk-v1/assets/bootstrap-5.3.3-dist/css/bootstrap.min.css',
  '/imk-v1/assets/bootstrap-5.3.3-dist/js/bootstrap.bundle.min.js',
  '/imk-v1/assets/blurry-gradient-haikei.svg',
  '/imk-v1/assets/body-bg.jpg',
  '/imk-v1/assets/gold-trophy.svg',
  '/imk-v1/assets/settings.svg',
  '/imk-v1/assets/icon-192.png',
  '/imk-v1/assets/icon-512.png',
  '/imk-v1/assets/maskable-icon.png',
  '/imk-v1/assets/animal/kucing1.svg',
  '/imk-v1/assets/animal/kucing2.svg',
  '/imk-v1/assets/sound/correct.wav',
  '/imk-v1/assets/sound/incorrect.wav',
  '/imk-v1/assets/sound/finish.wav',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => cache.addAll(cacheFiles))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== cacheName)
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then((networkResponse) => {
            const responseToCache = networkResponse.clone();
            caches.open(cacheName)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return networkResponse;
          })
          // .catch(() => {
          //   return caches.match('/imk-v1/offline.html');
          // });
      })
  );
});
