// ...existing code...
import React, { useMemo } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

const COLORS = {
  object: "#7c3aed",
  array: "#16a34a",
  primitive: "#f59e0b",
};

function typeOf(value) {
  if (value === null) return "primitive";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") return "object";
  return "primitive";
}

function toPlainString(v) {
  if (v === undefined) return "undefined";
  if (v === null) return "null";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

// simple node renderer — expects data.label to be a plain string
function CustomNode({ data }) {
  return (
    <div
      style={{
        padding: 8,
        borderRadius: 6,
        color: "#fff",
        fontSize: 12,
        textAlign: "left",
        minWidth: 120,
        whiteSpace: "pre-wrap",
      }}
    >
      {String(data.label)}
    </div>
  );
}

// stable nodeTypes reference
const nodeTypes = { custom: CustomNode };

export default function FlowTree({ data }) {
  const { nodes, edges } = useMemo(() => {
    if (!data) return { nodes: [], edges: [] };

    // ensure we work on a serializable copy
    let safeData;
    try {
      safeData = JSON.parse(JSON.stringify(data));
    } catch {
      safeData = data;
    }

    let idCounter = 0;
    const genId = () => `n${++idCounter}`;
    const nodesMap = {};
    const edges = [];

    function build(nodeValue, name, parentId = null, depth = 0) {
      const id = genId();
      const kind = typeOf(nodeValue);
      const labelRaw = kind === "primitive" ? `${name}: ${nodeValue}` : `${name}`;
      const label = toPlainString(labelRaw);

      nodesMap[id] = { id, label, kind, depth, children: [], position: { x: 0, y: 0 } };

      if (parentId) {
        edges.push({ id: `e${parentId}-${id}`, source: parentId, target: id, type: "smoothstep" });
        nodesMap[parentId].children.push(id);
      }

      if (kind === "object") {
        for (const [k, v] of Object.entries(nodeValue || {})) {
          build(v, k, id, depth + 1);
        }
      } else if (kind === "array") {
        (nodeValue || []).forEach((item, idx) => build(item, `[${idx}]`, id, depth + 1));
      }
      return id;
    }

    const rootId = build(safeData, "root", null, 0);

    const H_GAP = 220;
    const V_GAP = 90;
    let currentY = 0;
    function setPositions(id) {
      const node = nodesMap[id];
      if (!node) return;
      if (!node.children || node.children.length === 0) {
        node.position = { x: node.depth * H_GAP, y: currentY };
        currentY += V_GAP;
      } else {
        node.children.forEach((c) => setPositions(c));
        const ys = node.children.map((c) => nodesMap[c].position.y);
        node.position = { x: node.depth * H_GAP, y: ys.reduce((a, b) => a + b, 0) / ys.length };
      }
    }
    setPositions(rootId);

    const nodes = Object.values(nodesMap).map((n) => ({
      id: n.id,
      type: "custom",
      // guarantee label is a primitive string
      data: { label: toPlainString(n.label) },
      position: { x: Number(n.position.x) || 0, y: Number(n.position.y) || 0 },
      style: { background: COLORS[n.kind] || COLORS.primitive, color: "#fff", border: "none" },
    }));

    
    // eslint-disable-next-line no-console
    console.log("FlowTree nodes:", nodes);
    // eslint-disable-next-line no-console
    console.log("FlowTree edges:", edges);

    return { nodes, edges };
  }, [data]);

  return (
    <div style={{ height: 600, width: "100%", background: "#f6f8fa", borderRadius: 8 }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Background gap={16} />
        <Controls />
      </ReactFlow>
    </div>
   
//     <div style={{ padding: 12 }}>
//       <h3>Debug: nodes / edges</h3>
//       <pre style={{ maxHeight: 480, overflow: "auto", background: "#fff", padding: 12 }}>
// {JSON.stringify({ nodes, edges }, null, 2)}
//       </pre>
//     </div>
  
  );

}
// ...existing code...