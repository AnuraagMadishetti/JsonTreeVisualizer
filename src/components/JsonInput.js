

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
  const [isDarkMode, setIsDarkMode] = useState(false);

  function handleVisualize() {
    // ...existing code...
  }

  const clear = () => {
    setText("");
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.className = isDarkMode ? 'light-mode' : 'dark-mode';
  }

  return (
    <div className={`input-card ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="theme-toggle">
        <button 
          onClick={toggleTheme}
          className="theme-button"
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        aria-label="JSON input"
        className={isDarkMode ? 'dark-mode' : 'light-mode'}
      />
      {error && <div className="error">Invalid JSON: {error}</div>}
      <div className="controls">
        <button onClick={handleVisualize}>Visualize</button>
        <button style={{marginLeft:"20px", backgroundColor:"red"}} onClick={clear}>Clear</button>
      </div>
    </div>
  );
}



