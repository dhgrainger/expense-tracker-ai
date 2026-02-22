"use client";

import { useState, useEffect } from "react";
import { Expense, ExpenseFormData, CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from "@/types/expense";
import { todayString } from "@/utils/formatters";
import Modal from "./Modal";

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseFormData) => void;
  editingExpense?: Expense | null;
}

const defaultForm: ExpenseFormData = {
  date: todayString(),
  amount: "",
  category: "Food",
  description: "",
};

interface FormErrors {
  date?: string;
  amount?: string;
  description?: string;
}

export default function ExpenseForm({
  isOpen,
  onClose,
  onSubmit,
  editingExpense,
}: ExpenseFormProps) {
  const [form, setForm] = useState<ExpenseFormData>(defaultForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEditing = !!editingExpense;

  useEffect(() => {
    if (isOpen) {
      if (editingExpense) {
        setForm({
          date: editingExpense.date,
          amount: editingExpense.amount.toString(),
          category: editingExpense.category,
          description: editingExpense.description,
        });
      } else {
        setForm({ ...defaultForm, date: todayString() });
      }
      setErrors({});
    }
  }, [isOpen, editingExpense]);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!form.date) newErrors.date = "Date is required";
    if (!form.amount || isNaN(parseFloat(form.amount))) {
      newErrors.amount = "Enter a valid amount";
    } else if (parseFloat(form.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    } else if (parseFloat(form.amount) > 1_000_000) {
      newErrors.amount = "Amount seems too large";
    }
    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    } else if (form.description.trim().length < 2) {
      newErrors.description = "Description is too short";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    onClose();
  }

  function handleAmountChange(value: string) {
    // Allow only valid number input
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setForm((prev) => ({ ...prev, amount: value }));
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Expense" : "Add Expense"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Date & Amount row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              max={todayString()}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, date: e.target.value }))
              }
              className={`w-full px-3 py-2.5 text-sm rounded-xl border bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 ${
                errors.date
                  ? "border-red-300 bg-red-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            />
            {errors.date && (
              <p className="text-xs text-red-500 mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                $
              </span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className={`w-full pl-7 pr-3 py-2.5 text-sm rounded-xl border bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 ${
                  errors.amount
                    ? "border-red-300 bg-red-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => {
              const selected = form.category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, category: cat }))}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 ${
                    selected
                      ? "border-violet-500 bg-violet-50 text-violet-700 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-base leading-none">
                    {CATEGORY_ICONS[cat]}
                  </span>
                  <span className="truncate text-xs">{cat}</span>
                  {selected && (
                    <span
                      className="w-1.5 h-1.5 rounded-full ml-auto flex-shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            rows={2}
            placeholder="What was this expense for?"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            maxLength={200}
            className={`w-full px-3 py-2.5 text-sm rounded-xl border bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none ${
              errors.description
                ? "border-red-300 bg-red-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description ? (
              <p className="text-xs text-red-500">{errors.description}</p>
            ) : (
              <span />
            )}
            <p className="text-xs text-slate-400 ml-auto">
              {form.description.length}/200
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors shadow-sm"
          >
            {isEditing ? "Update Expense" : "Add Expense"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
