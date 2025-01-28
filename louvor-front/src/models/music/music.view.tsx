import { Music } from "./music.model";

export interface MusicView extends Music {
  genre: string;
  style: string;
  interpreter: string;
}

export const defaultMusicView = {
  id: 0,
  genre_id: 0,
  genre: "",
  style_id: 0,
  style: "",
  interpreter_id: 0,
  interpreter: "",
  name: "",
} as MusicView;
