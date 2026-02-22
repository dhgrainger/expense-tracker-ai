"use client";

import { useMemo } from "react";
import { Expense, CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from "@/types/expense";
import { formatCurrency, getCurrentMonthKey, getMonthKey } from "@/utils/formatters";

interface CategoryChartProps {
  expenses: Expense[];
}

export default function CategoryChart({ expenses }: CategoryChartProps) {
  const currentMonthKey = getCurrentMonthKey();

  const monthExpenses = useMemo(
    () => expenses.filter((e) => getMonthKey(e.date) === currentMonthKey),
    [expenses, currentMonthKey]
  );

  const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryData = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const catTotal = monthExpenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        category: cat,
        total: catTotal,
        percentage: total > 0 ? (catTotal / total) * 100 : 0,
        color: CATEGORY_COLORS[cat],
        icon: CATEGORY_ICONS[cat],
      };
    })
      .filter((d) => d.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [monthExpenses, total]);

  // SVG Donut chart
  const RADIUS = 60;
  const STROKE_WIDTH = 18;
  const CENTER = 75;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  let cumulativePercentage = 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 h-full">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Spending by Category
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">This month</p>
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <p className="text-sm text-slate-400">No expenses this month yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Donut Chart */}
          <div className="flex justify-center">
            <div className="relative">
              <svg
                width={CENTER * 2}
                height={CENTER * 2}
                viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}
              >
                {/* Background circle */}
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth={STROKE_WIDTH}
                />
                {/* Category segments */}
                {categoryData.map((d) => {
                  const segmentLength = (d.percentage / 100) * CIRCUMFERENCE;
                  const offset = (cumulativePercentage / 100) * CIRCUMFERENCE;
                  cumulativePercentage += d.percentage;
                  // Start from top (-90 degrees)
                  const rotate = -90 + (offset / CIRCUMFERENCE) * 360;

                  return (
                    <circle
                      key={d.category}
                      cx={CENTER}
                      cy={CENTER}
                      r={RADIUS}
                      fill="none"
                      stroke={d.color}
                      strokeWidth={STROKE_WIDTH}
                      strokeDasharray={`${segmentLength} ${CIRCUMFERENCE}`}
                      strokeDashoffset={0}
                      strokeLinecap="round"
                      transform={`rotate(${rotate} ${CENTER} ${CENTER})`}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xs text-slate-400 font-medium">Total</p>
                <p className="text-sm font-bold text-slate-900 tabular-nums">
                  {formatCurrency(total)}
                </p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2">
            {categoryData.slice(0, 6).map((d) => (
              <div key={d.category} className="flex items-center gap-2.5">
                <span className="text-sm leading-none flex-shrink-0">
                  {d.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-slate-700 truncate">
                      {d.category}
                    </span>
                    <span className="text-xs text-slate-500 tabular-nums flex-shrink-0 ml-2">
                      {formatCurrency(d.total)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${d.percentage}%`,
                        backgroundColor: d.color,
                      }}
                    />
                  </div>
                </div>
                <span
                  className="text-xs font-medium tabular-nums flex-shrink-0 w-8 text-right"
                  style={{ color: d.color }}
                >
                  {d.percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
