"use client";

import { useState, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  ReceiptText,
  Tag,
  Plus,
  Download,
} from "lucide-react";
import Link from "next/link";
import { useExpenses } from "@/hooks/useExpenses";
import { useToast } from "@/hooks/useToast";
import {
  formatCurrency,
  getCurrentMonthKey,
  getCurrentYearStart,
  getMonthKey,
  getLastNMonthKeys,
} from "@/utils/formatters";
import { CATEGORY_COLORS, CATEGORY_ICONS, Category } from "@/types/expense";
import { exportToCSV } from "@/utils/exportUtils";
import SummaryCard from "./SummaryCard";
import MonthlyChart from "./MonthlyChart";
import CategoryChart from "./CategoryChart";
import ExpenseItem from "./ExpenseItem";
import ExpenseForm from "./ExpenseForm";
import DeleteModal from "./DeleteModal";
import ToastContainer from "./Toast";
import { ExpenseFormData, Expense } from "@/types/expense";

export default function Dashboard() {
  const { expenses, isLoaded, addExpense, updateExpense, deleteExpense } =
    useExpenses();
  const { toasts, showToast, dismissToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  const currentMonthKey = getCurrentMonthKey();
  const prevMonthKey = getLastNMonthKeys(2)[0];
  const yearStart = getCurrentYearStart();

  const thisMonthTotal = useMemo(
    () =>
      expenses
        .filter((e) => getMonthKey(e.date) === currentMonthKey)
        .reduce((sum, e) => sum + e.amount, 0),
    [expenses, currentMonthKey]
  );

  const prevMonthTotal = useMemo(
    () =>
      expenses
        .filter((e) => getMonthKey(e.date) === prevMonthKey)
        .reduce((sum, e) => sum + e.amount, 0),
    [expenses, prevMonthKey]
  );

  const thisYearTotal = useMemo(
    () =>
      expenses
        .filter((e) => e.date >= yearStart)
        .reduce((sum, e) => sum + e.amount, 0),
    [expenses, yearStart]
  );

  const thisMonthCount = useMemo(
    () =>
      expenses.filter((e) => getMonthKey(e.date) === currentMonthKey).length,
    [expenses, currentMonthKey]
  );

  // Top category this month
  const topCategory = useMemo(() => {
    const byCategory: Record<string, number> = {};
    expenses
      .filter((e) => getMonthKey(e.date) === currentMonthKey)
      .forEach((e) => {
        byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount;
      });
    const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
    return sorted[0] ?? null;
  }, [expenses, currentMonthKey]);

  // Month-over-month trend
  const monthTrend = useMemo(() => {
    if (prevMonthTotal === 0) return undefined;
    const pct = ((thisMonthTotal - prevMonthTotal) / prevMonthTotal) * 100;
    return { value: pct, label: "vs last month" };
  }, [thisMonthTotal, prevMonthTotal]);

  // Recent 5 expenses
  const recentExpenses = useMemo(
    () =>
      [...expenses]
        .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5),
    [expenses]
  );

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
    exportToCSV(expenses);
    showToast("Expenses exported to CSV", "success");
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading your expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-16 lg:pt-0 pb-20 lg:pb-0">
        {/* Header */}
        <div className="sticky top-0 lg:top-0 z-30 bg-slate-50/80 backdrop-blur-md border-b border-slate-100 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-400 hidden sm:block">
                Your financial overview
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
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

        <div className="px-4 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="This Month"
              value={formatCurrency(thisMonthTotal)}
              subtitle={`${thisMonthCount} expense${thisMonthCount !== 1 ? "s" : ""}`}
              icon={DollarSign}
              iconBg="#ede9fe"
              iconColor="#7c3aed"
              trend={monthTrend}
            />
            <SummaryCard
              title="This Year"
              value={formatCurrency(thisYearTotal)}
              subtitle={new Date().getFullYear().toString()}
              icon={TrendingUp}
              iconBg="#ecfdf5"
              iconColor="#059669"
            />
            <SummaryCard
              title="Total Expenses"
              value={expenses.length.toString()}
              subtitle="All time"
              icon={ReceiptText}
              iconBg="#eff6ff"
              iconColor="#3b82f6"
            />
            <SummaryCard
              title="Top Category"
              value={topCategory ? topCategory[0] : "—"}
              subtitle={
                topCategory
                  ? `${formatCurrency(topCategory[1])} this month`
                  : "No expenses yet"
              }
              icon={Tag}
              iconBg={
                topCategory
                  ? CATEGORY_COLORS[topCategory[0] as Category] + "20"
                  : "#f9fafb"
              }
              iconColor={
                topCategory
                  ? CATEGORY_COLORS[topCategory[0] as Category]
                  : "#6b7280"
              }
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <MonthlyChart expenses={expenses} />
            </div>
            <div>
              <CategoryChart expenses={expenses} />
            </div>
          </div>

          {/* Recent Expenses */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Recent Expenses
              </h2>
              <Link
                href="/expenses"
                className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
              >
                View all →
              </Link>
            </div>

            {recentExpenses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                <p className="text-sm text-slate-400">
                  No expenses yet. Add your first one!
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                {recentExpenses.map((expense) => (
                  <ExpenseItem
                    key={expense.id}
                    expense={expense}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
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
