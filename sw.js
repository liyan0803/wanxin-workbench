const C='wanxin-mario-v9';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS).catch(()=>{})).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
// 网络优先：在线永远取最新，断网才用缓存
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  e.respondWith(
    fetch(req,{cache:'no-store'}).then(res=>{
      const cp=res.clone();caches.open(C).then(c=>c.put(req,cp)).catch(()=>{});
      return res;
    }).catch(()=>caches.match(req).then(r=>r||(req.mode==='navigate'?caches.match('./index.html'):null)))
  );
});
