import { INTENSITY_CONFIG } from '../constants';
import styles from './IntensitySelector.module.css';

interface Props {
  value: number;
  onChange: (level: number) => void;
}

export function IntensitySelector({ value, onChange }: Props) {
  return (
    <div className={styles.container} role="group" aria-label="Nivel de intensidad del dolor">
      <p className={styles.label}>¿Cómo fue el dolor hoy?</p>
      <div className={styles.grid}>
        {INTENSITY_CONFIG.map((config) => {
          const isSelected = value === config.level;
          return (
            <button
              key={config.level}
              id={`intensity-${config.level}`}
              className={styles.btn}
              aria-pressed={isSelected}
              aria-label={`${config.level}: ${config.label}`}
              onClick={() => onChange(config.level)}
              style={
                {
                  '--color': config.color,
                  '--bg': config.bg,
                  '--border': config.border,
                } as React.CSSProperties
              }
            >
              <span className={styles.emoji} aria-hidden="true">
                {config.emoji}
              </span>
              <span className={`${styles.levelNum} ${isSelected ? styles.selected : ''}`}>
                {config.level}
              </span>
              <span className={styles.levelLabel}>{config.label}</span>

              {isSelected && <span className={styles.checkmark} aria-hidden="true">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
