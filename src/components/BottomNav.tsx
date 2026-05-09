import { type AppView } from '../constants';
import styles from './BottomNav.module.css';

interface Props {
  current: AppView;
  onChange: (view: AppView) => void;
}

const NAV_ITEMS: { view: AppView; icon: string; label: string }[] = [
  { view: 'daily',    icon: '📋', label: 'Hoy'       },
  { view: 'calendar', icon: '📅', label: 'Calendario' },
  { view: 'settings', icon: '⚙️', label: 'Ajustes'   },
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
          <span className={styles.icon} aria-hidden="true">{icon}</span>
          <span className={styles.label}>{label}</span>
        </button>
      ))}
    </nav>
  );
}
