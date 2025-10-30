import React, { useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

const HORIZONTAL_GAP = 250;
const VERTICAL_GAP = 120;
const highlightColor = "#ff6b6b"; // highlight color (red)

function FlowTreeContent({ data, searchResult }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setCenter } = useReactFlow();

  // Create nodes and edges recursively
  const createNodesAndEdges = (obj) => {
    const nodes = [];
    const edges = [];
    let nodeId = 0;

    const processNode = (key, value, parentId = null, level = 0, row = 0, fullPath = "$") => {
      const currentId = `node-${nodeId++}`;
      const isArray = Array.isArray(value);
      const isObject = typeof value === "object" && value !== null && !isArray;

      const backgroundColor = isObject
        ? "#c8b6ff"
        : isArray
        ? "#b2f2bb"
        : "#ffd43b";

      nodes.push({
        id: currentId,
        position: { x: level * HORIZONTAL_GAP, y: row * VERTICAL_GAP },
        data: { label: key },
        style: {
          background: backgroundColor,
          border: "1px solid #888",
          borderRadius: 8,
          padding: 8,
          fontWeight: 600,
          textAlign: "center",
          minWidth: 100,
        },
        fullPath,
        value,
      });

      if (parentId) {
        edges.push({
          id: `edge-${parentId}-${currentId}`,
          source: parentId,
          target: currentId,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: "#666" },
        });
      }

      let childRow = row;

      if (isObject) {
        Object.entries(value).forEach(([childKey, childVal]) => {
          childRow++;
          const newPath = `${fullPath}.${childKey}`;
          processNode(childKey, childVal, currentId, level + 1, childRow, newPath);
        });
      } else if (isArray) {
        value.forEach((arrItem, i) => {
          childRow++;
          const indexId = `node-${nodeId++}`;
          const indexLabel = `[${i}]`;
          const arrayPath = `${fullPath}[${i}]`;

          nodes.push({
            id: indexId,
            position: {
              x: (level + 1) * HORIZONTAL_GAP,
              y: childRow * VERTICAL_GAP,
            },
            data: { label: indexLabel },
            style: {
              background: "#b2f2bb",
              border: "1px solid #888",
              borderRadius: 8,
              padding: 8,
              fontWeight: 600,
              textAlign: "center",
              minWidth: 80,
            },
            fullPath: arrayPath,
            value: arrItem,
          });

          edges.push({
            id: `edge-${currentId}-${indexId}`,
            source: currentId,
            target: indexId,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: "#666" },
          });

          if (typeof arrItem === "object" && arrItem !== null) {
            Object.entries(arrItem).forEach(([childKey, childVal]) => {
              childRow++;
              const newPath = `${arrayPath}.${childKey}`;
              processNode(childKey, childVal, indexId, level + 2, childRow, newPath);
            });
          } else {
            childRow++;
            const valPath = `${arrayPath}`;
            processNode(String(i), arrItem, indexId, level + 2, childRow, valPath);
          }
        });
      } else {
        childRow++;
        const valueId = `node-${nodeId++}`;
        const valPath = `${fullPath}`;
        nodes.push({
          id: valueId,
          position: { x: (level + 1) * HORIZONTAL_GAP, y: childRow * VERTICAL_GAP },
          data: { label: String(value) },
          style: {
            background: "#ffd43b",
            border: "1px solid #888",
            borderRadius: 8,
            padding: 8,
            textAlign: "center",
            minWidth: 80,
          },
          fullPath: valPath,
          value,
        });

        edges.push({
          id: `edge-${currentId}-${valueId}`,
          source: currentId,
          target: valueId,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: "#666" },
        });
      }
    };

    Object.entries(obj).forEach(([key, val], i) => {
      processNode(key, val, null, 0, i, `$.${key}`);
    });

    return { nodes, edges };
  };

  // Initial render
  useEffect(() => {
    if (data) {
      const { nodes: n, edges: e } = createNodesAndEdges(data);
      setNodes(n);
      setEdges(e);
    }
  }, [data]);

  // Highlight and center searched node
  useEffect(() => {
    if (!searchResult || !nodes.length) return;

    const matchedNode = nodes.find(
      (n) => n.fullPath === searchResult.path || n.fullPath === `$${searchResult.path}`
    );

    if (matchedNode) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === matchedNode.id
            ? { ...n, style: { ...n.style, border: `3px solid ${highlightColor}` } }
            : { ...n, style: { ...n.style, border: "1px solid #888" } }
        )
      );
      setCenter(matchedNode.position.x, matchedNode.position.y, { zoom: 1.5 });
    } else {
      setNodes((nds) =>
        nds.map((n) => ({ ...n, style: { ...n.style, border: "1px solid #888" } }))
      );
    }
  }, [searchResult, nodes, setCenter]);

  return (
    <div style={{ width: "100%", height: "700px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

// ✅ Wrap content with ReactFlowProvider
export default function FlowTree(props) {
  return (
    <ReactFlowProvider>
      <FlowTreeContent {...props} />
    </ReactFlowProvider>
  );
}
