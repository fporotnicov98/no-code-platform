import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4000" });

export default function App() {
  const qc = useQueryClient();
  const flows = useQuery({
    queryKey: ["flows"],
    queryFn: async () => (await api.get("/flows")).data
  });

  const createFlow = useMutation({
    mutationFn: async () => (await api.post("/flows", { name: "Demo flow" })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["flows"] })
  });

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin: No-Code Dialog Flows</h1>
      <button onClick={() => createFlow.mutate()}>Create demo flow</button>
      <ul>
        {(flows?.data ?? []).map((f:any) => (
          <li key={f._id}>
            {f.name} (v{f.version})
          </li>
        ))}
      </ul>
      <p>Тут будет редактор блок-схем</p>
    </div>
  );
}
