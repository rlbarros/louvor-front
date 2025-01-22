import { Identifiable } from "../app/identifiable.model";

export type Style = {
  name: string;
} & Identifiable;

export const defaultStyle = {
  id: 0,
  name: "",
} as Style;
