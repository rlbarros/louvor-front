import { Service } from "./service.model";

export type ServiceView = {
  service_type: string;
} & Service;
