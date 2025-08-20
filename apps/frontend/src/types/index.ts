type NodeType = "message" | "condition" | "action" | "input" | "split";
type NodeConfig =
| { text: string }
| { equals?: string; includes?: string; regex?: string }
| { actionKey: string; payload?: unknown }
| { prompt?: string }
| { branches: number };

interface NodeData {
  label: string;
  type: NodeType;
  config: any;
  issues?: string[];
}

export type {
  NodeType,
  NodeConfig,
  NodeData
}