const cacheName = 'imk-v1';

// Daftar file yang perlu di-cache
const cacheFiles = [
  '/imk-v1/',
  '/imk-v1/index.html',
  '/imk-v1/manifest.json',
  '/imk-v1/pages/menu.html',
  '/imk-v1/pages/math-quiz.html',
  '/imk-v1/scripts/math-quiz.js',
  '/imk-v1/scripts/sidebar.js',
  '/imk-v1/styles/home.css',
  '/imk-v1/styles/sidebar.css',
  '/imk-v1/styles/math-quiz.css',
  '/imk-v1/styles/menu.css',
  '/imk-v1/assets/bootstrap-5.3.3-dist/css/bootstrap.min.css',
  '/imk-v1/assets/bootstrap-5.3.3-dist/js/bootstrap.bundle.min.js',
  '/imk-v1/assets/blurry-gradient-haikei.svg',
  '/imk-v1/assets/body-bg.jpg',
  '/imk-v1/assets/trophy.svg',
  '/imk-v1/assets/settings.svg',
  '/imk-v1/assets/DrawKit Vector Illustration Fun & Playful Finn Character (11).png',
  '/imk-v1/assets/icon-192.png',
  '/imk-v1/assets/icon-512.png',
  '/imk-v1/assets/maskable-icon.png',
];

// Instal service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => cache.addAll(cacheFiles))
  );
});

// Aktifkan service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Tangani permintaan sumber daya
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});