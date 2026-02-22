"use client";

import { Search, X } from "lucide-react";
import { ExpenseFilters } from "@/types/expense";
import { CATEGORIES } from "@/types/expense";
import { todayString, getCurrentMonthStart, getCurrentMonthEnd } from "@/utils/formatters";

interface FilterBarProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
}

const QUICK_FILTERS = [
  { label: "All Time", start: "", end: "" },
  {
    label: "This Month",
    start: getCurrentMonthStart(),
    end: getCurrentMonthEnd(),
  },
  {
    label: "This Week",
    start: (() => {
      const d = new Date();
      d.setDate(d.getDate() - d.getDay());
      return d.toISOString().split("T")[0];
    })(),
    end: todayString(),
  },
  {
    label: "Last 30 Days",
    start: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      return d.toISOString().split("T")[0];
    })(),
    end: todayString(),
  },
];

export default function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const activeQuickFilter = QUICK_FILTERS.findIndex(
    (qf) => qf.start === filters.startDate && qf.end === filters.endDate
  );

  function clearFilters() {
    onFiltersChange({
      search: "",
      category: "All",
      startDate: "",
      endDate: "",
    });
  }

  const hasActiveFilters =
    filters.search || filters.category !== "All" || filters.startDate || filters.endDate;

  return (
    <div className="space-y-3">
      {/* Search + clear row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFiltersChange({ ...filters, search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2.5 text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Quick date filters */}
      <div className="flex gap-2 flex-wrap">
        {QUICK_FILTERS.map((qf, i) => (
          <button
            key={qf.label}
            onClick={() =>
              onFiltersChange({
                ...filters,
                startDate: qf.start,
                endDate: qf.end,
              })
            }
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              activeQuickFilter === i
                ? "bg-violet-600 border-violet-600 text-white"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {qf.label}
          </button>
        ))}
      </div>

      {/* Category + custom date row */}
      <div className="flex gap-2 flex-wrap">
        {/* Category filter */}
        <select
          value={filters.category}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              category: e.target.value as ExpenseFilters["category"],
            })
          }
          className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-colors cursor-pointer"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Custom date range */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.startDate}
            max={filters.endDate || todayString()}
            onChange={(e) =>
              onFiltersChange({ ...filters, startDate: e.target.value })
            }
            className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-colors"
          />
          <span className="text-slate-400 text-sm flex-shrink-0">to</span>
          <input
            type="date"
            value={filters.endDate}
            min={filters.startDate}
            max={todayString()}
            onChange={(e) =>
              onFiltersChange({ ...filters, endDate: e.target.value })
            }
            className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
