import { Music } from "./music.model";

export type MusicView = {
  genre: string;
  style: string;
  interpreter: string;
} & Music;
