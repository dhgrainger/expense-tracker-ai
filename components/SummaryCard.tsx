"use client";

import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  trend?: {
    value: number; // percentage change
    label: string;
  };
}

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
}: SummaryCardProps) {
  const TrendIcon =
    trend?.value === 0 ? Minus : trend?.value && trend.value > 0 ? TrendingUp : TrendingDown;
  const trendColor =
    trend?.value === 0
      ? "text-slate-500"
      : trend?.value && trend.value > 0
      ? "text-red-500"
      : "text-emerald-500";

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 truncate">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 truncate">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendColor}`}>
              <TrendIcon className="w-3 h-3" />
              <span>
                {Math.abs(trend.value).toFixed(0)}% {trend.label}
              </span>
            </div>
          )}
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );
}
