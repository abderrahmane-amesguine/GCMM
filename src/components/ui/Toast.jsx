import React, { createContext, useContext, useState } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

// Create a context for toast notifications
const ToastContext = createContext();

// Toast types with their respective icons and styles
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

// Toast component that displays a single notification
const Toast = ({ id, title, description, type = 'info', onClose }) => {
  const { icon, className } = TOAST_TYPES[type] || TOAST_TYPES.info;
  
  return (
    <div 
      className={`flex items-start p-4 mb-3 rounded-lg border shadow-lg animate-slideIn ${className}`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 mr-2">
        {title && <h3 className="font-medium">{title}</h3>}
        {description && <p className="text-sm mt-1 opacity-90">{description}</p>}
      </div>
      <button 
        onClick={() => onClose(id)} 
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast provider that manages the state of all toast notifications
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
    
    return id;
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

// Hook to use toast functionality
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toaster component that displays all toast notifications
export const Toaster = () => {
  const { removeToast } = useToast();
  const [toasts, setToasts] = useState([]);

  // This is a standalone component that can be used without a provider
  const toast = ({ title, description, type = 'info' }) => {
    const id = Date.now().toString();
    const newToast = { id, title, description, type };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 5000);
    
    return id;
  };

  // Expose the toast function
  window.toast = toast;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-w-full">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          type={toast.type}
          onClose={(id) => setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id))}
        />
      ))}
    </div>
  );
};

// Export a toast function that can be used outside of React components
export const toast = ({ title, description, type = 'info' }) => {
  if (typeof window !== 'undefined' && window.toast) {
    return window.toast({ title, description, type });
  }
  // Fallback for when the window.toast is not available
  console.log(`Toast: ${type} - ${title} - ${description}`);
};