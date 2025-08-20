import React from 'react';
import { NodeData, NodeType } from "../../types";
import { Node } from "reactflow";
import { useFormik } from 'formik';
import { schemas } from '../../helpers';

const FieldLabel: React.FC<{ children: React.ReactNode }>=({ children }) => (
  <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">{children}</div>
);

const InputText: React.FC<{
  name: string;
  value: string | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ name, value, onChange, placeholder }) => (
  <input
    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
    name={name}
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
  />
);

const NumberInput: React.FC<{
  name: string;
  value: number | undefined;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}> = ({ name, value, onChange, min, max }) => (
  <input
    type="number"
    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
    name={name}
    value={value ?? 0}
    min={min}
    max={max}
    onChange={(e) => onChange(Number(e.target.value))}
  />
);

const TextArea: React.FC<{
  name: string;
  value: string | undefined;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}> = ({ name, value, onChange, rows = 4, placeholder }) => (
  <textarea
    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
    name={name}
    value={value ?? ""}
    rows={rows}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
  />
);

export const PropertiesPanel: React.FC<{
  selectedNode: Node<NodeData> | null;
  onUpdate: (nodeId: string, patch: Partial<NodeData["config"]>) => void;
}> = ({ selectedNode, onUpdate }) => {
  if (!selectedNode) return (
    <div className="p-4 text-sm text-slate-500 dark:text-slate-400">Select a node to edit its properties.</div>
  );

  const type = selectedNode.type as NodeType;
  const initialValues = selectedNode.data?.config ?? {};
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validate: (vals) => {
      try {
        schemas[type].parse(vals);
        return {} as any;
      } catch (e: any) {
        const errors: Record<string, string> = {};
        const zerrs = e.errors ?? [];
        if (Array.isArray(zerrs)) {
          for (const err of zerrs) {
            const path = err.path?.[0] ?? "_";
            errors[path] = err.message;
          }
        }
        return errors as any;
      }
    },
    onSubmit: (vals) => {
      // Special: action.payload may be edited as JSON string
      if (type === "action" && typeof (vals as any).payload === "string") {
        try {
          (vals as any).payload = JSON.parse((vals as any).payload);
        } catch {
          // keep as string if invalid JSON, validation will yell later
        }
      }
      onUpdate(selectedNode.id, vals);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="p-4 space-y-3">
      <div className="text-xs uppercase tracking-wide text-slate-400">{type} config</div>

      {type === "message" && (
        <div>
          <FieldLabel>Text</FieldLabel>
          <TextArea name="text" value={formik.values.text} onChange={(v) => formik.setFieldValue("text", v)} rows={5} />
          {formik.errors.text && <div className="text-xs text-red-500 mt-1">{String(formik.errors.text)}</div>}
        </div>
      )}

      {type === "condition" && (
        <>
          <div>
            <FieldLabel>equals</FieldLabel>
            <InputText name="equals" value={formik.values.equals} onChange={(v) => formik.setFieldValue("equals", v)} />
          </div>
          <div>
            <FieldLabel>includes</FieldLabel>
            <InputText name="includes" value={formik.values.includes} onChange={(v) => formik.setFieldValue("includes", v)} />
          </div>
          <div>
            <FieldLabel>regex</FieldLabel>
            <InputText name="regex" value={formik.values.regex} onChange={(v) => formik.setFieldValue("regex", v)} placeholder="e.g. ^hi|hello$" />
          </div>
          {formik.errors._ && <div className="text-xs text-red-500 mt-1">{String(formik.errors._)}</div>}
        </>
      )}

      {type === "action" && (
        <>
          <div>
            <FieldLabel>actionKey</FieldLabel>
            <InputText name="actionKey" value={formik.values.actionKey} onChange={(v) => formik.setFieldValue("actionKey", v)} />
            {formik.errors.actionKey && (
              <div className="text-xs text-red-500 mt-1">{String(formik.errors.actionKey)}</div>
            )}
          </div>
          <div>
            <FieldLabel>payload (JSON)</FieldLabel>
            <TextArea
              name="payload"
              value={typeof formik.values.payload === "string" ? formik.values.payload : JSON.stringify(formik.values.payload ?? {}, null, 2)}
              onChange={(v) => formik.setFieldValue("payload", v)}
              rows={8}
            />
          </div>
        </>
      )}

      {type === "input" && (
        <div>
          <FieldLabel>prompt</FieldLabel>
          <InputText name="prompt" value={formik.values.prompt} onChange={(v) => formik.setFieldValue("prompt", v)} />
        </div>
      )}

      {type === "split" && (
        <div>
          <FieldLabel>branches (2-5)</FieldLabel>
          <NumberInput name="branches" value={formik.values.branches} onChange={(v) => formik.setFieldValue("branches", v)} min={2} max={5} />
          {formik.errors.branches && <div className="text-xs text-red-500 mt-1">{String(formik.errors.branches)}</div>}
        </div>
      )}

      <div className="pt-2">
        <button type="submit" className="px-3 py-2 text-sm rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
          Save
        </button>
      </div>
    </form>
  );
};