import { Identifiable } from "../app/identifiable.model";

export type Service = {
  day: Date;
  service_type_id: number;
} & Identifiable;

export const defaultService = {
  id: 0,
  day: new Date(),
  service_type_id: 1,
} as Service;
