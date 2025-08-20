import { useState } from "react";
import { Sidebar } from "../Sidebar";
import { FlowCanvas } from "../FlowCanvas";

const AppShell = () => {
  const [dark, setDark] = useState(true);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex">
        <Sidebar dark={dark} setDark={setDark} />
        <div className="flex-1 flex flex-col">
          <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
            <div className="font-semibold">No‑Code Bot Platform — Flow Editor</div>
            <div className="text-xs text-slate-500">Demo</div>
          </div>
          <div className="flex-1">
            <FlowCanvas />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppShell;