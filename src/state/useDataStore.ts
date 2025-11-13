import { create } from "zustand";

type DataState = {
  jsonText: string;
  jsonObj: any | null;
  setJsonText: (t: string) => void;
  setJsonObj: (o: any | null) => void;
  updateAtPath: (path: (string | number)[], newValue: unknown) => void;
};

function setAtPath(obj: any, path: (string | number)[], val: unknown): any {
  if (!path.length) return val;
  const [head, ...tail] = path;
  if (Array.isArray(obj)) {
    const copy = obj.slice();
    copy[Number(head)] = setAtPath(copy[Number(head)], tail, val);
    return copy;
  }
  return { ...obj, [head as any]: setAtPath(obj?.[head as any], tail, val) };
}

export const useDataStore = create<DataState>((set, get) => ({
  jsonText: '{\n  "hello": "world"\n}\n',
  jsonObj: { hello: "world" },
  setJsonText: (t) => {
    let obj: any = null;
    try { obj = JSON.parse(t); } catch { obj = null; }
    set({ jsonText: t, jsonObj: obj });
  },
  setJsonObj: (o) => set({
    jsonObj: o,
    jsonText: (() => { try { return JSON.stringify(o, null, 2); } catch { return ""; } })()
  }),
  updateAtPath: (path, newValue) => {
    const curr = get().jsonObj;
    if (!curr) return;
    const next = setAtPath(curr, path, newValue);
    set({ jsonObj: next, jsonText: JSON.stringify(next, null, 2) });
  }
}));
