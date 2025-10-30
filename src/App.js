import { useState, useEffect } from "react";
import JsonInput from "./components/JsonInput";
import FlowTree from "./components/FlowTree";
import SearchBar from "./components/SearchBar";
import './App.css';

export default function App() {
  const [data, setData] = useState();
  const [searchResult, setSearchResult] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  const handleSearch = (query) => {
    if (!data) return;
    if(!query) return;

    try {
      const cleanQuery = query.startsWith('$') ? query.substring(1) : query;
      const paths = cleanQuery.split('.');
      let current = data;
      for (const path of paths) {
        if (path.includes('[') && path.includes(']')) {
          const [arrayName, indexStr] = path.split('[');
          const index = parseInt(indexStr.replace(']', ''), 10);
          current = arrayName ? current[arrayName][index] : current[index];
        } else if (path === '') {
          continue;
        } else {
          current = current[path];
        }
        if (current === undefined) throw new Error('Path not found');
      }
      
      setSearchResult({
        path: query,
        value: current
      });
    } catch (error) {
      setSearchResult({
        path: query,
        error: 'No Match Found'
      });
    }
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="app-header">
        <h1>JSON Tree Visualizer</h1>
        <div className="theme-toggle-topright">
          <button
            className="theme-button"
            onClick={() => setIsDarkMode(prev => !prev)}
            aria-label="Toggle theme"
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      <div className={`input-card ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="input-wrapper">
          <JsonInput onVisualize={setData} isDarkMode={isDarkMode} setSearchResult={setSearchResult} />
          <div className="search-wrapper">
            <SearchBar onSearch={handleSearch} isDarkMode={isDarkMode} />
            {searchResult && (
              <div className={`search-result ${isDarkMode ? 'dark' : 'light'}`}>
                <h3>Search Result for: {searchResult.path}</h3>
                {searchResult.error ? (
                  <p className="error">{searchResult.error}</p>
                ) : (
                  <p>{JSON.stringify(searchResult.value, null, 2)}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`visual ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        {data ? (
          <FlowTree data={data} searchResult={searchResult} />
        ) : (
          <p className="hint">Paste JSON into the textarea and click Visualize</p>
        )}
      </div>
    </div>
  );
}