import { precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

declare const self: ServiceWorkerGlobalScope;

const indexHtml = "/index.html";

const invalidateAllCaches = async () => {
    const keys = await caches.keys();
    for (const key of keys) {
        await caches.delete(key);
    }
};

const install = async () => {
    await invalidateAllCaches();
    await caches.open("entrypoint-cache").then((cache) => cache.add(indexHtml));
    await self.skipWaiting();
};

self.addEventListener("install", (event) => event.waitUntil(install()));

self.addEventListener("activate", () => clientsClaim());

self.addEventListener("message", async (event) => {
    const message = event.data as { type: "invalidate-cache" };

    switch (message?.type) {
        case "invalidate-cache": {
            event.waitUntil(invalidateAllCaches());
            break;
        }
        default: {
            console.error(`Unexpected service worker message type`, message);
            break;
        }
    }
});

self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate") {
        event.respondWith(fetch(event.request).catch(async () => (await caches.match(indexHtml))!));
    }
});

precacheAndRoute(self.__WB_MANIFEST);
