import { Identifiable } from "../app/identifiable.model";

export type Service = {
  day: Date;
  service_type_id: number;
} & Identifiable;
