// This is a simple service worker for PWA functionality
// In a production app, you would use a more robust solution like Workbox

const CACHE_NAME = "chat-app-v1"
const urlsToCache = ["/", "/icon.png", "/manifest.json"]

self.addEventListener("install", (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener("fetch", (event: any) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})

export {}
