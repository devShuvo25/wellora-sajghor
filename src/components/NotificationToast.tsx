import React from 'react';

interface NotificationToastProps {
  message: string | null;
  onDismiss: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounceIn">
      <div className="bg-[#2e3132] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#4f4445] flex items-center gap-3 max-w-md">
        <span className="material-symbols-outlined text-emerald-400 text-xl">
          check_circle
        </span>
        <span className="font-body-sm text-xs text-[#f0f1f2] flex-1">
          {message}
        </span>
        <button
          onClick={onDismiss}
          className="text-[#d9dadb] hover:text-white p-1"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
};
