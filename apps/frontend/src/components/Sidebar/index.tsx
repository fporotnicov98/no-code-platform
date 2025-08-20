import React from 'react';

export const Sidebar: React.FC<{ dark: boolean; setDark: (v: boolean) => void }>=({ dark, setDark }) => (
  <div className="h-full w-60 bg-white/70 dark:bg-slate-900/70 backdrop-blur border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col">
    <div className="text-lg font-bold">Admin</div>
    <div className="mt-6 space-y-2 text-sm">
      <div className="text-slate-700 dark:text-slate-300">Dashboard</div>
      <div className="text-slate-700 dark:text-slate-300">Flows</div>
      <div className="text-slate-700 dark:text-slate-300">Settings</div>
    </div>
    <div className="mt-auto">
      <div className="flex items-center justify-between text-sm">
        <span>Dark mode</span>
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only" checked={dark} onChange={(e)=>setDark(e.target.checked)} />
          <span className={`w-10 h-6 flex items-center bg-slate-300 dark:bg-slate-700 rounded-full p-1 duration-300 ${dark?"justify-end":"justify-start"}`}>
            <span className="w-4 h-4 bg-white dark:bg-slate-200 rounded-full" />
          </span>
        </label>
      </div>
    </div>
  </div>
);