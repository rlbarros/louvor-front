import { Identifiable } from "../app/identifiable.model";

export interface ServiceType extends Identifiable {
  name: string;
  music_count: number;
}

export const defaultServiceType = {
  id: 0,
  name: "",
  music_count: 0,
};
