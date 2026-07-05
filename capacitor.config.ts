import type { CapacitorConfig } from '@capacitor/cli';

/**
 * App móvil de LanaClara (Capacitor).
 *
 * Fase 1: el WebView carga directamente la app en producción
 * (server.url = https://app.lanaclara.com). Reutiliza el 100% de la web app
 * ya desplegada; publicar la web = actualizar la app. La sesión (cookie
 * fin_session) vive en el WebView como en el navegador.
 *
 * Las funciones nativas (biometría, push, cámara) se agregan por fases con
 * plugins de Capacitor; ver README.md.
 */
const config: CapacitorConfig = {
  appId: 'com.lanaclara.app',
  appName: 'LanaClara',
  webDir: 'www', // placeholder; la app real viene de server.url
  server: {
    // Entra por /inicio (no la landing de marketing): con sesión enruta a tu
    // inicio/tablero según el giro; sin sesión, el proxy manda a /login.
    url: 'https://app.lanaclara.com/inicio',
    cleartext: false, // solo HTTPS
    androidScheme: 'https',
  },
  android: {
    // El overscroll/glow de Android no combina con una app de finanzas.
    allowMixedContent: false,
  },
};

export default config;
