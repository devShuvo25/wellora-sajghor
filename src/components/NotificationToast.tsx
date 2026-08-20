import React from 'react';

interface NotificationToastProps {
  message: string | null;
  onDismiss: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounceIn">
      <div className="bg-wellora-inverse-surface text-wellora-on-primary px-4 py-3 rounded-xl shadow-2xl border border-wellora-on-surface-variant flex items-center gap-3 max-w-md">
        <span className="material-symbols-outlined text-emerald-400 text-xl">
          check_circle
        </span>
        <span className="font-body-sm text-xs text-wellora-inverse-on-surface flex-1">
          {message}
        </span>
        <button
          onClick={onDismiss}
          className="text-wellora-surface-dim hover:text-wellora-on-primary p-1"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
};
