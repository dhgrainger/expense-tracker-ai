"use client";

import { useState } from "react";
import { Plus, Download } from "lucide-react";
import { useExpenses } from "@/hooks/useExpenses";
import { useToast } from "@/hooks/useToast";
import { exportToCSV } from "@/utils/exportUtils";
import { Expense, ExpenseFormData } from "@/types/expense";
import ExpenseList from "./ExpenseList";
import ExpenseForm from "./ExpenseForm";
import ToastContainer from "./Toast";

export default function ExpensesPage() {
  const { expenses, isLoaded, addExpense, updateExpense, deleteExpense } =
    useExpenses();
  const { toasts, showToast, dismissToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  function handleFormSubmit(data: ExpenseFormData) {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
      showToast("Expense updated successfully", "success");
    } else {
      addExpense(data);
      showToast("Expense added successfully", "success");
    }
    setEditingExpense(null);
  }

  function handleEdit(expense: Expense) {
    setEditingExpense(expense);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    deleteExpense(id);
    showToast("Expense deleted", "info");
  }

  function handleExport() {
    if (expenses.length === 0) {
      showToast("No expenses to export", "error");
      return;
    }
    exportToCSV(expenses);
    showToast(`Exported ${expenses.length} expenses to CSV`, "success");
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-16 lg:pt-0 pb-20 lg:pb-0">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-md border-b border-slate-100 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Expenses</h1>
              <p className="text-sm text-slate-400 hidden sm:block">
                {expenses.length} total expense{expenses.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button
                onClick={() => {
                  setEditingExpense(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Expense</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 lg:px-8 py-6 max-w-4xl mx-auto">
          <ExpenseList
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddNew={() => {
              setEditingExpense(null);
              setShowForm(true);
            }}
          />
        </div>
      </div>

      {/* Form Modal */}
      <ExpenseForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingExpense(null);
        }}
        onSubmit={handleFormSubmit}
        editingExpense={editingExpense}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
