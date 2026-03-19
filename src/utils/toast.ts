import { useToastStore } from '../store/toastStore';
import type { ToastType } from '../store/toastStore';

interface ToastOptions {
  duration?: number;
}

const showToast = (message: string, type: ToastType, options?: ToastOptions) => {
  useToastStore.getState().addToast({
    message,
    type,
    duration: options?.duration,
  });
};

export const toast = {
  success: (message: string, options?: ToastOptions) => showToast(message, 'success', options),
  error: (message: string, options?: ToastOptions) => showToast(message, 'error', options),
  warning: (message: string, options?: ToastOptions) => showToast(message, 'warning', options),
  info: (message: string, options?: ToastOptions) => showToast(message, 'info', options),
};
