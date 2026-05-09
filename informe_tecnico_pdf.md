# 📋 Informe Técnico: Análisis de Fallos en Motor de Generación de PDF

**Fecha:** 9 de Mayo de 2026  
**Estado:** Bloqueo en fase de integración (Local & Prod)  
**Proyecto:** Migraine Tracker PWA

---

## 🛠️ 1. Stack Tecnológico Utilizado

Para la generación de informes PDF "on-the-fly" en el cliente, se están utilizando las siguientes librerías:

1.  **html2canvas (v1.4.1):** Utilizada para renderizar un elemento del DOM (el Calendario) en un objeto `<canvas>`.
2.  **jsPDF (v2.5.1):** Utilizada para crear el documento PDF e insertar la imagen generada por el canvas.

---

## 🔍 2. Análisis del Problema

El sistema ha entrado en una regresión de errores circulares al intentar insertar la captura del DOM en el documento PDF. Los fallos detectados son:

### A. Error: `addImage does not support files of type 'UNKNOWN'`
- **Causa:** `jsPDF` no reconoce el formato de la imagen suministrada por el DataURL (`image/jpeg` o `image/png`).
- **Contexto:** Ocurre frecuentemente en entornos empaquetados con **Vite**, donde los módulos internos de compresión de `jsPDF` (como `adce.js` para JPEG o `zlib` para PNG) no se cargan correctamente o son eliminados por el "tree-shaking" del bundler.

### B. Error: `wrong PNG signature`
- **Causa:** Al forzar el formato PNG para solucionar el error anterior, la firma binaria del archivo no coincide con lo que el decodificador de `jsPDF` espera. Esto suele ser un conflicto entre la salida de `canvas.toDataURL` y el parser de la librería.

### C. Error: `Invalid argument passed to jsPDF.scale`
- **Causa:** Este es el error más crítico y persistente. Ocurre dentro de la función interna de escalado de `jsPDF` al intentar ajustar la imagen al ancho de la página. Indica una incompatibilidad interna entre las dimensiones del canvas generado y el sistema de unidades (mm) del PDF.

---

## 📊 3. Qué funciona y qué no

| Componente | Estado | Notas |
| :--- | :--- | :--- |
| **Captura del DOM** | ✅ FUNCIONA | `html2canvas` genera el canvas correctamente con los estilos aplicados. |
| **Cálculo de Datos** | ✅ FUNCIONA | La obtención de `toDataURL` devuelve una cadena Base64 válida. |
| **Creación de Doc PDF** | ✅ FUNCIONA | El objeto `new jsPDF()` se instancia sin errores. |
| **Inserción de Imagen** | ❌ FALLA | `pdf.addImage()` dispara errores de tipos o de escalado. |
| **Descarga de Archivo** | ❌ BLOQUEADO | No se llega a ejecutar `pdf.save()` debido a la excepción previa. |

---

## 💡 4. Propuesta de Solución para otro Técnico

Dado que el stack `html2canvas` + `jsPDF` está presentando una inestabilidad severa en este entorno específico, se proponen las siguientes rutas de escape:

1.  **Uso de la API `window.print()` (Recomendado):**
    - Crear una hoja de estilos CSS específica para `@media print`.
    - Ocultar todos los elementos de la UI (Nav, Header, etc.) excepto el calendario.
    - El navegador gestiona la generación del PDF con una fidelidad del 100% y soporte nativo para fuentes y colores, eliminando la necesidad de librerías externas pesadas.

2.  **Migración a `react-pdf` (Renderer de servidor en cliente):**
    - En lugar de "fotografiar" el DOM, generar el reporte usando componentes declarativos. Es más pesado de implementar pero mucho más robusto.

3.  **Ajuste de Importación (Patch):**
    - Intentar importar `jsPDF` desde su ruta UMD o deshabilitar manualmente el escalado automático antes de llamar a `addImage`.

---

**Conclusión:** El problema no es de lógica de negocio, sino de **interoperabilidad entre el bundler (Vite) y el motor de renderizado de jsPDF**. Se desaconseja seguir intentando parches sobre `addImage` y se sugiere pivotar hacia una solución basada en estándares web (CSS Print).
