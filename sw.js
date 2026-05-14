// BioSpecInfo SW v10.4 — ultra-semplice
var CACHE = 'bsi-v10';

self.addEventListener('install', function(e){
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  e.respondWith(
    caches.match(e.request).then(function(r){
      return r || fetch(e.request).then(function(resp){
        if(e.request.destination === 'document'){
          var clone = resp.clone();
          caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        }
        return resp;
      });
    }).catch(function(){
      return caches.match(e.request);
    })
  );
});
