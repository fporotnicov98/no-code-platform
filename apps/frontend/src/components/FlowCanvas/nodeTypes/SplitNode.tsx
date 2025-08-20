import React from 'react';
import { NodeData } from "../../../types";
import { Handle, Position } from "reactflow";
import { BaseNodeCard } from "./BaseNodeCard";

export const SplitNode: React.FC<{ data: NodeData }> = ({ data }) => {
  const branches = Math.max(2, Math.min(5, Number(data.config?.branches ?? 2)));
  const positions = Array.from({ length: branches }, (_, i) => 20 + i * (180 / (branches - 1)));
  return (
    <div>
      <Handle type="target" position={Position.Top} />
      <BaseNodeCard title="Split" subtitle={`${branches} branches`} issues={data.issues} />
      {positions.map((left, i) => (
        <Handle key={i} id={`b${i}`} type="source" position={Position.Bottom} style={{ left }} />
      ))}
    </div>
  );
};