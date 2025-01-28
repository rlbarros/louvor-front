import { Identifiable } from "../app/identifiable.model";

export interface Style extends Identifiable {
  name: string;
}

export const defaultStyle = {
  id: 0,
  name: "",
} as Style;
