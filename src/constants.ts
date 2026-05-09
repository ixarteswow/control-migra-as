import { type MigraineEntry } from './db';

/** Mapa de colores por nivel de intensidad - Originales (Semáforo) */
export const INTENSITY_CONFIG = [
  {
    level: 0,
    label: 'Sin dolor',
    emoji: '😊',
    color: 'var(--intensity-0)',
    bg: 'hsl(142, 71%, 45% / 0.15)',
    border: 'hsl(142, 71%, 45% / 0.4)',
  },
  {
    level: 1,
    label: 'Leve',
    emoji: '🙂',
    color: 'var(--intensity-1)',
    bg: 'hsl(60, 90%, 55% / 0.15)',
    border: 'hsl(60, 90%, 55% / 0.4)',
  },
  {
    level: 2,
    label: 'Moderado',
    emoji: '😐',
    color: 'var(--intensity-2)',
    bg: 'hsl(30, 95%, 55% / 0.15)',
    border: 'hsl(30, 95%, 55% / 0.4)',
  },
  {
    level: 3,
    label: 'Fuerte',
    emoji: '😣',
    color: 'var(--intensity-3)',
    bg: 'hsl(10, 85%, 55% / 0.15)',
    border: 'hsl(10, 85%, 55% / 0.4)',
  },
  {
    level: 4,
    label: 'Severo',
    emoji: '🤯',
    color: 'var(--intensity-4)',
    bg: 'hsl(350, 75%, 45% / 0.15)',
    border: 'hsl(350, 75%, 45% / 0.4)',
  },
] as const;

/** Devuelve la configuración de color para una intensidad dada */
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
  intensity: 0,
  aura: false,
  notes: '',
};
