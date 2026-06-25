'use client';

import { useEffect, useRef } from 'react';
import type { Notification as NotificationType } from '@/context/NotificationContext';

interface NotificationProps extends NotificationType {
  onClose: () => void;
}

const typeStyles = {
  success: {
    bg: 'bg-[#a8d5a8]',
    border: 'border-[#8fa18d]',
    icon: '✓',
    textColor: 'text-[#2d5f2d]',
  },
  error: {
    bg: 'bg-[#f8d7da]',
    border: 'border-[#d17d6f]',
    icon: '✕',
    textColor: 'text-[#7d3c36]',
  },
  warning: {
    bg: 'bg-[#fff3cd]',
    border: 'border-[#d4a574]',
    icon: '⚠',
    textColor: 'text-[#664d33]',
  },
  info: {
    bg: 'bg-[#d1ecf1]',
    border: 'border-[#8fa18d]',
    icon: 'ℹ',
    textColor: 'text-[#37413d]',
  },
};

export function Notification({
  id,
  message,
  type,
  duration,
  action,
  onClose,
}: NotificationProps) {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (duration && duration > 0 && progressRef.current) {
      const startTime = Date.now();
      let animationFrameId: number;

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);

        if (progressRef.current) {
          progressRef.current.style.width = `${100 - progress}%`;
        }

        if (progress < 100) {
          animationFrameId = requestAnimationFrame(updateProgress);
        }
      };

      animationFrameId = requestAnimationFrame(updateProgress);

      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [duration]);

  const styles = typeStyles[type];

  return (
    <div
      className={`
        animate-slide-in
        ${styles.bg} 
        ${styles.border}
        border 
        rounded-lg 
        p-4 
        mb-3 
        shadow-lg 
        flex 
        items-start 
        gap-3
        backdrop-blur-sm
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 font-bold text-lg ${styles.textColor}`}>
        {styles.icon}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2">
        <p className={`text-sm font-medium ${styles.textColor}`}>{message}</p>

        {/* Action button if provided */}
        {action && (
          <button
            onClick={() => {
              action.onClick();
              onClose();
            }}
            className={`
              text-xs 
              font-semibold 
              underline 
              hover:no-underline 
              transition-colors 
              self-start
              ${styles.textColor}
            `}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className={`
          flex-shrink-0 
          text-lg 
          font-bold 
          ${styles.textColor}
          hover:opacity-70 
          transition-opacity
        `}
        aria-label="Cerrar notificación"
      >
        ×
      </button>

      {/* Progress bar */}
      {duration && duration > 0 && (
        <div
          ref={progressRef}
          className={`
            absolute 
            bottom-0 
            left-0 
            right-0 
            h-1 
            ${styles.border} 
            border-t
          `}
          style={{ width: '100%' }}
        />
      )}
    </div>
  );
}
