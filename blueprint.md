


¡Entendido! Como Arquitecto, nada me gusta más que un *blueprint* bien definido antes de escribir una sola línea de código. 

Aquí tienes el **Plan Técnico Definitivo (Versión 10/10)**. Este documento es tu "Biblia del Proyecto". Está purgado de prácticas obsoletas y diseñado bajo los estándares más estrictos de ingeniería frontend moderna, garantizando una PWA que se sentirá como una app nativa instalada desde la App Store o Google Play.

---

# 🏗️ BLUEPRINT ARQUITECTÓNICO V2.0
## **Migraine Tracker PWA (Offline-First MVP)**

---

### 1️⃣ STACK TECNOLÓGICO ÉLITE
*   **Core Build Tool:** `Vite` (Compilación instantánea y empaquetado ultra-optimizado).
*   **Lenguaje:** `TypeScript` (Tipado estricto para evitar errores en tiempo de ejecución al manejar datos de la base de datos).
*   **Framework UI:** `React` (ideal por su ecosistema) o `Vanilla Web Components` (si buscas 0 dependencias). *Asumiremos React/TS para este plan por velocidad de desarrollo.*
*   **Base de Datos:** `Dexie.js` (Wrapper de IndexedDB, asíncrono, con observables reales).
*   **CSS:** `TailwindCSS` (Para utilidades Mobile-First rápidas) o `CSS Modules` con variables nativas.
*   **Generación PDF:** `jsPDF` + `html2canvas` (Con inyección de control de memoria).
*   **PWA:** `vite-plugin-pwa` (Generación de Service Worker usando Workbox bajo el capó).

---

### 2️⃣ ESTRATEGIA DE DATOS (DEXIE.JS)
En lugar de un ID irrelevante, la fecha es nuestra clave primaria absoluta. Esto garantiza operaciones O(1) para lecturas y evita registros duplicados en el mismo día.

**Esquema de Base de Datos (`db.ts`):**
```typescript
import Dexie, { Table } from 'dexie';

export interface MigraineEntry {
  date: string;       // Primary Key (Formato ISO estricto: 'YYYY-MM-DD')
  intensity: number;  // 0 (Ninguno), 1 (Leve), 2 (Moderado), 3 (Fuerte), 4 (Severo)
  aura: boolean;      // true/false
  notes: string;      // Texto opcional
  timestamp: number;  // Unix time para ordenamiento secundario o resolución de conflictos
}

export class MigraineDB extends Dexie {
  entries!: Table<MigraineEntry>;

  constructor() {
    super('MigraineDB');
    // '&date' indica que es Primary Key única.
    // 'intensity' se indexa por si en el futuro queremos filtrar "días severos".
    this.version(1).stores({
      entries: '&date, intensity' 
    });
  }
}
export const db = new MigraineDB();
```

---

### 3️⃣ ARQUITECTURA UI/UX (MOBILE-FIRST ESTRICTO)
El diseño no es solo estético, es ingeniería de interacción.

*   **Safe Areas (Notch y Home Indicator):**
    El contenedor principal DEBE tener:
    `padding-top: env(safe-area-inset-top);`
    `padding-bottom: env(safe-area-inset-bottom);`
*   **Prevención de Zoom y Overscroll:**
    En el `index.html`: `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">`
    En el CSS `body`: `overscroll-behavior-y: none;` (evita el "efecto goma" al hacer scroll rápido).
*   **Touch Targets:** Todo botón (especialmente los de intensidad) tendrá mínimo `48px x 48px`.
*   **Feedback Táctil:** Cero dependencias de `:hover`. Uso estricto de `:active` transformando la escala (`transform: scale(0.96)`) para simular presión física.

---

### 4️⃣ FLUJO TÉCNICO DE LA APP (3 VISTAS)

**Pantalla A: Registro Diario (Home)**
*   **Lógica:** Al cargar, consulta `db.entries.get(hoy)`. Si existe, precarga los datos. Si no, estado vacío.
*   **Autoguardado / Guardado Rápido:** Al presionar "Guardar", se ejecuta un `db.entries.put()`. Es un *Upsert* (Actualiza si existe la fecha, inserta si es nueva).

**Pantalla B: Calendario Mensual**
*   **Lógica:** Usar `useLiveQuery` (hook de Dexie para React). Se consultan todas las entradas del mes actual: `db.entries.where('date').between('2026-05-01', '2026-05-31').toArray()`.
*   **Renderizado:** Un Grid de CSS de 7 columnas. Si un día tiene datos, inyecta la variable de color CSS correspondiente a la intensidad.

**Pantalla C: Exportación PDF**
*   **Lógica:** Oculta elementos de UI (botones), aísla el contenedor del calendario.

---

### 5️⃣ MOTOR DE EXPORTACIÓN PDF (SAFE-MEMORY)
Esta es la función que separa una PWA amateur de una profesional.

**Flujo anticolapso (iOS/Safari):**
1. Mostrar Spinner de carga bloqueante.
2. `await new Promise(resolve => setTimeout(resolve, 50))` -> *Justificación: Liberamos el Event Loop un instante para que el navegador pinte el Spinner antes de que html2canvas congele el hilo principal.*
3. Ejecutar `html2canvas(element, { scale: 2, useCORS: true })`. *Justificación: Escala 2 da nitidez suficiente para imprimir sin desbordar la RAM.*
4. Inyectar imagen en `jsPDF` usando compresión: `pdf.addImage(imgData, 'JPEG', x, y, w, h, undefined, 'FAST')`.
5. Descargar usando la API de HTML5 (o Web Share API si es móvil: `navigator.share({files: [pdfFile]})`).

---

### 6️⃣ CAPA PWA (OFFLINE & ACTUALIZACIONES)
*   **Estrategia Service Worker:** `Stale-While-Revalidate`. Sirve la app desde la caché instantáneamente y busca actualizaciones en background.
*   **Manifest.json:** Configurado con `display: "standalone"`, `theme_color` adaptado al modo oscuro/claro, y los íconos necesarios (192x192, 512x512 y máscara de Apple).
*   **Instalación:** Un banner personalizado (no el nativo que es intrusivo) que detecta el evento `beforeinstallprompt` (Android) o muestra instrucciones para "Añadir a la pantalla de inicio" (iOS).

---

### ⚠️ ADVERTENCIAS Y MEJORAS DEL ARQUITECTO (Para tener en cuenta y aplicar desde el Día 1)
1. **Cuota de Almacenamiento iOS y Migración de Dispositivos:** Safari puede borrar datos de IndexedDB si el dispositivo se queda sin espacio. Además, si el usuario cambia de móvil, pierde su historial. *Solución implementada desde el MVP:* Botones de "Backup JSON" e "Importar JSON" manuales desde el día 1. Es fácil de implementar y previene la pérdida total de datos.
2. **Web Share API:** En Android, puedes compartir el PDF directamente por WhatsApp/Email usando `navigator.share()`. En iOS, esto a veces falla con PDFs grandes, por lo que tendremos un `fallback` tradicional de descarga.
3. **Gestión de Husos Horarios (Timezones):** Manejar fechas estrictamente como `YYYY-MM-DD` es genial, pero el objeto `Date` nativo de JavaScript a veces puede hacer que una fecha salte al día anterior o posterior dependiendo de la hora local. *Solución:* Usar una librería súper ligera como `date-fns` o gestionar las fechas usando los métodos UTC estrictamente.
4. **Limpieza de la Caché PWA:** Durante el desarrollo (y en producción) con Vite PWA, las actualizaciones a veces se quedan "atascadas" en los Service Workers. *Solución:* Diseñar un componente UI no intrusivo que avise al usuario: "Hay una nueva versión disponible, recarga la app", para forzar la actualización del código.

---

### ¿CUÁL ES EL SIGUIENTE PASO?

Este es el mapa. Ahora debemos construir la casa. Dime qué cimiento levantamos primero:

*   👉 **[Opción 1]** Inicializar la estructura (Vite + Configuración estricta de TypeScript y Tailwind).
*   👉 **[Opción 2]** Programar el núcleo de datos: `db.ts` completo con funciones de utilidad (CRUD completo).
*   👉 **[Opción 3]** Escribir el Motor de Exportación PDF asíncrono y a prueba de crashes.