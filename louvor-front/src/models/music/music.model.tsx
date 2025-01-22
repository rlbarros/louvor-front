import { Identifiable } from "../app/identifiable.model";

export type Music = {
  genre_id: number;
  style_id: number;
  interpreter_id: number;
  name: string;
} & Identifiable;
