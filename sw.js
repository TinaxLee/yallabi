/* ═══════════════════════════════════════════════════════
   Yallabi Service Worker
   策略：Stale-While-Revalidate
   · 殼層靜態資源：Cache First（秒開）
   · API / 外部資源：SWR（先回快取，背景更新）
   · 圖片：Cache First + 背景更新
   ═══════════════════════════════════════════════════════ */

// ── 版本號：每次部署改這一行即可清除舊快取 ──────────────
const VERSION       = 'v5';
const CACHE_SHELL   = `yallabi-shell-${VERSION}`;
const CACHE_RUNTIME = `yallabi-runtime-${VERSION}`;

// ── 殼層資源：離線必要檔案，install 時預快取 ────────────
const SHELL_ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './icon.png',
];

// ── 不快取的請求 Pattern（Firebase、Auth、匯率 API 等）──
const BYPASS_PATTERNS = [
  /firestore\.googleapis\.com/,
  /firebase\.googleapis\.com/,
  /firebasestorage\.googleapis\.com/,
  /gstatic\.com\/firebasejs/,
  /googleapis\.com\/identitytoolkit/,
  /open\.er-api\.com/,
  /exchangerate-api\.com/,
  /accounts\.google\.com/,
  /chrome-extension:/,
];

// ════════════════════════════════════════════════════════
// INSTALL：預快取殼層資源 + 立即跳過等待
// ════════════════════════════════════════════════════════
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_SHELL)
      .then(cache => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ════════════════════════════════════════════════════════
// ACTIVATE：清除所有舊版快取 + 立即接管頁面
// ════════════════════════════════════════════════════════
self.addEventListener('activate', event => {
  const keepCaches = [CACHE_SHELL, CACHE_RUNTIME];
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => !keepCaches.includes(key))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ════════════════════════════════════════════════════════
// MESSAGE：接收頁面的 skipWaiting 指令
// ════════════════════════════════════════════════════════
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting().then(() => {
      self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(client => client.postMessage({ type: 'SW_ACTIVATED' }));
      });
    });
  }
});

// ════════════════════════════════════════════════════════
// FETCH：Stale-While-Revalidate 策略
// ════════════════════════════════════════════════════════
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (BYPASS_PATTERNS.some(p => p.test(request.url))) return;

  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, CACHE_SHELL));
    return;
  }

  if (request.destination === 'image') {
    event.respondWith(staleWhileRevalidate(request, CACHE_RUNTIME));
    return;
  }

  event.respondWith(networkFirst(request, CACHE_RUNTIME));
});

// ════════════════════════════════════════════════════════
// 策略函式
// ════════════════════════════════════════════════════════
async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then(response => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached || networkPromise;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || Response.error();
  }
}
