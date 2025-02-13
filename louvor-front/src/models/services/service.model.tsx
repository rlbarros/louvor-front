import { Identifiable } from "../app/identifiable.model";

export interface Service extends Identifiable {
  day: Date;
  service_type_id: number;
  ministry_id: number;
}

export const defaultService = {
  id: 0,
  day: new Date(),
  service_type_id: 1,
  ministry_id: 1,
} as Service;
