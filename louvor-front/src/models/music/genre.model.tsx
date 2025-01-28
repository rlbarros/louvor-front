import { Identifiable } from "../app/identifiable.model";

export interface Genre extends Identifiable {
  name: string;
}

export const defaultGenre = {
  id: 0,
  name: "",
} as Genre;
