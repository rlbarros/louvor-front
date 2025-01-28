import { ServiceMusic } from "./service-music.model";

export interface ServiceMusicView extends ServiceMusic {
  music: string;
  genre: string;
  style: string;
  style_id: number;
  interpreter: string;
}

export const defaultServiceMusicView = {
  id: 0,
  service_id: 0,
  music_id: 0,
  music: "",
  genre: "",
  interpreter: "",
  style: "",
  style_id: 0,
} as ServiceMusicView;
