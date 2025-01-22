import { Identifiable } from "../app/identifiable.model";

export type ServiceMusic = {
  service_id: number;
  music_id: number;
} & Identifiable;
