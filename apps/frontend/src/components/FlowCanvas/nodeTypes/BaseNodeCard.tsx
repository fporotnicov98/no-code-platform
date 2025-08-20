import React from "react";

export const BaseNodeCard: React.FC<{
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  issues?: string[];
}> = ({ title, subtitle, children, issues }) => {
  return (
    <div
      className={
        "rounded-2xl p-3 shadow-lg bg-white dark:bg-slate-800 border " +
        (issues && issues.length ? "border-red-500" : "border-slate-200 dark:border-slate-700")
      }
      style={{ width: 220 }}
    >
      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</div>
      {subtitle && <div className="text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</div>}
      <div className="mt-2 text-[12px] text-slate-600 dark:text-slate-300">{children}</div>
    </div>
  );
};