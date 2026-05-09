import styles from './AuraToggle.module.css';

interface Props {
  value: boolean;
  onChange: (val: boolean) => void;
}

export function AuraToggle({ value, onChange }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <p className={styles.title}>Aura</p>
        <p className={styles.description}>
          Síntomas visuales antes del dolor (destellos, líneas en zigzag, visión borrosa)
        </p>
      </div>
      <button
        id="aura-toggle"
        role="switch"
        aria-checked={value}
        aria-label="Activar o desactivar aura"
        className={`${styles.toggle} ${value ? styles.on : ''}`}
        onClick={() => onChange(!value)}
      >
        <span className={styles.thumb} aria-hidden="true" />
        <span className="sr-only">{value ? 'Sí' : 'No'}</span>
      </button>
    </div>
  );
}
