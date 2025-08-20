import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { NodeData, NodeType } from "../../types";
import { genId } from "../../helpers";
import { ToolbarButton } from "../Toolbar/ToolbarButton";
import { nodeTypes } from "./nodeTypes";
import { validateGraph } from "./validateGraph";
import { PropertiesPanel } from "../PropertiesPanel";

const initialEdges: Edge[] = [
  { id: "e1", source: "n1", target: "n2" },
  { id: "e2", source: "n2", target: "n3", sourceHandle: "true", label: "equals" },
  { id: "e3", source: "n2", target: "n4", sourceHandle: "false", label: "otherwise" },
];

const initialNodes: Node<NodeData>[] = [
  {
    id: "n1",
    type: "input",
    position: { x: 150, y: 40 },
    data: { label: "Start", type: "input", config: { prompt: "Say something" } },
  },
  {
    id: "n2",
    type: "condition",
    position: { x: 120, y: 200 },
    data: { label: "Is 'привет'?", type: "condition", config: { equals: "привет" } },
  },
  {
    id: "n3",
    type: "message",
    position: { x: 20, y: 380 },
    data: { label: "Greet back", type: "message", config: { text: "Привет! Чем помочь?" } },
  },
  {
    id: "n4",
    type: "action",
    position: { x: 260, y: 380 },
    data: { label: "Create selection", type: "action", config: { actionKey: "searchApartments", payload: { rooms: 2 } } },
  },
];

type GraphIssue = { nodeId: string; message: string };

export const FlowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [issues, setIssues] = useState<GraphIssue[]>([]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, id: genId() }, eds));
  }, [setEdges]);

  const onSelectionChange = useCallback(({ nodes: selNodes }: { nodes: Node[]; edges: Edge[] }) => {
    setSelectedId(selNodes?.[0]?.id ?? null);
  }, []);

  useEffect(() => {
    const allIssues = validateGraph(nodes, edges);
    setIssues(allIssues);

    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        data: { ...n.data, issues: allIssues.filter((i) => i.nodeId === n.id).map((i) => i.message) },
      }))
    );
  }, [nodes.map(n=>({id:n.id,type:n.type,data:n.data,position:n.position})), edges.map(e=>({id:e.id,source:e.source,target:e.target,sourceHandle:e.sourceHandle,targetHandle:e.targetHandle}))]);

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedId) ?? null, [nodes, selectedId]);

  const updateNodeConfig = (id: string, patch: Partial<NodeData["config"]>) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, data: { ...n.data, config: { ...n.data.config, ...patch } } } : n))
    );
  };

  const addNode = (type: NodeType) => {
    const id = genId();
    const base: Partial<Node<NodeData>> = {
      id,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 200 + 80 },
      data: { label: `${type}-${id}`, type, config: type === "message" ? { text: "" } : type === "action" ? { actionKey: "" } : type === "split" ? { branches: 2 } : {} },
      type,
    };
    setNodes((prev) => [...prev, base as Node<NodeData>]);
  };

  return (
    <div className="grid grid-cols-12 gap-0 h-full">
      <div className="col-span-8 border-r border-slate-200 dark:border-slate-800">
        <div className="p-2 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
          <ToolbarButton onClick={() => addNode("message")}>+ Message</ToolbarButton>
          <ToolbarButton onClick={() => addNode("condition")}>+ Condition</ToolbarButton>
          <ToolbarButton onClick={() => addNode("action")}>+ Action</ToolbarButton>
          <ToolbarButton onClick={() => addNode("input")}>+ Input</ToolbarButton>
          <ToolbarButton onClick={() => addNode("split")}>+ Split</ToolbarButton>
          <div className="ml-auto text-xs text-slate-500 dark:text-slate-400">
            {issues.length ? (
              <span className="text-red-500 font-medium">{issues.length} issue(s) found</span>
            ) : (
              <span className="text-green-600 font-medium">No issues</span>
            )}
          </div>
        </div>
        <div className="h-[calc(100%-42px)]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            onSelectionChange={onSelectionChange}
          >
            <MiniMap pannable zoomable className="!bg-white/60 dark:!bg-slate-800/60" />
            <Controls />
            <Background gap={16} />
          </ReactFlow>
        </div>
      </div>
      <div className="col-span-4">
        <div className="border-b border-slate-200 dark:border-slate-800 p-2 text-sm font-semibold">Properties</div>
        <PropertiesPanel selectedNode={selectedNode} onUpdate={updateNodeConfig} />
      </div>
    </div>
  );
}