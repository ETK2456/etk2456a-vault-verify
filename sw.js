// TJ3 Vault - Offline Service Worker - Fix blob error
const CACHE='tj3-vault-v2';
const URLS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(URLS)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{
    if(r.ok)caches.open(CACHE).then(ca=>ca.put(e.request,r.clone()));
    return r;
  }).catch(()=>c||caches.match('./index.html'))));
});
