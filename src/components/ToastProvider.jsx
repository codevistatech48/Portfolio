/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState } from "react";
import { AlertCircle, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showError = useCallback((message) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => dismissToast(id), 5000);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ showError }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3" aria-live="assertive">
        {toasts.map((toast) => (
          <div key={toast.id} role="alert" className="pointer-events-auto flex items-start gap-3 rounded-lg border border-red-400/30 bg-[#20131a] p-4 text-sm text-red-100 shadow-xl">
            <AlertCircle className="mt-0.5 shrink-0 text-red-300" size={19} aria-hidden="true" />
            <p className="flex-1 leading-5">{toast.message}</p>
            <button type="button" onClick={() => dismissToast(toast.id)} className="-mr-1 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded text-red-100 transition hover:bg-white/10" aria-label="Dismiss error">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
