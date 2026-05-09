import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { getIntensityConfig } from '../constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CalendarView.module.css';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Obtener entradas del mes actual
  const monthEntries = useLiveQuery(async () => {
    const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const end = `${year}-${String(month + 1).padStart(2, '0')}-31`;
    return db.entries.where('date').between(start, end, true, true).toArray();
  }, [year, month]);

  const entriesMap = useMemo(() => {
    const map = new Map<string, number>();
    monthEntries?.forEach(entry => {
      map.set(entry.date, entry.intensity);
    });
    return map;
  }, [monthEntries]);

  // Generar días del calendario
  const calendarDays = useMemo(() => {
    const days = [];
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    // Ajustar para que la semana empiece en Lunes (0=Lunes, ..., 6=Domingo)
    const startPadding = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Padding inicial
    for (let i = 0; i < startPadding; i++) {
      days.push({ type: 'padding', key: `pad-${i}` });
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        type: 'day',
        day,
        dateKey,
        intensity: entriesMap.get(dateKey)
      });
    }

    return days;
  }, [year, month, entriesMap]);

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => changeMonth(-1)} className={styles.navBtn}>
          <ChevronLeft size={20} />
        </button>
        <h2 className={styles.title}>{monthName}</h2>
        <button onClick={() => changeMonth(1)} className={styles.navBtn}>
          <ChevronRight size={20} />
        </button>
      </header>

      <div className={styles.weekdayGrid}>
        {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map(d => (
          <div key={d} className={styles.weekday}>{d}</div>
        ))}
      </div>

      <div className={styles.grid}>
        {calendarDays.map((day) => (
          <div
            key={day.key || day.dateKey}
            className={`${styles.cell} ${day.type === 'padding' ? styles.padding : ''}`}
            style={day.intensity !== undefined ? {
              '--bg': getIntensityConfig(day.intensity).bg,
              '--color': getIntensityConfig(day.intensity).color,
              '--border': getIntensityConfig(day.intensity).border,
            } as React.CSSProperties : {}}
          >
            {day.type === 'day' && (
              <>
                <span className={styles.dayNumber}>{day.day}</span>
                {day.intensity !== undefined && (
                  <div className={styles.indicator} />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <footer className={styles.legend}>
        <p>Intensidad:</p>
        <div className={styles.legendItems}>
          {[0, 1, 2, 3, 4].map(level => (
            <div key={level} className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: getIntensityConfig(level).color }}
              />
              <span>{level}</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
