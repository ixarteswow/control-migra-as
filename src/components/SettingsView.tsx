import { db, exportBackup, importBackup } from '../db';
import styles from './SettingsView.module.css';

interface Props {
  onExportPDF: () => void;
  isExporting: boolean;
}

export function SettingsView({ onExportPDF, isExporting }: Props) {
  const handleBackup = async () => {
    try {
      await exportBackup();
    } catch (error) {
      alert('Error al exportar backup: ' + (error as Error).message);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('Esto fusionará los datos del backup con los actuales. ¿Continuar?')) return;

    try {
      const result = await importBackup(file);
      alert(`Importación completada: ${result.imported} registros nuevos, ${result.skipped} saltados/duplicados.`);
    } catch (error) {
      alert('Error al importar backup: ' + (error as Error).message);
    }
    e.target.value = '';
  };

  const clearData = async () => {
    if (!confirm('¿ESTÁS SEGURO? Esto borrará TODOS tus datos de forma permanente.')) return;
    await db.entries.clear();
    alert('Datos borrados correctamente.');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Ajustes y Datos</h2>

      <section className={styles.section}>
        <h3>Exportar para médico</h3>
        <p className={styles.description}>
          Genera un informe PDF con el historial del mes actual para compartir con tu especialista.
        </p>
        <button
          onClick={onExportPDF}
          className={styles.pdfBtn}
          disabled={isExporting}
        >
          {isExporting ? '⏳ Generando PDF...' : '📄 Generar Informe PDF'}
        </button>
      </section>

      <section className={styles.section}>
        <h3>Copia de seguridad (Día 1)</h3>
        <p className={styles.description}>
          Tus datos se guardan solo en este dispositivo. Usa estas opciones para moverlos a otro móvil.
        </p>
        <div className={styles.buttonGroup}>
          <button onClick={handleBackup} className={styles.actionBtn}>
            📥 Exportar JSON
          </button>
          <label className={styles.actionBtn}>
            📤 Importar JSON
            <input type="file" accept=".json" onChange={handleImport} className="sr-only" />
          </label>
        </div>
      </section>

      <section className={`${styles.section} ${styles.dangerZone}`}>
        <h3 className={styles.dangerTitle}>Zona de Peligro</h3>
        <button onClick={clearData} className={styles.deleteBtn}>
          🗑️ Borrar todos los datos
        </button>
      </section>

      <footer className={styles.footer}>
        <p>Migraine Tracker v1.0.0</p>
        <p>Tu privacidad es nuestra prioridad.</p>
      </footer>
    </div>
  );
}
