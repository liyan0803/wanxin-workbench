const C='wanxin-mario-v8';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS).catch(()=>{})).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const isDoc=req.mode==='navigate'||(req.headers.get('accept')||'').includes('text/html');
  if(isDoc){
    // 网络优先：在线拿最新，断网回退到缓存
    e.respondWith(
      fetch(req).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put('./index.html',cp));return res;})
        .catch(()=>caches.match('./index.html').then(r=>r||caches.match('./')))
    );
  }else{
    e.respondWith(
      caches.match(req).then(r=>r||fetch(req).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(req,cp));return res;}))
    );
  }
});
