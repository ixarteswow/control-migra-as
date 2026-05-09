import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, saveEntry, getTodayKey } from '../db';
import { getIntensityConfig, formatDisplayDate, EMPTY_ENTRY } from '../constants';
import { IntensitySelector } from './IntensitySelector';
import { AuraToggle } from './AuraToggle';
import { SaveStatus } from './SaveStatus';
import { Save, Loader2 } from 'lucide-react';
import styles from './DailyView.module.css';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function DailyView() {
  const todayKey = getTodayKey();

  // Leemos de IndexedDB reactivamente
  const existingEntry = useLiveQuery(() => db.entries.get(todayKey), [todayKey]);

  const [intensity, setIntensity] = useState(EMPTY_ENTRY.intensity);
  const [aura, setAura] = useState(EMPTY_ENTRY.aura);
  const [notes, setNotes] = useState(EMPTY_ENTRY.notes);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [hasChanges, setHasChanges] = useState(false);

  // Precarga los datos si ya existe una entrada para hoy
  useEffect(() => {
    if (existingEntry) {
      setIntensity(existingEntry.intensity);
      setAura(existingEntry.aura);
      setNotes(existingEntry.notes);
      setSaveState('saved');
    }
  }, [existingEntry]);

  // Guarda automáticamente cuando hay cambios pendientes (debounce 800ms)
  useEffect(() => {
    if (!hasChanges) return;
    const timer = setTimeout(() => {
      handleSave(intensity, aura, notes);
    }, 800);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intensity, aura, notes, hasChanges]);

  const handleSave = useCallback(
    async (i: number, a: boolean, n: string) => {
      setSaveState('saving');
      try {
        await saveEntry(todayKey, i, a, n);
        setSaveState('saved');
        setHasChanges(false);
      } catch {
        setSaveState('error');
      }
    },
    [todayKey]
  );

  const handleIntensityChange = (level: number) => {
    setIntensity(level);
    setHasChanges(true);
    setSaveState('idle');
  };

  const handleAuraChange = (val: boolean) => {
    setAura(val);
    setHasChanges(true);
    setSaveState('idle');
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    setHasChanges(true);
    setSaveState('idle');
  };

  const config = getIntensityConfig(intensity);

  return (
    <div className={styles.container}>
      {/* Cabecera: fecha + indicador visual de intensidad */}
      <header className={styles.header}>
        <div
          className={styles.intensityIndicator}
          style={{ '--color': config.color, '--bg': config.bg } as React.CSSProperties}
        >
          <span className={styles.intensityEmoji} aria-hidden="true">{config.emoji}</span>
          <div className={styles.intensityInfo}>
            <p className={styles.intensityName}>{config.label}</p>
            <p className={styles.dateText}>{formatDisplayDate(todayKey)}</p>
          </div>
        </div>
        <SaveStatus state={saveState} />
      </header>

      {/* Selector de intensidad */}
      <section className={styles.section} aria-label="Intensidad del dolor">
        <IntensitySelector value={intensity} onChange={handleIntensityChange} />
      </section>

      {/* Toggle de Aura */}
      <section className={styles.section} aria-label="Aura">
        <AuraToggle value={aura} onChange={handleAuraChange} />
      </section>

      {/* Campo de notas */}
      <section className={styles.sectionFlex} aria-label="Notas">
        <div className={styles.notesContainer}>
          <label htmlFor="notes-input" className={styles.notesLabel}>
            Notas del día
          </label>
          <textarea
            id="notes-input"
            className={styles.notesTextarea}
            placeholder="Ej: Dolor detrás del ojo derecho, mejoró con ibuprofeno a las 15h..."
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            rows={4}
            maxLength={500}
          />
          <p className={styles.charCount}>{notes.length}/500</p>
        </div>
      </section>

      {/* Botón de guardado manual (alternativa al auto-guardado) */}
      {hasChanges && (
        <div className={styles.saveActions}>
          <button
            id="save-entry-btn"
            className={styles.saveBtn}
            style={{ '--color': config.color, '--bg': config.bg } as React.CSSProperties}
            onClick={() => handleSave(intensity, aura, notes)}
            disabled={saveState === 'saving'}
          >
            {saveState === 'saving' ? (
              <>
                <Loader2 className="animate-spin" size={18} /> 
                <span>Guardando…</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Guardar entrada</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
