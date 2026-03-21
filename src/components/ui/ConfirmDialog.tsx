import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../utils/cn';
import styles from './ConfirmDialog.module.css';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
  isConfirming?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  isConfirming = false,
}: ConfirmDialogProps) {
  
  const iconMap = {
    warning: <AlertTriangle size={24} />,
    danger: <AlertCircle size={24} />,
    info: <Info size={24} />
  };

  const footer = (
    <div className={styles.footer}>
      <Button 
        variant="ghost" 
        onClick={onClose} 
        disabled={isConfirming}
      >
        {cancelText}
      </Button>
      <Button 
        variant="primary"
        onClick={onConfirm}
        disabled={isConfirming}
        className={cn(type === 'danger' && styles.dangerButton)}
      >
        {isConfirming ? 'Procesando...' : confirmText}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
    >
      <div className={styles.container}>
        <div className={cn(styles.iconWrapper, styles[`wrapper-${type}`])}>
          {iconMap[type]}
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.message}>{message}</div>
        </div>
      </div>
      {footer}
    </Modal>
  );
}
