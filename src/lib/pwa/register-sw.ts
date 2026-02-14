/**
 * Enregistre le Service Worker pour la PWA
 * Doit être appelé côté client uniquement
 */
export function registerServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {

          // Écouter les mises à jour du SW
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Nouveau SW disponible
                }
              });
            }
          });
        })
        .catch((error) => {
        });
    });
  }
}
