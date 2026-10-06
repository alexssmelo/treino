const CACHE = 'treino-v4';
const SHELL = ['./', 'index.html', 'manifest.json', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'cloud.js', 'firebase-config.js',
  'img/afundo-0.jpg', 'img/afundo-1.jpg', 'img/agachamento-0.jpg', 'img/agachamento-1.jpg', 'img/bicicleta-0.jpg', 'img/bicicleta-1.jpg', 'img/elevacao-0.jpg', 'img/elevacao-1.jpg', 'img/flexao-0.jpg', 'img/flexao-1.jpg', 'img/lateral-0.jpg', 'img/lateral-1.jpg', 'img/mountain-0.jpg', 'img/mountain-1.jpg', 'img/ponte-0.jpg', 'img/ponte-1.jpg', 'img/prancha-0.jpg', 'img/prancha-1.jpg', 'img/reverso-0.jpg', 'img/reverso-1.jpg', 'img/superman-0.jpg', 'img/superman-1.jpg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  // bibliotecas do Firebase: guarda uma cópia para o app abrir offline
  if (req.method === 'GET' && url.origin === 'https://www.gstatic.com' && url.pathname.startsWith('/firebasejs/')) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res;
    })));
    return;
  }
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  // rede primeiro (pega atualizações), cache como reserva offline
  e.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('index.html')))
  );
});
