import { Identifiable } from "../app/identifiable.model";

export type Interpreter = {
  name: string;
} & Identifiable;
