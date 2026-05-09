import { useState } from 'react';
import { type AppView } from './constants';
import { DailyView } from './components/DailyView';
import { CalendarView } from './components/CalendarView';
import { SettingsView } from './components/SettingsView';
import { BottomNav } from './components/BottomNav';
import { ReloadPrompt } from './components/ReloadPrompt';
import { generatePDF } from './utils/pdfEngine';
import { Activity } from 'lucide-react';
import styles from './App.module.css';

export default function App() {
  const [view, setView] = useState<AppView>('daily');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    // Si ya estamos en el proceso, no hacer nada
    if (isExporting) return;
    
    setIsExporting(true);
    try {
      // Buscamos el elemento del calendario en el DOM aunque no sea la vista activa
      // Para esto, nos aseguramos de que el CalendarView siempre se renderice pero se oculte
      const calendarEl = document.getElementById('printable-calendar');
      if (!calendarEl) throw new Error('No se pudo encontrar el calendario para imprimir');

      const monthName = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      await generatePDF(calendarEl, `Migrañas-${monthName}`);
    } catch (error) {
      alert('Error al generar PDF: ' + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <Activity className={styles.logoIcon} size={32} />
          <div>
            <h1 className={styles.appName}>Migraine Tracker</h1>
            <p className={styles.appTagline}>Tu registro diario, siempre privado</p>
          </div>
        </div>
      </header>

      <main className={styles.main} id="main-content">
        <div className={styles.viewWrapper}>
          {view === 'daily'    && <DailyView />}
          
          {/* El calendario siempre se renderiza (oculto si no es su vista) para poder exportar a PDF */}
          <div 
            id="printable-calendar" 
            style={view !== 'calendar' ? { display: 'none' } : { flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <CalendarView onExportPDF={handleExportPDF} isExporting={isExporting} />
          </div>

          {view === 'settings' && (
            <SettingsView onExportPDF={handleExportPDF} isExporting={isExporting} />
          )}
        </div>
      </main>

      <BottomNav current={view} onChange={setView} />
      <ReloadPrompt />
    </div>
  );
}
