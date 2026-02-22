"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Expense, CATEGORY_COLORS, CATEGORY_ICONS } from "@/types/expense";
import { formatCurrency, formatDate } from "@/utils/formatters";
import DeleteModal from "./DeleteModal";

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  const [showDelete, setShowDelete] = useState(false);
  const categoryColor = CATEGORY_COLORS[expense.category];
  const categoryIcon = CATEGORY_ICONS[expense.category];

  return (
    <>
      <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 transition-colors group border-b border-slate-50 last:border-0">
        {/* Category icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
          style={{
            backgroundColor: categoryColor + "18",
          }}
        >
          {categoryIcon}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">
            {expense.description}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-xs font-medium px-1.5 py-0.5 rounded-md"
              style={{
                backgroundColor: categoryColor + "18",
                color: categoryColor,
              }}
            >
              {expense.category}
            </span>
            <span className="text-xs text-slate-400">
              {formatDate(expense.date)}
            </span>
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-900 tabular-nums">
            {formatCurrency(expense.amount)}
          </p>
          {/* Actions - visible on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(expense)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => onDelete(expense.id)}
        expenseDescription={expense.description}
      />
    </>
  );
}
