// Nombre del caché
const CACHE_NAME = "gimnasio-cache-v1";

// Archivos para almacenar en caché
const CACHE_ASSETS = [
  "/index.html",
  "/pages/membresias.html",
  "/pages/entrenadores.html",
  "/pages/usuarios.html",
  "/pages/clases.html",
  "/css/style.css",
  "/vendors/core/core.css",
  "/fonts/feather-font/css/iconfont.css",
  "/vendors/flag-icon-css/css/flag-icon.min.css",
  "/js/template.js",
  "/vendors/core/core.js",
  "/img/mancuerna-de-biceps.png",
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Instalando...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Archivos en caché");
      return cache.addAll(CACHE_ASSETS);
    })
  );
});

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activado");

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log(`[Service Worker] Eliminando caché antigua: ${cache}`);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Intercepción de solicitudes
self.addEventListener("fetch", (event) => {
  console.log(`[Service Worker] Interceptando: ${event.request.url}`);

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Devuelve el recurso de la caché si existe
        return (
          response ||
          fetch(event.request).then((fetchResponse) => {
            // Si no está en la caché, lo añade
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          })
        );
      })
      .catch(() => {
        // Manejo de errores (ejemplo: mostrar una página de fallback)
        if (event.request.mode === "navigate") {
          return caches.match("/offline.html");
        }
      })
  );
});
