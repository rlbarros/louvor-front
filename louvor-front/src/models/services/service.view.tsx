import { Service } from "./service.model";

export interface ServiceView extends Service {
  service_type: string;
}
