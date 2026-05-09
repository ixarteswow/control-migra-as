import styles from './SaveStatus.module.css';

interface Props {
  state: 'idle' | 'saving' | 'saved' | 'error';
}

const STATUS_CONFIG = {
  idle:   { icon: null,   text: null },
  saving: { icon: '⏳',  text: 'Guardando' },
  saved:  { icon: '✅',  text: 'Guardado'  },
  error:  { icon: '❌',  text: 'Error'      },
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
