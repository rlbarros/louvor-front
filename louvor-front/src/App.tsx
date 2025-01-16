import { useEffect, useState, version } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "./mock/db";
import { Style } from "./models/style.model";

function App() {
  const [count, setCount] = useState(0);
  const [styles, setStyles] = useState<Style[]>([]);

  useEffect(() => {
    fetch("/api/styles")
      .then((r) => r.json())
      .then((styles) => setStyles(styles));
  });

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      {styles.map((s) => (
        <div key={s.id}>{s.name}</div>
      ))}
      <h1>Vite + React</h1> <small> {version}</small>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
