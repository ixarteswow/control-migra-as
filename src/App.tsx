import { useState, useRef } from 'react';
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
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (view !== 'calendar') {
      alert('Por favor, ve a la pestaña de Calendario para generar el informe del mes actual.');
      setView('calendar');
      return;
    }

    if (!reportRef.current) return;
    
    setIsExporting(true);
    try {
      const monthName = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      await generatePDF(reportRef.current, `Migrañas-${monthName}`);
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
        <div ref={view === 'calendar' ? reportRef : null} className={styles.viewWrapper}>
          {view === 'daily'    && <DailyView />}
          {view === 'calendar' && <CalendarView />}
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
