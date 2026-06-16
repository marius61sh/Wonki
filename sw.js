// ============================================================
//  WONKI – Service Worker
//  Strategii:
//    • Static assets (CSS/JS/img)  → Cache-first
//    • Pagini HTML                 → Network-first + fallback cache
//    • API calls                   → Network-only (nu cache date autentificate)
//    • Offline fallback            → /offline.html
// ============================================================

const CACHE_VERSION = 'wonki-v1';
const STATIC_CACHE  = CACHE_VERSION + '-static';
const PAGES_CACHE   = CACHE_VERSION + '-pages';

// Fișiere pre-cache la instalare
const PRE_CACHE = [
  '/',
  '/despre',
  '/program',
  '/tarife',
  '/blog',
  '/galerie',
  '/contact',
  '/offline.html',
  '/css/global.css',
  '/css/index.css',
  '/css/pages.css',
  '/js/global.js',
  '/js/pages.js',
  '/js/site.js',
  '/js/i18n.js',
  '/favicon.svg',
  '/manifest.json',
  '/images/icons/icon-192.png',
  '/images/icons/icon-512.png',
];

// ── INSTALL ──────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRE_CACHE.map(url => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ─────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('wonki-') && k !== STATIC_CACHE && k !== PAGES_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH ─────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignoră requests non-GET și din alte origini
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // API → Network-only (nu vrem date vechi din cache)
  if (url.pathname.startsWith('/api/')) return;

  // Admin și portal părinți → Network-only (auth-protected)
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/parinti')) return;

  // Static assets (CSS, JS, images, fonts) → Cache-first
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|webp|woff2?|ico|json)$/)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Pagini HTML → Network-first cu fallback la cache, apoi offline
  event.respondWith(networkFirstWithOffline(request));
});

// ── STRATEGII ────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirstWithOffline(request) {
  const cache = await caches.open(PAGES_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    const staticCached = await caches.match(request, { cacheName: STATIC_CACHE });
    if (staticCached) return staticCached;
    return caches.match('/offline.html');
  }
}

// ── PUSH NOTIFICATIONS (pregătit pentru viitor) ───────────────
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'Wonki 🌟', {
      body:    data.body    || '',
      icon:    '/images/icons/icon-192.png',
      badge:   '/images/icons/icon-96.png',
      tag:     data.tag     || 'wonki-notif',
      data:    { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});
