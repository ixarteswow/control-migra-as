



 **Resumen Conceptual y Técnico (Pitch Document)**. Está diseñado en dos mitades: la primera vende el producto y su valor a un usuario o inversor, y la segunda sirve de radiografía exacta para cualquier ingeniero de software.

---

# 🧠 Proyecto: Migraine Tracker PWA
### *Tu registro diario de migrañas, siempre disponible, 100% privado.*

---

## 👥 PARTE 1: Visión del Producto (Para usuarios y negocio)

**¿Qué es?**
Es una aplicación móvil de seguimiento de migrañas que vive en tu navegador web. Te permite registrar si tuviste dolor de cabeza hoy, qué tan fuerte fue, y exportar un informe mensual en PDF para llevárselo a tu médico. 

**¿Cuál es la "magia" de esta app?**
1. **Sin descargas de la App Store:** Entras a una página web y le das a "Añadir a la pantalla de inicio". Automáticamente se comporta como una app normal en tu teléfono (con su propio icono y sin barra de direcciones).
2. **Funciona sin Internet (Offline):** Puedes estar en un avión, en el metro o sin cobertura; la app abrirá instantáneamente y guardará tus datos de todos modos.
3. **Privacidad Absoluta (Sin servidores ni contraseñas):** No hay que crear cuenta, ni iniciar sesión. Tus datos médicos nunca viajan por internet. Todo se guarda físicamente en el chip de memoria de tu propio teléfono.
4. **Reportes Médicos en 1 Clic:** La app genera un documento PDF profesional de tu mes, listo para imprimir o enviar por WhatsApp a tu especialista.

**El Flujo de Uso:**
*   **Día a Día:** Abres la app, eliges un color (de verde a rojo oscuro según el dolor), marcas si tuviste "Aura" (síntomas visuales), escribes una nota si quieres, y guardas. (10 segundos de esfuerzo).
*   **Fin de Mes:** Vas al calendario, ves tu historial completo a color, y pulsas "Exportar PDF".

---

## ⚙️ PARTE 2: Radiografía Técnica (Para Ingenieros y Arquitectos)

El proyecto es una **PWA (Progressive Web App) Serverless**, construida bajo una filosofía estricta de **"Offline-First"** y **"Mobile-First"**. Al eliminar la capa del backend, reducimos la latencia a cero y eliminamos los costes de infraestructura.

**1. Stack Frontend Base:**
*   **Vite + React + TypeScript:** Vite proporciona un entorno de desarrollo ultrarrápido y un empaquetado final mínimo. React maneja la UI reactiva, y TypeScript garantiza la integridad de los datos evitando errores en tiempo de ejecución.
*   **TailwindCSS (Mobile-First):** Sistema de estilos por utilidades. Se aplican técnicas de *Safe Areas* (Notch de iOS/Android) mediante `env(safe-area-inset)` y se evita el overscroll o zoom no deseado (`touch-action: manipulation`).

**2. Capa de Almacenamiento (Base de Datos Local):**
*   **IndexedDB + Dexie.js:** Como no hay backend, la base de datos reside en el navegador del usuario. Usamos Dexie.js como ORM/Wrapper asíncrono para IndexedDB. 
*   *Arquitectura de datos:* Se usa un modelo de clave-valor hiper-optimizado donde la clave primaria es la propia `fecha` (ej. "2026-05-09"). Esto evita registros duplicados, simplifica los *Upserts* (insertar/actualizar) y hace que las consultas por rango (ej. "dame todo el mes de mayo") sean instantáneas.

**3. Capa de PWA y Offline:**
*   **Vite PWA Plugin (Workbox):** Genera automáticamente un *Service Worker* y el `manifest.json`.
*   *Estrategia de Caché:* `Stale-While-Revalidate`. La app carga inmediatamente desde la caché del dispositivo (arranque instantáneo en <1 segundo) y busca actualizaciones del código en segundo plano.

**4. Motor de Exportación a PDF (Operación Crítica):**
*   **jsPDF + html2canvas:** Renderización del DOM en cliente.
*   *Mitigación de riesgos:* Safari (iOS) tiene límites de memoria RAM muy estrictos para elementos `<canvas>`. Para evitar el *crash* de la app al generar el PDF, limitamos el `scale` de renderizado (max 2), forzamos una pausa asíncrona (`setTimeout`) para permitir el pintado de la UI de carga, y comprimimos el canvas en JPEG rápido (`FAST`) antes de inyectarlo en el PDF.

---

### 💡 Resumen en una frase:
*Es una aplicación frontend desconectada de alto rendimiento que utiliza las APIs de almacenamiento nativo del navegador para simular una experiencia móvil completa, segura y sin fricción de infraestructura.*

---