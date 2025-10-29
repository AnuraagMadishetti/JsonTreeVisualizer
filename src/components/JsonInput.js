// ...existing code...
import React, { useState } from "react";

const SAMPLE_JSON = `{
  "name": "Alice",
  "age": 30,
  "address": {
    "city": "Wonderland",
    "zip": "12345"
  },
  "hobbies": ["reading", "chess"],
  "active": true,
  "score": null
}`;

export default function JsonInput({ onVisualize }) {
  const [text, setText] = useState(SAMPLE_JSON);
  const [error, setError] = useState(null);

  function handleVisualize() {
    try {
      const parsed = JSON.parse(text);
      // ensure we pass only a JSON-serializable plain object (removes functions/React elements)
      const safe = JSON.parse(JSON.stringify(parsed));
      // debug
      // eslint-disable-next-line no-console
      console.log("JsonInput -> passing to FlowTree (safe):", safe);
      setError(null);
      onVisualize(safe);
    } catch (e) {
      setError(e.message);
      onVisualize(null);
    }
  }

  return (
    <div className="input-card">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        aria-label="JSON input"
      />
      {error && <div className="error">Invalid JSON: {error}</div>}
      <div className="controls">
        <button onClick={handleVisualize}>Visualize</button>
      </div>
    </div>
  );
}