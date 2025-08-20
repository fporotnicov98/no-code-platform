import React from "react";
import { NodeData } from "../../../types";
import { Handle, Position } from "reactflow";
import { BaseNodeCard } from "./BaseNodeCard";

export const MessageNode: React.FC<{ data: NodeData }> = ({ data }) => (
  <div>
    <Handle type="target" position={Position.Top} />
    <BaseNodeCard title="Message" subtitle={data.label} issues={data.issues}>
      <div className="truncate">{data.config?.text ?? "<empty>"}</div>
    </BaseNodeCard>
    <Handle type="source" position={Position.Bottom} />
  </div>
);