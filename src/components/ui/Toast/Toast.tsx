import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToastStore } from '../../../store/toastStore';
import type { ToastMessage } from '../../../store/toastStore';
import { cn } from '../../../utils/cn';
import styles from './Toast.module.css';

interface ToastProps {
  toast: ToastMessage;
}

const iconMap = {
  success: <CheckCircle className={styles.icon} size={20} />,
  error: <AlertCircle className={styles.icon} size={20} />,
  warning: <AlertTriangle className={styles.icon} size={20} />,
  info: <Info className={styles.icon} size={20} />,
};

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToastStore();
  const [isClosing, setIsClosing] = useState(false);

  // Allow time for exit animation before unmounting from DOM if we wanted, 
  // but Zustand handles removal completely. Standard simplest approach is immediate unmount or CSS animations.
  useEffect(() => {
    // Si queremos hacer un efecto de salida asincrono, interceptariamos el timeout de Zustand.
    // Por ahora, usaremos animaciones CSS simples al entrar (slideIn).
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => removeToast(toast.id), 200); // Wait for exit animation
  };

  return (
    <div 
      className={cn(
        styles.toastWrapper, 
        styles[toast.type],
        isClosing ? styles.closing : ''
      )}
      role="alert"
    >
      <div className={styles.iconContainer}>
        {iconMap[toast.type]}
      </div>
      
      <div className={styles.message}>
        {toast.message}
      </div>
      
      <button 
        onClick={handleClose} 
        className={styles.closeButton}
        aria-label="Cerrar notificación"
      >
        <X size={16} />
      </button>
    </div>
  );
};
