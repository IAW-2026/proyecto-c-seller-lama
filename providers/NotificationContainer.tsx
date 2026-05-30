'use client';

/*
Toma todas las notificaciones del Context y las rendiriza. 
*/
import { useContext } from 'react';
import { NotificationContext } from '@/context/NotificationContext';
import { Notification } from '@/components/ui/Notification';

export function NotificationContainer() {
  const context = useContext(NotificationContext);

  if (!context) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full sm:max-w-lg">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(400px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(400px);
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>

      <div className="space-y-2">
        {context.notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => context.removeNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  );
}
