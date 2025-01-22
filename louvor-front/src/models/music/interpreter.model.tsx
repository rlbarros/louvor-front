import { Identifiable } from "../app/identifiable.model";

export type Interpreter = {
  name: string;
} & Identifiable;

export const defaultInterpreter = {
  id: 0,
  name: "",
};
