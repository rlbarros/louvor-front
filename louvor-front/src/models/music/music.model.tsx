import { Identifiable } from "../app/identifiable.model";

export interface Music extends Identifiable {
  genre_id: number;
  style_id: number;
  interpreter_id: number;
  name: string;
}
