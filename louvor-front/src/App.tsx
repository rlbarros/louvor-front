import { useState, version, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "./mock/db";
import { Style } from "./models/music/style.model";
import { StyleService } from "./services/music/style.service";
import { FadeLoader } from "react-spinners";
import { AuthService } from "./services/auth/auth.service";
import { Login } from "./models/auth/login,model";

function App() {
  const [count, setCount] = useState(0);
  const [isPending, setIsPending] = useState(true);
  const [styles, setStyles] = useState<Style[]>([]);

  useEffect(() => {
    const styleService = new StyleService();
    const authService = new AuthService();
    const fetchData = async () => {
      const styles = await styleService.list();
      if (styles) {
        setIsPending(false);
        setStyles(styles);
      }
      const loginRequest = {
        email: "rodrigo.lima.barros@gmail.com",
        password: "200710",
      } as Login;
      const encodeRequest = await authService.login(loginRequest);
      console.log(encodeRequest);
    };

    fetchData(); // Mark this as a transition
  }, []);

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

export default App;
