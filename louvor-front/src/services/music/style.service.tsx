import { constants } from "../../constants";
import { Style } from "../../models/music/style.model";
import { ListService } from "../list.service";

export class StyleService extends ListService<Style> {
  override domain() {
    return constants.domains.music.name;
  }

  override route() {
    return constants.domains.music.routes.styles;
  }
}
