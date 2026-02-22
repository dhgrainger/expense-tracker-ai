"use client";

import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { Toast as ToastType, ToastType as ToastTypeEnum } from "@/hooks/useToast";

interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

const icons: Record<ToastTypeEnum, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
  error: <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
  info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />,
};

const styles: Record<ToastTypeEnum, string> = {
  success: "border-emerald-200 bg-white",
  error: "border-red-200 bg-white",
  info: "border-blue-200 bg-white",
};

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-in-right pointer-events-auto ${styles[toast.type]}`}
        >
          {icons[toast.type]}
          <p className="text-sm font-medium text-slate-800 flex-1">{toast.message}</p>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors ml-1 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
