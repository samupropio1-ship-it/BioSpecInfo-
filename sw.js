// BioSpecInfo Service Worker v10.4
// © 2025 Samuele Pio Provenzano
var CACHE = 'bsi-v10';

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c){ return c.add('./BioSpecInfo.html'); })
      .then(function(){ return self.skipWaiting(); })
      .catch(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function(cached){
      return cached || fetch(e.request);
    }).catch(function(){
      return caches.match('./BioSpecInfo.html');
    })
  );
});
