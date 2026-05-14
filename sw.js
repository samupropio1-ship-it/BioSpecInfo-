// BioSpecInfo Service Worker v10.4
// © 2025 Samuele Pio Provenzano
var CACHE = 'bsi-v10';
var CORE_FILES = [
  './BioSpecInfo.html',
  './manifest.json',
  './icon-192.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return c.addAll(CORE_FILES);
    }).then(function(){
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e){
  // Solo richieste GET same-origin o RCSB/PubChem
  if(e.request.method !== 'GET') return;
  
  var url = e.request.url;
  var isCore = CORE_FILES.some(function(f){ return url.includes(f.replace('./',''));});
  
  if(isCore){
    // Cache-first per i file core
    e.respondWith(
      caches.match(e.request).then(function(r){
        return r || fetch(e.request).then(function(resp){
          var clone = resp.clone();
          caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
          return resp;
        });
      })
    );
  } else {
    // Network-first per API (PubChem, RCSB, ecc.)
    e.respondWith(
      fetch(e.request).catch(function(){
        return caches.match(e.request);
      })
    );
  }
});
