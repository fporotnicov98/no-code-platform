import { Edge, Node } from "reactflow";
import { NodeData } from "../../types";
import { schemas } from "../../helpers";

type GraphIssue = { nodeId: string; message: string };

export const validateGraph = (nodes: Node<NodeData>[], edges: Edge[]): GraphIssue[] => {
  const issues: GraphIssue[] = [];
  const byId = new Map(nodes.map((n) => [n.id, n]));

  const inputs = nodes.filter((n) => n.type === "input");
  if (inputs.length === 0) issues.push({ nodeId: "_global", message: "Flow must contain an Input node" });
  if (inputs.length > 1) issues.push({ nodeId: "_global", message: "Only one Input node is allowed" });

  const incoming = new Map<string, Edge[]>();
  const outgoing = new Map<string, Edge[]>();
  for (const n of nodes) {
    incoming.set(n.id, []);
    outgoing.set(n.id, []);
  }
  for (const e of edges) {
    if (!byId.has(e.source) || !byId.has(e.target)) {
      issues.push({ nodeId: "_global", message: `Edge ${e.id} connects missing node(s)` });
      continue;
    }
    outgoing.get(e.source)!.push(e);
    incoming.get(e.target)!.push(e);
  }

  // 2. Node-type specific rules
  for (const n of nodes) {
    const inc = incoming.get(n.id)!.length;
    const out = outgoing.get(n.id)!.length;

    // no node except input should be completely isolated
    if (n.type !== "input" && inc === 0 && out === 0) issues.push({ nodeId: n.id, message: "Node is isolated" });

    if (n.type === "input") {
      if (out < 1) issues.push({ nodeId: n.id, message: "Input must have an outgoing edge" });
      if (inc > 0) issues.push({ nodeId: n.id, message: "Input should not have incoming edges" });
    }

    if (n.type === "condition") {
      if (out < 1) issues.push({ nodeId: n.id, message: "Condition should have at least one outgoing edge" });
      try {
        schemas.condition.parse(n.data.config);
      } catch (e: any) {
        issues.push({ nodeId: n.id, message: e.errors?.[0]?.message ?? "Condition config invalid" });
      }
    }

    if (n.type === "message") {
      try {
        schemas.message.parse(n.data.config);
      } catch (e: any) {
        issues.push({ nodeId: n.id, message: e.errors?.[0]?.message ?? "Message config invalid" });
      }
    }

    if (n.type === "action") {
      try {
        schemas.action.parse(n.data.config);
      } catch (e: any) {
        issues.push({ nodeId: n.id, message: e.errors?.[0]?.message ?? "Action config invalid" });
      }
    }

    if (n.type === "split") {
      try {
        const parsed = schemas.split.parse(n.data.config);
        if (out !== parsed.branches)
          issues.push({ nodeId: n.id, message: `Split expects ${parsed.branches} outgoing edges, got ${out}` });
      } catch (e: any) {
        issues.push({ nodeId: n.id, message: e.errors?.[0]?.message ?? "Split config invalid" });
      }
    }
  }

  if (inputs.length === 1) {
    const start = inputs[0].id;
    const visited = new Set<string>([start]);
    const queue = [start];
    while (queue.length) {
      const v = queue.shift()!;
      for (const e of outgoing.get(v)!) {
        if (!visited.has(e.target)) {
          visited.add(e.target);
          queue.push(e.target);
        }
      }
    }
    for (const n of nodes) if (!visited.has(n.id)) issues.push({ nodeId: n.id, message: "Unreachable from Input" });
  }

  return issues;
}