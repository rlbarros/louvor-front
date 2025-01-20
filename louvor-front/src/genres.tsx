import { useState, version, useEffect, useContext } from "react";
import "./mock/db";
import { Genre } from "./models/music/genre.model";
import { GenreService } from "./services/music/genre.service";
import { FadeLoader } from "react-spinners";
import AuthContext from "./utils/contexts";

export function Genres() {
  const [count, setCount] = useState(0);
  const [isPending, setIsPending] = useState(true);
  const [genres, setGenres] = useState<Genre[]>([]);

  const currentUser = useContext(AuthContext);
  useEffect(() => {
    console.log(currentUser);
    const genreService = new GenreService();
    const fetchData = async () => {
      const genres = await genreService.list();
      if (genres) {
        setIsPending(false);
        setGenres(genres);
      }
    };

    fetchData(); // Mark this as a transition
  }, [currentUser]);

  return (
    <>
      {genres.map((s) => (
        <div key={s.id}>{s.name}</div>
      ))}
      <FadeLoader color="#FFFFFF" loading={isPending} />
      <h1>Vite + React</h1>
      <small> {version}</small>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}
