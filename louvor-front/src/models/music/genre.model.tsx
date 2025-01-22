import { Identifiable } from "../app/identifiable.model";

export type Genre = {
  name: string;
} & Identifiable;

export const defaultGenre = {
  id: 0,
  name: "",
} as Genre;
