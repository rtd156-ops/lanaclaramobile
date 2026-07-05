# LanaClara móvil (Capacitor)

App móvil de LanaClara para **Android** (ahora) e **iOS** (después), desde un
solo proyecto. Envuelve la web app ya desplegada en `app.lanaclara.com`: la
app carga el sitio en un WebView nativo y le agrega, por fases, funciones que
solo existen en un teléfono (huella/PIN, notificaciones push, cámara).

> Reutiliza el 100% de la web. **Publicar la web = actualizar la app** (Fase 1),
> sin volver a subir el APK.

---

## Cómo obtener el APK (sin instalar nada pesado)

La compilación corre **en la nube** con GitHub Actions — no necesitas Android
Studio ni el SDK en tu computadora.

1. Sube este proyecto a un repo de GitHub (rama `main`).
2. Cada push compila el APK. También puedes correrlo a mano: pestaña
   **Actions → Compilar APK de Android → Run workflow**.
3. Al terminar, descarga el artifact **`lanaclara-apk-debug`** → `app-debug.apk`.
4. Pásalo al teléfono (WhatsApp, cable, Drive) y ábrelo. Android pedirá
   permitir "instalar apps de orígenes desconocidos" (normal para un APK que
   no viene de la Play Store todavía).

El APK **debug** sirve para probar entre ustedes (Alex, Anaisa, socios OTX).
Para la Play Store se necesita un APK/AAB **firmado** (ver Fase 5).

### Compilar en tu máquina (opcional)

Solo si instalas Android Studio (trae el SDK y el JDK):

```bash
npm install
npx cap sync android
npm run open:android     # abre Android Studio, botón Run
# o por línea de comandos:
npm run apk:debug        # genera android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Estructura

- `capacitor.config.ts` — configuración. `server.url` apunta a producción.
- `www/` — placeholder (Capacitor exige un webDir; la app real viene de la URL).
- `android/` — proyecto nativo de Android (generado por `cap add android`).
- `.github/workflows/android.yml` — compilación en la nube.

---

## Roadmap por fases

| Fase | Qué | Estado |
|---|---|---|
| **1** | Shell Capacitor → APK que abre la web app | ✅ montado (falta subir a GitHub y correr el CI) |
| **2** | Desbloqueo con **huella/PIN** al abrir (gate nativo) | pendiente |
| **3** | **Notificaciones push** nativas (FCM) + token por usuario | pendiente |
| **4** | **Cámara** para tickets/CFDI + adjuntar a un movimiento | pendiente |
| **5** | **iOS** (requiere Mac) + publicar en Play Store y App Store | pendiente |

### Fase 2 — Biometría (siguiente paso natural)
Gate **nativo** en `MainActivity`: antes de mostrar el WebView, `BiometricPrompt`
pide huella (o PIN del sistema como respaldo). Se re-bloquea al volver de
segundo plano. No toca la web app. Plugin sugerido: `capacitor-native-biometric`
o la API `androidx.biometric` directa en el shell.

### Fase 3 — Push (FCM)
1. Proyecto en Firebase → `google-services.json` en `android/app/`.
2. `@capacitor/push-notifications`; al iniciar sesión, el WebView (LanaClara)
   registra el token del dispositivo en un endpoint nuevo `POST /api/push/token`
   (guardado por usuario/dispositivo).
3. LanaClara envía por FCM (se integra con la base de notificaciones **ntfy**
   que el proyecto ya tiene).

### Fase 4 — Cámara
`@capacitor/camera` disparado desde el formulario de movimiento (guardado por
`Capacitor.isNativePlatform()`); subida a un endpoint `POST /api/adjuntos` con
storage y vista del adjunto.

### Fase 5 — iOS + tiendas
- `npx cap add ios` (mismo proyecto). Compilar requiere **Mac** (o Mac en la
  nube tipo Codemagic/EAS).
- **Google Play**: cuota única **$25 USD**. **App Store**: **$99 USD/año**.
- Firma de release (keystore como secreto de CI, nunca en el repo) y
  `assetlinks.json` en el dominio para verificar el paquete.

---

## Notas

- La sesión (cookie `fin_session`) persiste en el WebView como en el navegador.
- El backend (VPS con Traefik/TLS) no cambia; la app es otro cliente del mismo
  `app.lanaclara.com`.
- Las tres funciones nativas elegidas (huella, push, cámara) le dan a la app
  valor propio suficiente para pasar la revisión de ambas tiendas.
