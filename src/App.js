// ...existing code...
import React, { useState } from "react";
import JsonInput from "./components/JsonInput";
import FlowTree from "./components/FlowTree";

export default function App() {
  const [data, setData] = useState(null);

  return (
    <div className="app">
      <h1>JSON Tree Visualizer</h1>
      <JsonInput onVisualize={setData} />
      <div className="visual">
        {data ? (
          <FlowTree data={data} />
        ) : (
          <p className="hint">Paste JSON into the textarea and click Visualize</p>
        )}
      </div>
    </div>
  );
}