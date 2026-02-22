"use client";

import { useState, useMemo } from "react";
import { Expense, ExpenseFilters } from "@/types/expense";
import { formatDate } from "@/utils/formatters";
import ExpenseItem from "./ExpenseItem";
import FilterBar from "./FilterBar";
import EmptyState from "./EmptyState";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  defaultFilters?: Partial<ExpenseFilters>;
}

const PAGE_SIZE = 15;

const defaultFiltersObj: ExpenseFilters = {
  search: "",
  category: "All",
  startDate: "",
  endDate: "",
};

export default function ExpenseList({
  expenses,
  onEdit,
  onDelete,
  onAddNew,
  defaultFilters,
}: ExpenseListProps) {
  const [filters, setFilters] = useState<ExpenseFilters>({
    ...defaultFiltersObj,
    ...defaultFilters,
  });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...expenses];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }
    if (filters.category !== "All") {
      result = result.filter((e) => e.category === filters.category);
    }
    if (filters.startDate) {
      result = result.filter((e) => e.date >= filters.startDate);
    }
    if (filters.endDate) {
      result = result.filter((e) => e.date <= filters.endDate);
    }

    // Sort by date descending
    result.sort((a, b) => b.date.localeCompare(a.date));
    return result;
  }, [expenses, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleFiltersChange(newFilters: ExpenseFilters) {
    setFilters(newFilters);
    setPage(1);
  }

  // Group by date
  const grouped = useMemo(() => {
    const groups: { date: string; items: Expense[] }[] = [];
    paginated.forEach((expense) => {
      const last = groups[groups.length - 1];
      if (last && last.date === expense.date) {
        last.items.push(expense);
      } else {
        groups.push({ date: expense.date, items: [expense] });
      }
    });
    return groups;
  }, [paginated]);

  const totalAmount = filtered.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-4">
      <FilterBar filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Results summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {filtered.length === 0 ? (
            "No expenses found"
          ) : (
            <>
              <span className="font-semibold text-slate-700">
                {filtered.length}
              </span>{" "}
              expense{filtered.length !== 1 ? "s" : ""}
              {filtered.length > 0 && (
                <>
                  {" "}
                  &middot;{" "}
                  <span className="font-semibold text-slate-700">
                    ${totalAmount.toFixed(2)}
                  </span>{" "}
                  total
                </>
              )}
            </>
          )}
        </p>
        {totalPages > 1 && (
          <p className="text-xs text-slate-400">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100">
          <EmptyState
            title="No expenses found"
            description="Try adjusting your filters or add a new expense."
            actionLabel="Add Expense"
            onAction={onAddNew}
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {grouped.map(({ date, items }) => (
            <div key={date}>
              {/* Date header */}
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {formatDate(date)}
                </p>
              </div>
              {/* Expenses for this date */}
              {items.map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === totalPages ||
                Math.abs(p - currentPage) <= 1
            )
            .reduce<(number | "...")[]>((acc, p, i, arr) => {
              if (i > 0 && (p as number) - (arr[i - 1] as number) > 1)
                acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="text-slate-400 text-sm px-1">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    currentPage === p
                      ? "bg-violet-600 text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
