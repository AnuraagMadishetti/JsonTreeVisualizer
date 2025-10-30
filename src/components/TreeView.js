
import React from "react";

function Node({ name, value }) {
  const type = value === null ? "null" : Array.isArray(value) ? "array" : typeof value;

  if (type === "null" || type === "number" || type === "string" || type === "boolean") {
    return (
      <div className="node">
        <span className="key">{name}</span>: <span className="value">{String(value)}</span>
      </div>
    );
  }

  if (type === "array") {
    return (
      <div className="node">
        <div className="key">{name} [ ]</div>
        <ul>
          {value.map((item, i) => (
            <li key={i}>
              <Node name={i} value={item} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="node">
      <div className="key">{name} {"{ }"}</div>
      <ul>
        {Object.entries(value).map(([k, v]) => (
          <li key={k}>
            <Node name={k} value={v} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TreeView({ data }) {
  return (
    <div className="tree">
      <Node name="root" value={data} />
    </div>
  );
}