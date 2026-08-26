// Service Worker for Margery Allingham Reader PWA
var CACHE_NAME = 'allingham-reader-v8';
var APP_SHELL = [
  './',
  './index.html',
  './bilingual.html',
  './audiobook.html',
  './manifest.json',
  './icons/icon.svg',
  './_shared/fonts/CrimsonPro-Regular.ttf',
  './_shared/fonts/CrimsonPro-Bold.ttf',
  './_shared/fonts/CrimsonPro-Italic.ttf',
  './_shared/fonts/Lora-Regular.ttf',
  './_shared/fonts/Lora-Bold.ttf',
  './_shared/fonts/Lora-Italic.ttf',
  './_shared/fonts/JetBrainsMono-Regular.ttf',
  './_shared/fonts/JetBrainsMono-Bold.ttf',
  './novels-zh/应节之言.txt',
  './novels-zh/烟中之虎.txt',
  './novels-zh/烟中之虎-第二章.txt',
  './novels-zh/烟中之虎-第三章.txt',
  './novels-zh/荒诞故事.txt',
  './novels-zh/玩笑终了.txt',
  './novels-zh/游手好闲者.txt',
  './novels-zh/停灵.txt',
  './novels-zh/老妈最灵.txt',
  './novels-zh/票面价值.txt',
  './novels-zh/神秘一英里.txt',
  './novels-zh/葬礼上的警察.txt',
  './novels-zh/寿衣时尚.txt',
  './novels/word-in-season.txt',
  './novels/the-tiger-in-the-smoke.txt',
  './novels/mystery-mile.txt',
  './novels/police-at-the-funeral.txt',
  './novels/the-fashion-in-shrouds.txt',
  './novels/the-allingham-case-book.txt'
];

// Install: pre-cache app shell
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(APP_SHELL);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
          .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch: cache-first for fonts, network-first for novels, stale-while-revalidate for others
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);

  // Fonts & icons: cache-first
  if (url.pathname.indexOf('/_shared/fonts/') !== -1 || url.pathname.indexOf('/icons/') !== -1) {
    e.respondWith(
      caches.match(e.request).then(function(r) {
        return r || fetch(e.request).then(function(resp) {
          if (resp.ok) {
            var clone = resp.clone();
            caches.open(CACHE_NAME).then(function(c) { c.put(e.request, clone); });
          }
          return resp;
        });
      })
    );
    return;
  }

  // Novel files (EN & ZH): network-first, fallback to cache (enables offline after first read)
  if (url.pathname.indexOf('/novels/') !== -1) {
    e.respondWith(
      fetch(e.request).then(function(resp) {
        if (resp.ok) {
          var clone = resp.clone();
          caches.open(CACHE_NAME).then(function(c) { c.put(e.request, clone); });
        }
        return resp;
      }).catch(function() {
        return caches.match(e.request).then(function(r) {
          return r || new Response('离线且未缓存此书。请联网打开一次后再离线阅读。', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        });
      })
    );
    return;
  }

  // Everything else: stale-while-revalidate
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      var fetched = fetch(e.request).then(function(resp) {
        if (resp.ok) {
          var clone = resp.clone();
          caches.open(CACHE_NAME).then(function(c) { c.put(e.request, clone); });
        }
        return resp;
      }).catch(function() {
        return cached;
      });
      return cached || fetched;
    })
  );
});
