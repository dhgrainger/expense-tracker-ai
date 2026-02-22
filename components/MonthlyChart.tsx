"use client";

import { useMemo } from "react";
import { Expense } from "@/types/expense";
import {
  getLastNMonthKeys,
  getMonthKey,
  formatMonthShort,
  formatCurrency,
} from "@/utils/formatters";

interface MonthlyChartProps {
  expenses: Expense[];
}

export default function MonthlyChart({ expenses }: MonthlyChartProps) {
  const months = getLastNMonthKeys(6);

  const data = useMemo(() => {
    return months.map((key) => {
      const total = expenses
        .filter((e) => getMonthKey(e.date) === key)
        .reduce((sum, e) => sum + e.amount, 0);
      return { key, label: formatMonthShort(key), total };
    });
  }, [expenses, months]);

  const maxTotal = Math.max(...data.map((d) => d.total), 1);

  const CHART_HEIGHT = 160;
  const CHART_WIDTH = 500;
  const BAR_WIDTH = 48;
  const BAR_GAP = 32;
  const totalWidth = data.length * (BAR_WIDTH + BAR_GAP) - BAR_GAP;
  const xStart = (CHART_WIDTH - totalWidth) / 2;

  const yTicks = 4;
  const tickStep = Math.ceil(maxTotal / yTicks / 50) * 50;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Monthly Spending
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Last 6 months</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-900">
            {formatCurrency(data[data.length - 1]?.total ?? 0)}
          </p>
          <p className="text-xs text-slate-400">This month</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT + 40}`}
          className="w-full"
          style={{ minWidth: "280px", height: "auto" }}
        >
          {/* Y-axis gridlines */}
          {Array.from({ length: yTicks + 1 }, (_, i) => {
            const value = i * tickStep;
            const y = CHART_HEIGHT - (value / (tickStep * yTicks)) * CHART_HEIGHT;
            if (y < 0) return null;
            return (
              <g key={i}>
                <line
                  x1={0}
                  y1={y}
                  x2={CHART_WIDTH}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth={1}
                />
                <text
                  x={0}
                  y={y - 4}
                  fontSize={9}
                  fill="#94a3b8"
                  textAnchor="start"
                >
                  {value >= 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value}`}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const x = xStart + i * (BAR_WIDTH + BAR_GAP);
            const barHeight = Math.max((d.total / maxTotal) * CHART_HEIGHT, d.total > 0 ? 3 : 0);
            const y = CHART_HEIGHT - barHeight;
            const isCurrentMonth = i === data.length - 1;

            return (
              <g key={d.key}>
                {/* Background bar */}
                <rect
                  x={x}
                  y={0}
                  width={BAR_WIDTH}
                  height={CHART_HEIGHT}
                  rx={8}
                  fill="#f8fafc"
                />
                {/* Value bar */}
                {d.total > 0 && (
                  <rect
                    x={x}
                    y={y}
                    width={BAR_WIDTH}
                    height={barHeight}
                    rx={8}
                    fill={isCurrentMonth ? "#7c3aed" : "#c4b5fd"}
                    className="transition-all duration-500"
                  />
                )}
                {/* Month label */}
                <text
                  x={x + BAR_WIDTH / 2}
                  y={CHART_HEIGHT + 18}
                  fontSize={11}
                  fill={isCurrentMonth ? "#7c3aed" : "#94a3b8"}
                  textAnchor="middle"
                  fontWeight={isCurrentMonth ? "600" : "400"}
                >
                  {d.label}
                </text>
                {/* Tooltip on hover - amount above bar */}
                {d.total > 0 && (
                  <text
                    x={x + BAR_WIDTH / 2}
                    y={y - 6}
                    fontSize={9}
                    fill={isCurrentMonth ? "#7c3aed" : "#6b7280"}
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    {d.total >= 1000
                      ? `$${(d.total / 1000).toFixed(1)}k`
                      : `$${d.total.toFixed(0)}`}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
