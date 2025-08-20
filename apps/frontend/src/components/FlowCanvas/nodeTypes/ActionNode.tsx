import React from 'react';
import { NodeData } from "../../../types";
import { Handle, Position } from "reactflow";
import { BaseNodeCard } from "./BaseNodeCard";

export const ActionNode: React.FC<{ data: NodeData }> = ({ data }) => (
  <div>
    <Handle type="target" position={Position.Top} />
    <BaseNodeCard title="Action" subtitle={data.label} issues={data.issues}>
      <div className="truncate">{data.config?.actionKey ?? "<no action>"}</div>
    </BaseNodeCard>
    <Handle type="source" position={Position.Bottom} />
  </div>
);