import { useRegisterSW } from 'virtual:pwa-register/react';
import styles from './ReloadPrompt.module.css';

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error: unknown) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className={styles.container}>
      <div className={styles.toast}>
        <div className={styles.message}>
          {offlineReady ? (
            <span>Aplicación lista para trabajar offline</span>
          ) : (
            <span>Nueva versión disponible. ¿Actualizar?</span>
          )}
        </div>
        <div className={styles.buttons}>
          {needRefresh && (
            <button className={styles.updateBtn} onClick={() => updateServiceWorker(true)}>
              Actualizar
            </button>
          )}
          <button className={styles.closeBtn} onClick={close}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
