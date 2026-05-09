import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import styles from './SaveStatus.module.css';

interface Props {
  state: 'idle' | 'saving' | 'saved' | 'error';
}

const STATUS_CONFIG = {
  idle:   { icon: null,   text: null },
  saving: { icon: <Loader2 className="animate-spin" size={14} />,  text: 'Guardando' },
  saved:  { icon: <CheckCircle2 size={14} />,  text: 'Guardado'  },
  error:  { icon: <AlertCircle size={14} />,  text: 'Error'      },
};

export function SaveStatus({ state }: Props) {
  const config = STATUS_CONFIG[state];
  if (!config.icon) return null;

  return (
    <div
      className={`${styles.badge} ${styles[state]}`}
      role="status"
      aria-live="polite"
      aria-label={`Estado: ${config.text}`}
    >
      <span aria-hidden="true">{config.icon}</span>
      <span className={styles.text}>{config.text}</span>
    </div>
  );
}
