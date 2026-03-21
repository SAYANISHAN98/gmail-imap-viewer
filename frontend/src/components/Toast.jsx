import React, { useEffect, useState } from 'react';
import { CheckCircle, X, Info, AlertCircle } from 'lucide-react';

const icons = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
  error: <AlertCircle className="h-5 w-5 text-red-500" />,
};

function Toast({ message, type = 'success', duration = 5000, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    // Trigger slide-in on next tick
    const showTimer = setTimeout(() => setVisible(true), 10);
    // Start slide-out just before removing
    const hideTimer = setTimeout(() => setVisible(false), duration - 400);
    // Remove toast after slide-out completes
    const closeTimer = setTimeout(() => onClose(), duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgColors = {
    success: 'bg-white border-green-400',
    info: 'bg-white border-blue-400',
    error: 'bg-white border-red-400',
  };

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border-l-4 ${bgColors[type]} transition-all duration-400 ease-in-out`}
      style={{
        transform: visible ? 'translateX(0)' : 'translateX(-120%)',
        opacity: visible ? 1 : 0,
        minWidth: '280px',
        maxWidth: '380px',
      }}
    >
      {icons[type]}
      <span className="text-sm font-medium text-gray-800 flex-1">{message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 400); }}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default Toast;
