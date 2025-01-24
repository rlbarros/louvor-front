import { Service } from "@/models/services/service.model";
import { ServiceView } from "@/models/services/service.view";
import { constants } from "../../constants";

import { CrudService } from "../crud.service";

export class ServiceService extends CrudService<Service, ServiceView> {
  override domain() {
    return constants.domains.service.name;
  }

  override route() {
    return constants.domains.service.routes.services;
  }
}
