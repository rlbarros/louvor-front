import { ServiceMusic } from "./service-music.model";

export type ServiceMusicView = {
  music: string;
  genre: string;
  style: string;
  interpreter: string;
} & ServiceMusic;

export const defaultServiceMusicView = {
  id: 0,
  service_id: 0,
  music_id: 0,
  music: "",
  genre: "",
  interpreter: "",
  style: "",
} as ServiceMusicView;
