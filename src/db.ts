import Dexie, { type Table } from 'dexie';
import { format } from 'date-fns';

// ============================================================
// MODELO DE DATOS (Blueprint §2)
// ============================================================

export interface MigraineEntry {
  /** Primary Key: Formato ISO estricto 'YYYY-MM-DD'. Garantiza 1 registro por día. */
  date: string;
  /** 0=Ninguno, 1=Leve, 2=Moderado, 3=Fuerte, 4=Severo */
  intensity: number;
  /** true si hubo aura (síntomas visuales previos) */
  aura: boolean;
  /** Notas opcionales del usuario */
  notes: string;
  /** Unix timestamp para ordenamiento secundario o futura resolución de conflictos */
  timestamp: number;
}

// ============================================================
// CLASE BASE DE DATOS (Blueprint §2)
// ============================================================

export class MigraineDB extends Dexie {
  entries!: Table<MigraineEntry>;

  constructor() {
    super('MigraineDB');
    // '&date' → Primary Key única. 'intensity' indexado para filtros futuros.
    this.version(1).stores({
      entries: '&date, intensity',
    });
  }
}

export const db = new MigraineDB();

// ============================================================
// UTILIDAD: Obtener fecha de HOY de forma segura (Blueprint §⚠️3)
// Usamos UTC para evitar que el timezone salte al día anterior/siguiente.
// ============================================================
export function getTodayKey(): string {
  const now = new Date();
  // Construimos la fecha con los métodos locales del usuario (no UTC)
  // para que "hoy" sea siempre lo que el usuario espera en su zona horaria.
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Convierte cualquier Date a clave 'YYYY-MM-DD' local segura */
export function dateToKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ============================================================
// CRUD OPERATIONS
// ============================================================

/** Obtiene el registro de un día específico (o undefined si no existe) */
export async function getEntry(dateKey: string): Promise<MigraineEntry | undefined> {
  return db.entries.get(dateKey);
}

/**
 * Guarda o actualiza el registro de un día (Upsert).
 * Al usar 'put' con la fecha como PK, si ya existe, actualiza; si no, inserta.
 */
export async function saveEntry(
  dateKey: string,
  intensity: number,
  aura: boolean,
  notes: string
): Promise<void> {
  const entry: MigraineEntry = {
    date: dateKey,
    intensity,
    aura,
    notes,
    timestamp: Date.now(),
  };
  await db.entries.put(entry);
}

/** Obtiene todos los registros de un mes dado (YYYY-MM) */
export async function getMonthEntries(year: number, month: number): Promise<MigraineEntry[]> {
  const monthStr = String(month).padStart(2, '0');
  const start = `${year}-${monthStr}-01`;
  const end = `${year}-${monthStr}-31`; // Dexie acepta fechas inexistentes en between()
  return db.entries.where('date').between(start, end, true, true).toArray();
}

/** Elimina el registro de un día (por si el usuario quiere borrar una entrada) */
export async function deleteEntry(dateKey: string): Promise<void> {
  await db.entries.delete(dateKey);
}

// ============================================================
// BACKUP & RESTORE (Blueprint §⚠️1 - MVP desde el Día 1)
// Previene pérdida de datos por cambio de móvil o borrado de caché iOS
// ============================================================

/** Exporta TODA la base de datos como un fichero JSON descargable */
export async function exportBackup(): Promise<void> {
  const allEntries = await db.entries.orderBy('date').toArray();
  const backup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    entries: allEntries,
  };
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const filename = `migraine-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;

  // Descarga usando la API HTML5
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Importa un backup JSON y lo fusiona con los datos existentes (no borra nada) */
export async function importBackup(file: File): Promise<{ imported: number; skipped: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (!json.entries || !Array.isArray(json.entries)) {
          throw new Error('El fichero no tiene el formato correcto.');
        }
        let imported = 0;
        let skipped = 0;
        for (const entry of json.entries) {
          // Validación mínima de la entrada
          if (!entry.date || typeof entry.intensity !== 'number') {
            skipped++;
            continue;
          }
          const existing = await db.entries.get(entry.date);
          if (!existing) {
            await db.entries.put(entry);
            imported++;
          } else {
            skipped++; // No sobreescribimos datos más recientes
          }
        }
        resolve({ imported, skipped });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el fichero.'));
    reader.readAsText(file);
  });
}
