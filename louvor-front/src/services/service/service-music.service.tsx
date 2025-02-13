import { ApiResponse } from "@/models/app/api-response.model";
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

  async action(
    queryParams: Record<string, string> = {}
  ): Promise<ServiceMusicView[]> {
    const options = this.options("PUT");
    const path = this.pathQuery(queryParams);

    const apiResponse = (await fetch(path, options).then((r) =>
      r.json()
    )) as ApiResponse<ServiceMusicView[]>;
    return apiResponse.content;
  }
}
