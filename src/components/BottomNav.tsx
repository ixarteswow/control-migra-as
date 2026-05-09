import { type AppView } from '../constants';
import { FileText, Calendar, Settings } from 'lucide-react';
import styles from './BottomNav.module.css';

interface Props {
  current: AppView;
  onChange: (view: AppView) => void;
}

const NAV_ITEMS: { view: AppView; icon: React.ReactNode; label: string }[] = [
  { view: 'daily',    icon: <FileText size={20} />, label: 'Hoy'       },
  { view: 'calendar', icon: <Calendar size={20} />, label: 'Calendario' },
  { view: 'settings', icon: <Settings size={20} />, label: 'Ajustes'   },
];

export function BottomNav({ current, onChange }: Props) {
  return (
    <nav className={styles.nav} aria-label="Navegación principal">
      {NAV_ITEMS.map(({ view, icon, label }) => (
        <button
          key={view}
          id={`nav-${view}`}
          className={`${styles.item} ${current === view ? styles.active : ''}`}
          aria-current={current === view ? 'page' : undefined}
          onClick={() => onChange(view)}
        >
          <div className={styles.icon} aria-hidden="true">{icon}</div>
          <span className={styles.label}>{label}</span>
        </button>
      ))}
    </nav>
  );
}
