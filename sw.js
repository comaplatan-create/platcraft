// Service Worker for additional protection against view-source and code inspection
const CACHE_NAME = 'platcraft-v1';

self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => {
        return cache.addAll([
            '/',
            '/index.html',
            '/styles.css',
            '/favicon.svg'
        ]).catch(() => {
            // Some resources might not exist, that's ok
        });
    }));
});

self.addEventListener('fetch', event => {
    // Intercept view-source attempts and redirect
    const url = event.request.url;
    
    // Block view-source and similar inspection attempts
    if (url.includes('view-source:') || url.includes('devtools') || url.includes('inspector')) {
        event.respondWith(new Response('Access Denied', {
            status: 403,
            statusText: 'Forbidden'
        }));
        return;
    }

    // For normal requests, try cache first, then network
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(response => {
                // Cache successful responses
                if (!response || response.status !== 200 || response.type === 'error') {
                    return response;
                }
                const clonedResponse = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, clonedResponse);
                });
                return response;
            });
        }).catch(() => {
            // Return offline page or empty response
            return new Response('Offline');
        })
    );
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
