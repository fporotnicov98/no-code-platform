import React from 'react';
import { NodeData } from "../../../types";
import { Handle, Position } from "reactflow";
import { BaseNodeCard } from "./BaseNodeCard";

export const ConditionNode: React.FC<{ data: NodeData }> = ({ data }) => (
  <div>
    <Handle type="target" position={Position.Top} />
    <BaseNodeCard title="Condition" subtitle={data.label} issues={data.issues}>
      <div className="space-y-1">
        {data.config?.equals && <div>equals: "{data.config.equals}"</div>}
        {data.config?.includes && <div>includes: "{data.config.includes}"</div>}
        {data.config?.regex && <div>regex: {String(data.config.regex)}</div>}
        {!data.config?.equals && !data.config?.includes && !data.config?.regex && <div>—</div>}
      </div>
    </BaseNodeCard>
    <Handle id="true" type="source" position={Position.Bottom} style={{ left: 60 }} />
    <Handle id="false" type="source" position={Position.Bottom} style={{ left: 160 }} />
  </div>
);