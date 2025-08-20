import React from 'react';
import { NodeData } from "../../../types";
import { Handle, Position } from "reactflow";
import { BaseNodeCard } from "./BaseNodeCard";

export const InputNode: React.FC<{ data: NodeData }> = ({ data }) => (
  <div>
    <BaseNodeCard title="Input (Start)" subtitle={data.label} issues={data.issues}>
      <div className="truncate">{data.config?.prompt ?? "awaiting user text"}</div>
    </BaseNodeCard>
    <Handle type="source" position={Position.Bottom} />
  </div>
);
