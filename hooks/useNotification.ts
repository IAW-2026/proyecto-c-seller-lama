'use client';

/*
Este es un hook helper.

Sirve para NO tener que escribir lógica compleja cada vez.
*/
import { useContext } from 'react';
import {
  NotificationContext,
  type NotificationType,
  type Notification,
} from '@/context/NotificationContext';

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotification debe usarse dentro de NotificationProvider'
    );
  }

  return {
    showSuccess: (message: string, duration?: number) =>
      context.addNotification(message, 'success', duration),
    showError: (message: string, duration?: number) =>
      context.addNotification(message, 'error', duration),
    showWarning: (message: string, duration?: number) =>
      context.addNotification(message, 'warning', duration),
    showInfo: (message: string, duration?: number) =>
      context.addNotification(message, 'info', duration),
    show: (message: string, type: NotificationType, duration?: number) =>
      context.addNotification(message, type, duration),
    showWithAction: (
      message: string,
      type: NotificationType,
      action: Notification['action'],
      duration?: number
    ) => context.addNotification(message, type, duration, action),
    remove: context.removeNotification,
    clear: context.clearNotifications,
  };
}
