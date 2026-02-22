"use client";

import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  expenseDescription: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  expenseDescription,
}: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Expense" maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <div>
          <p className="text-slate-700 font-medium">
            Are you sure you want to delete this expense?
          </p>
          <p className="text-sm text-slate-500 mt-1 italic">
            &ldquo;{expenseDescription}&rdquo;
          </p>
          <p className="text-sm text-slate-400 mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 w-full pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
