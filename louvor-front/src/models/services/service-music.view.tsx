import { ServiceMusic } from "./service-music.model";
import { ServiceView } from "./service.view";
import { MusicView } from "../music/music.view";

export type ServiceMusicView = {
  service_day: Date;
  music: string;
} & ServiceMusic &
  ServiceView &
  MusicView;
