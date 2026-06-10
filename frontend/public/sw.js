self.addEventListener("install", (event) => {
  console.log("Service Worker installed.");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated.");
});

self.addEventListener("fetch", (event) => {
  // Basic network-first strategy, fallback to a simple offline message
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response("Offline content not available.", {
        status: 503,
        statusText: "Service Unavailable",
        headers: new Headers({
          "Content-Type": "text/plain"
        })
      });
    })
  );
});
