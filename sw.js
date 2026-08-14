const CACHE_NAME = 'pixel-steward-v400';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css?v=400',
  './app.js?v=400',
  './manifest.json',
  './assets/avatar/avatar-profile.png',
  './assets/icons/icon-home.png',
  './assets/icons/icon-briefcase.png',
  './assets/icons/icon-trophy.png',
  './assets/icons/icon-calendar.png',
  './assets/icons/icon-coin.png',
  './assets/icons/icon-daimon.png',
  './assets/icons/icon-gems.png',
  './assets/icons/icon-gear.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Network first, falling back to cache
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then((response) => {
      if (response.status === 200) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
      }
      return response;
    }).catch(() => {
      return caches.match(event.request);
    })
  );
});
