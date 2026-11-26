const CACHE = 'atera-v1';
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE)
            .then((cache) => cache.addAll(SHELL))
            .then(() => self.skipWaiting()),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
            )
            .then(() => self.clients.claim()),
    );
});

self.addEventListener('fetch', (event) => {
    try {
        const request = event.request;

        if (request.method !== 'GET') {
            return;
        }

        const url = new URL(request.url);

        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return;
        }

        if (url.href.startsWith('chrome-extension://') || url.origin !== self.location.origin) {
            return;
        }

        if (request.mode === 'navigate') {
            event.respondWith(
                fetch(request)
                    .then((response) => {
                        const copy = response.clone();
                        caches.open(CACHE).then((cache) => cache.put('/index.html', copy));
                        return response;
                    })
                    .catch(async () => {
                        return (
                            (await caches.match('/index.html')) ||
                            (await caches.match('/')) ||
                            Response.error()
                        );
                    }),
            );
            return;
        }

        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) {
                    fetch(request)
                        .then((response) => {
                            const copy = response.clone();
                            caches.open(CACHE).then((cache) => cache.put(request, copy));
                        })
                        .catch(() => {});
                    return cached;
                }

                return fetch(request)
                    .then((response) => {
                        const copy = response.clone();
                        caches.open(CACHE).then((cache) => cache.put(request, copy));
                        return response;
                    })
                    .catch(() => Response.error());
            }),
        );
    } catch {}
});
