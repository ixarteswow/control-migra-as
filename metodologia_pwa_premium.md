# 🚀 Guía Maestra: Metodología "Conductor PWA Premium" (v2.0)

Esta guía destila los patrones de éxito utilizados en el desarrollo del **Migraine Tracker**. Úsala como plantilla estratégica para construir cualquier aplicación web que requiera alta fidelidad, privacidad y una experiencia móvil impecable.

---

## 🏗️ 1. Arquitectura Técnica (The Stack)

### Persistencia Local-First
- **Motor:** [Dexie.js](https://dexie.org/) (Wrapper de IndexedDB).
- **Por qué:** Permite consultas SQL-like en el navegador, es reactivo (se actualiza la UI sola al cambiar datos) y garantiza que los datos **nunca salgan del móvil**.
- **Patrón:** Crear un archivo `db.ts` centralizado que exporte la instancia de la base de datos y funciones de ayuda (`saveEntry`, `exportBackup`).

### UI & Framework
- **Core:** React (Vite) + TypeScript.
- **Iconos:** [Lucide React](https://lucide.dev/). Siempre vectoriales, nunca emojis para UI crítica.
- **Estilos:** **CSS Modules**. Evita colisiones de clases y mantiene el código limpio.
- **Layout:** Flexbox ininterrumpido desde el `body` hasta el componente hijo más profundo.

---

## 🎨 2. Diseño Visual y UX Emocional

### La Regla del "Mate y Apagado"
Para apps que se usan en momentos de estrés o dolor, evita la luminosidad alta:
- **Fondo:** Usa HSL con baja luminosidad (L < 20%) y baja saturación (S < 40%).
- **Superficies:** Eleva los componentes con 5-10% más de luminosidad que el fondo.
- **Texto:** Evita el blanco puro (#FFF). Usa grises azulados o verdes apagados (`hsl(..., ..., 90%)`).

### Feedback Táctil (Mobile-First)
- **Active States:** No uses `:hover` (no existe en móviles). Usa `:active { transform: scale(0.98); }`.
- **Spinners:** Siempre usa un `Loader2` animado en acciones que duren más de 300ms.
- **Toasts:** Implementa avisos discretos para confirmaciones (ej: "Guardado correctamente").

---

## 📱 3. Optimización para Pantallas Móviles

### Viewport Elástico
Usa la unidad `dvh` (Dynamic Viewport Height) para el contenedor principal:
```css
.shell {
  display: flex;
  flex-direction: column;
  height: 100dvh; /* Altura dinámica real del dispositivo */
  overflow: hidden;
}
```

### Navegación Ergonómica
- **BottomNav:** Los dedos pulgares llegan mejor a la parte inferior. Mantén las 3-4 acciones principales ahí.
- **Safe Areas:** Deja márgenes de al menos `12px` en los bordes para evitar toques accidentales en las curvas de la pantalla.

---

## 📄 4. Reportes y Exportación Profesional

### Impresión Nativa (Ink-Saver)
- **Estrategia:** Evita librerías pesadas como `jsPDF` o `html2canvas` que pueden dar errores de renderizado. Usa `window.print()`.
- **Media Queries:** Diseña un bloque `@media print` en el CSS global para:
    - Forzar fondo blanco y texto negro (ahorro de tinta).
    - Ocultar elementos UI (`.no-print`).
    - Mostrar cabeceras y detalles técnicos solo en papel (`.print-only`).
- **Visualización:** Usa indicadores de alto contraste (ej: círculos de 28px) y texto explícito para que el informe sea útil para un médico.

---

## 🔐 5. Privacidad y Seguridad (Privacy by Design)

- **Zero-Cloud:** No pidas login si no es estrictamente necesario.
- **Exportación Manual:** Ofrece siempre un botón de "Exportar JSON". Es la garantía del usuario de que sus datos le pertenecen.
- **Propiedad del Dato:** La impresión nativa garantiza que el PDF se genera en el dispositivo del usuario, sin pasar por servidores externos.

---

## 💡 Pro-Tip para el Futuro
*Si vas a crear una app muy diferente (ej: un gestor de gastos), solo tienes que cambiar las variables de color en `index.css` y el esquema de la base de datos en `db.ts`. La estructura de navegación y la lógica de "Local-First" ya la tienes perfeccionada.*
