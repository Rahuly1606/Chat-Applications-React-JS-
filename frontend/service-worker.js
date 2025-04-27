// const CACHE_NAME = 'chat-app-cache-v1';
// const urlsToCache = [
//   '/',
//   '/index.html',
//   '/manifest.json',
//   // Add other assets you want to cache
// ];

// self.addEventListener('install', event => {
//   console.log('Service worker installing...');
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(cache => {
//         console.log('Opened cache');
//         return cache.addAll(urlsToCache);
//       })
//   );
// });

// self.addEventListener('fetch', event => {
//   console.log('Fetch event for ', event.request.url);
//   event.respondWith(
//     caches.match(event.request)
//       .then(response => {
//         return response || fetch(event.request);
//       })
//   );
// });
