import { useState, version, useEffect, useContext } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./mock/db";
import { Style } from "./models/music/style.model";
import { StyleService } from "./services/music/style.service";
import { FadeLoader } from "react-spinners";
import AuthContext from "./utils/contexts";

export function Styles() {
  const [count, setCount] = useState(0);
  const [isPending, setIsPending] = useState(true);
  const [styles, setStyles] = useState<Style[]>([]);

  const currentUser = useContext(AuthContext);
  useEffect(() => {
    console.log(currentUser);
    const styleService = new StyleService();
    const fetchData = async () => {
      const styles = await styleService.list();
      if (styles) {
        setIsPending(false);
        setStyles(styles);
      }
    };

    fetchData(); // Mark this as a transition
  }, [currentUser]);

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
      <FadeLoader color="#FFFFFF" loading={isPending} />
      <h1>Vite + React</h1>
      <small> {version}</small>
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
