import { useState } from "react";
import type { NodeProps } from "reaflow";
import { useDataStore } from "../../state/useDataStore";


type EditableNodeProps = NodeProps & {
  data?: { path?: (string | number)[]; value?: unknown };
};

export default function EditableNode(props: EditableNodeProps) {
  const path = (props as any)?.data?.path ?? [];
  const initial = (props as any)?.data?.value;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(
    typeof initial === "string" ? initial : JSON.stringify(initial)
  );

  const updateAtPath = useDataStore((s) => s.updateAtPath);

  const onEdit = () => setEditing(true);
  const onCancel = () => {
    setEditing(false);
    setDraft(typeof initial === "string" ? initial : JSON.stringify(initial));
  };
  const onSave = () => {
    let next: any = draft;
    const t = draft.trim();
    if (
      t === "null" || t === "true" || t === "false" || /^-?\d/.test(t) ||
      ((t.startsWith("{") && t.endsWith("}")) || (t.startsWith("[") && t.endsWith("]")))
    ) {
      try { next = JSON.parse(draft); } catch {}
    }
    updateAtPath(path, next);
    setEditing(false);
  };

  return (
    <foreignObject x={0} y={0} width={props.width} height={props.height}>
      <div className="w-full h-full flex items-center justify-between px-2 gap-2 text-xs">
        <div className="truncate flex-1">
          {editing ? (
            <input
              className="w-full border rounded px-1 py-0.5"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
            />
          ) : (
            <span title={String(initial)}>
              {typeof initial === "string" ? initial : JSON.stringify(initial)}
            </span>
          )}
        </div>

        {!editing ? (
          <button className="border rounded px-2 py-0.5" onClick={onEdit}>
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button className="border rounded px-2 py-0.5" onClick={onSave}>
              Save
            </button>
            <button className="border rounded px-2 py-0.5" onClick={onCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </foreignObject>
  );
}
