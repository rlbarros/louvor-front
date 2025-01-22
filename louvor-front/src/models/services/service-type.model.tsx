import { Identifiable } from "../app/identifiable.model";

export type ServiceType = {
  name: string;
  music_count: number;
} & Identifiable;

export const defaultServiceType = {
  id: 0,
  name: "",
  music_count: 0,
};
