import { Identifiable } from "../app/identifiable.model";

export interface Interpreter extends Identifiable {
  name: string;
}

export const defaultInterpreter = {
  id: 0,
  name: "",
};
