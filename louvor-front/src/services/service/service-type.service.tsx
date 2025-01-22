import { ServiceType } from "@/models/services/service-type.model";
import { constants } from "../../constants";

import { CrudService } from "../crud.service";

export class ServiceTypeService extends CrudService<ServiceType, ServiceType> {
  override domain() {
    return constants.domains.service.name;
  }

  override route() {
    return constants.domains.service.routes.servicesTypes;
  }
}
