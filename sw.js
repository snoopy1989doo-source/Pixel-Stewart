// Service Worker for Pixel Steward PWA
const CACHE_NAME = 'pixel-steward-v2.0.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './assets/foliologo/zero1.png',
  './assets/foliologo/zero2.png',
  './assets/foliologo/zero3.png',
  './assets/foliologo/zero4.png',
  './assets/foliologo/zero5.png',
  './assets/foliologo/usdividentyield.png',
  './assets/foliologo/thaidivident.png',
  './assets/foliologo/nextgen.png',
  './assets/foliologo/crypto.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Some assets could not be cached on install:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Let network handle Firebase and external API calls directly
  if (
    event.request.url.includes('firebasedatabase.app') ||
    event.request.url.includes('googleapis.com') ||
    event.request.url.includes('query1.finance.yahoo.com') ||
    event.request.url.includes('exchangerate-api.com') ||
    event.request.url.includes('coingecko.com') ||
    event.request.url.includes('api.allorigins.win')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic'
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback
        return cachedResponse;
      });
    })
  );
});
