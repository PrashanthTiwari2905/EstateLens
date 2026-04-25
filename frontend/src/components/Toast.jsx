import React, { useEffect } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      text: 'text-green-800',
      icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-100',
      text: 'text-red-800',
      icon: <ExclamationCircleIcon className="w-5 h-5 text-red-500" />,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-800',
      icon: <InformationCircleIcon className="w-5 h-5 text-blue-500" />,
    }
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div className={`fixed top-5 right-5 z-[100] min-w-[300px] p-4 rounded-2xl shadow-2xl border ${currentStyle.bg} ${currentStyle.border} flex items-center justify-between gap-4 animate-slide-in-right transform transition-all`}>
      <div className="flex items-center gap-3">
        {currentStyle.icon}
        <p className={`text-sm font-bold ${currentStyle.text}`}>{message}</p>
      </div>
      <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full transition-colors">
        <XMarkIcon className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  );
};

export default Toast;
