// Service Worker for Push Notifications
const CACHE_NAME = "sms-webhook-v1";

// Cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/"]);
    }),
  );
  self.skipWaiting();
});

// Activate and clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Handle fetch requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

// Handle push notifications from server
self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  let data = { title: "New SMS", body: "You have a new message" };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = {
        title: "New SMS",
        body: event.data.text(),
      };
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/notification-icon.png",
    badge: data.badge || "/notification-badge.png",
    image: data.image,
    vibrate: [100, 50, 100],
    data: {
      url: data.data?.url || "/",
      dateOfArrival: Date.now(),
      primaryKey: "1",
    },
    actions: [
      { action: "open", title: "Open" },
      { action: "close", title: "Close" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("Notification click:", event);
  event.notification.close();

  if (event.action === "close") {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Focus existing window or open new one
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    }),
  );
});
