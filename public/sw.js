const CACHE_NAME = "adrosnoteshub-v1";
const STATIC_CACHE = "adrosnoteshub-static-v1";
const DYNAMIC_CACHE = "adrosnoteshub-dynamic-v1";

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/resources.json",
  "/placeholder.svg",
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first for static assets
  CACHE_FIRST: "cache-first",
  // Network first for dynamic content
  NETWORK_FIRST: "network-first",
  // Stale while revalidate for resources
  STALE_WHILE_REVALIDATE: "stale-while-revalidate",
};

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker: Static assets cached");
        self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Error caching static assets", error);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("Service Worker: Activated");
        self.clients.claim();
      }),
  );
});

// Fetch event - handle requests with appropriate cache strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip Tawk.to and other third-party requests that might cause CORS issues
  if (
    url.hostname.includes("tawk.to") ||
    url.hostname.includes("embed.tawk.to") ||
    url.hostname !== location.hostname
  ) {
    // Let these requests go through normally without interception
    return;
  }

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  try {
    // Static assets - cache first
    if (isStaticAsset(url.pathname)) {
      return await cacheFirst(request, STATIC_CACHE);
    }

    // API requests - network first
    if (url.pathname.startsWith("/api/")) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }

    // Resources.json - stale while revalidate
    if (url.pathname === "/resources.json") {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    }

    // HTML pages - network first with cache fallback
    if (request.headers.get("accept")?.includes("text/html")) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }

    // Other assets - stale while revalidate
    return await staleWhileRevalidate(request, DYNAMIC_CACHE);
  } catch (error) {
    console.error("Service Worker: Error handling request", error);

    // Return offline page for HTML requests
    if (request.headers.get("accept")?.includes("text/html")) {
      return caches.match("/") || new Response("Offline", { status: 503 });
    }

    return new Response("Offline", { status: 503 });
  }
}

// Cache first strategy
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);

  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
  }

  return networkResponse;
}

// Network first strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    // Trigger fetch and update cache asynchronously, but don't wait for it
    fetch(request).then(async (networkResponse) => {
      if (networkResponse.ok) {
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
      }
    }).catch((error) => {
      console.error("Service Worker: Error updating cache in staleWhileRevalidate", error);
    });

    return cachedResponse;
  } else {
    // No cached response, wait for network response
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }
}

// Helper function to determine if asset is static
function isStaticAsset(pathname) {
  const staticExtensions = [
    ".js",
    ".css",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".woff",
    ".woff2",
    ".ttf",
  ];
  return (
    staticExtensions.some((ext) => pathname.endsWith(ext)) ||
    pathname === "/manifest.json"
  );
}

// Handle background sync for offline form submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log("Service Worker: Background sync triggered");
  // Handle any pending offline form submissions here
}

// Handle push notifications (if needed in the future)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/placeholder.svg",
      badge: "/placeholder.svg",
      data: data.data,
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
});
