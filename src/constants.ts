import { type MigraineEntry } from './db';

/** Mapa de colores por nivel de intensidad - Originales (Semáforo) */
export const INTENSITY_CONFIG = [
  {
    level: 0,
    label: 'Sin dolor',
    emoji: '😊',
    color: 'white',
    bg: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
  },
  {
    level: 1,
    label: 'Leve',
    emoji: '🙁',
    color: 'hsl(142, 70%, 45%)',
    bg: 'hsl(142, 70%, 45% / 0.15)',
    border: 'hsl(142, 70%, 45% / 0.4)',
  },
  {
    level: 2,
    label: 'Moderado',
    emoji: '😓',
    color: 'hsl(60, 90%, 50%)',
    bg: 'hsl(60, 90%, 50% / 0.15)',
    border: 'hsl(60, 90%, 50% / 0.4)',
  },
  {
    level: 3,
    label: 'Fuerte',
    emoji: '😩',
    color: 'hsl(30, 90%, 50%)',
    bg: 'hsl(30, 90%, 50% / 0.15)',
    border: 'hsl(30, 90%, 50% / 0.4)',
  },
  {
    level: 4,
    label: 'Muy Fuerte',
    emoji: '🤯',
    color: 'hsl(10, 90%, 50%)',
    bg: 'hsl(10, 90%, 50% / 0.15)',
    border: 'hsl(10, 90%, 50% / 0.4)',
  },
] as const;

/** Devuelve la configuración de color para una intensidad dada (Escala 0-4) */
export function getIntensityConfig(level: number) {
  return INTENSITY_CONFIG[Math.max(0, Math.min(4, level))];
}

/** Tipo de vista disponible en la app */
export type AppView = 'daily' | 'calendar' | 'settings';

/** Formatea una fecha 'YYYY-MM-DD' para mostrarla al usuario */
export function formatDisplayDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Estado inicial vacío de una entrada */
export const EMPTY_ENTRY: Omit<MigraineEntry, 'date' | 'timestamp'> = {
  intensity: 1,
  aura: false,
  notes: '',
};
