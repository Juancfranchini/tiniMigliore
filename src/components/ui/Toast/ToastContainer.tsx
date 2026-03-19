import React from 'react';
import { useToastStore } from '../../../store/toastStore';
import { Toast } from './Toast';
import styles from './Toast.module.css';

export const ToastContainer: React.FC = () => {
  const { toasts } = useToastStore();

  return (
    <div className={styles.container}>
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  );
};
