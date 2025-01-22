import { Identifiable } from "../app/identifiable.model";

export type ServiceType = {
  name: string;
  music_count: number;
} & Identifiable;
