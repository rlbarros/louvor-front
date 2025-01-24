import { constants } from "../../constants";

import { CrudService } from "../crud.service";
import { ServiceMusic } from "@/models/services/service-music.model";
import { ServiceMusicView } from "@/models/services/service-music.view";

export class ServiceMusicService extends CrudService<
  ServiceMusic,
  ServiceMusicView
> {
  override domain() {
    return constants.domains.service.name;
  }

  override route() {
    return constants.domains.service.routes.servicesMusics;
  }
}
