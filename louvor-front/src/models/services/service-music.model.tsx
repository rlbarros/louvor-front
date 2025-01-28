import { Identifiable } from "../app/identifiable.model";

export interface ServiceMusic extends Identifiable {
  service_id: number;
  music_id: number;
}
