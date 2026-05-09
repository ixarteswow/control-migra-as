import { useState } from 'react';
import { type AppView } from './constants';
import { DailyView } from './components/DailyView';
import { CalendarView } from './components/CalendarView';
import { SettingsView } from './components/SettingsView';
import { BottomNav } from './components/BottomNav';
import { ReloadPrompt } from './components/ReloadPrompt';
import { Activity } from 'lucide-react';
import styles from './App.module.css';

export default function App() {
  const [view, setView] = useState<AppView>('daily');

  const handleExportPDF = () => {
    // La solución más robusta y ligera: impresión nativa del navegador
    window.print();
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
          
          {view === 'calendar' && (
            <CalendarView onExportPDF={handleExportPDF} />
          )}

          {view === 'settings' && (
            <SettingsView 
              onExportPDF={handleExportPDF} 
              onViewChange={setView}
              isExporting={false} 
            />
          )}
        </div>
      </main>

      <BottomNav current={view} onChange={setView} />
      <ReloadPrompt />
    </div>
  );
}
