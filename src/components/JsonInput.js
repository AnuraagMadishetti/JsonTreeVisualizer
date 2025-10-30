import React, { useState } from "react";

const SAMPLE_JSON = ` {
  "user": {
    "id": "1",
    "name": "Anuraag",
    "address": {
      "city": "Hyderabad",
      "country": "India"
    },
    "items": [
      { "name": "item1" },
      { "name": "item2" }
    ]
  }
}`;

export default function JsonInput({ onVisualize, isDarkMode }) {
  const [text, setText] = useState(SAMPLE_JSON);
  const [error, setError] = useState(null);

  function handleVisualize() {
    try {
      const parsed = JSON.parse(text);
      console.log(parsed, "parsed")
      setError(null);
      // Only pass the parsed data to parent
      if (typeof onVisualize === 'function') {
        onVisualize(parsed);
      }
    } catch (e) {
      setError(e.message);
      if (typeof onVisualize === 'function') {
        onVisualize(null);
      }
    }
  }

  const clear = () => {
    setText("");
    setError(null);
    if (typeof onVisualize === 'function') {
      onVisualize(null);
    }
  }

  return (
    <div className={`json-input-container ${isDarkMode ? 'dark' : 'light'}`}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={14}
        aria-label="JSON input"
        className={`json-textarea ${isDarkMode ? 'dark' : 'light'}`}
      />
      {error && <div className="error">Invalid JSON: {error}</div>}
      <div className="controls">
        <button 
          onClick={handleVisualize}
          className={`visualize-button ${isDarkMode ? 'dark' : 'light'}`}
        >
          Visualize
        </button>
        <button 
          onClick={clear}
          className="clear-button"
          style={{marginLeft:"12px", backgroundColor:"red"}} 
        >
          Clear
        </button>
      </div>
    </div>
  );
}