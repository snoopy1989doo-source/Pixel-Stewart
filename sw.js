// Service Worker for Pixel Steward PWA (Network-First Strategy)
const CACHE_NAME = 'pixel-steward-v2.3.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css?v=2.3.0',
  './app.js?v=2.3.0',
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
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Assets cache install warning:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Purging old ServiceWorker cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First for core code & Dynamic Fallback
self.addEventListener('fetch', (event) => {
  // Let external APIs bypass Service Worker cache
  if (
    event.request.url.includes('firebasedatabase.app') ||
    event.request.url.includes('googleapis.com') ||
    event.request.url.includes('yahoo.com') ||
    event.request.url.includes('coingecko.com') ||
    event.request.url.includes('binance.com') ||
    event.request.url.includes('parqet.com') ||
    event.request.url.includes('financialmodelingprep.com') ||
    event.request.url.includes('githubusercontent.com') ||
    event.request.url.includes('api.allorigins.win') ||
    event.request.url.includes('corsproxy.io')
  ) {
    return;
  }

  // Network-First Strategy
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request);
      })
  );
});
