import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Genera un PDF del elemento proporcionado optimizando el uso de memoria
 * para evitar colapsos en dispositivos móviles (iOS/Safari).
 */
export async function generatePDF(element: HTMLElement, title: string) {
  // 1. Pequeña pausa para permitir que la UI pinte cualquier estado de carga
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    // 2. Renderizado a canvas con escala 2 (equilibrio nitidez/memoria)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#0d0118', // Fondo oscuro del reporte
    });

    // 3. Obtener dimensiones y ratio
    const imgData = canvas.toDataURL('image/jpeg', 0.85); // JPEG con compresión
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // 4. Inyectar imagen con compresión FAST
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    
    // 5. Guardar/Descargar
    pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
