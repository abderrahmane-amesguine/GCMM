import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

const TOAST_TYPES = {
  success: {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    className: 'bg-green-50 border-green-200 text-green-800',
  },
  error: {
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
    className: 'bg-red-50 border-red-200 text-red-800',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    className: 'bg-amber-50 border-amber-200 text-amber-800',
  },
  info: {
    icon: <Info className="w-5 h-5 text-blue-500" />,
    className: 'bg-blue-50 border-blue-200 text-blue-800',
  },
};

const Toast = ({ id, title, description, type = 'info', duration = 5000, onClose }) => {
  const { icon, className } = TOAST_TYPES[type] || TOAST_TYPES.info;
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      if (!isPaused) {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);

        if (remaining === 0) {
          setIsVisible(false);
          setTimeout(() => onClose(id), 300); // Wait for exit animation
        }
      }
    }, 10);

    return () => clearInterval(interval);
  }, [duration, id, isPaused, onClose]);

  return (
    <div 
      className={`group flex flex-col p-4 mb-3 rounded-lg border shadow-lg transition-all duration-300 ${className} ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
      role="alert"
      aria-live="polite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={() => setIsVisible(false)}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3 mt-0.5" aria-hidden="true">
          {icon}
        </div>
        <div className="flex-1 mr-2">
          {title && <h3 className="font-medium">{title}</h3>}
          {description && <p className="text-sm mt-1 opacity-90">{description}</p>}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }} 
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="h-1 mt-3 bg-gray-200 rounded overflow-hidden">
        <div 
          className="h-full bg-current opacity-25 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, description, type = 'info', duration = 5000 }) => {
    const id = Date.now().toString();
    const newToast = { id, title, description, type, duration };
    
    setToasts(prevToasts => [...prevToasts, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

// Toaster component that displays all toast notifications
export const Toaster = ({ position = 'bottom-right' }) => {
  const { removeToast } = useToast();
  const [mountedToasts, setMountedToasts] = useState([]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'fixed top-4 right-4';
      case 'top-left':
        return 'fixed top-4 left-4';
      case 'bottom-left':
        return 'fixed bottom-4 left-4';
      case 'bottom-right':
      default:
        return 'fixed bottom-4 right-4';
    }
  };

  return (
    <div className={`${getPositionClasses()} z-50 w-80 max-w-full pointer-events-none`}>
      <div className="pointer-events-auto">
        {mountedToasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Export a toast function that can be used outside of React components
export const toast = ({ title, description, type = 'info', duration = 5000 }) => {
  if (typeof window !== 'undefined' && window.toast) {
    return window.toast({ title, description, type, duration });
  }
  // Fallback for when the window.toast is not available
  console.log(`Toast: ${type} - ${title} - ${description}`);
};