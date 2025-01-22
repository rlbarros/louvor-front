import { constants } from "../../constants";
import { Style } from "../../models/music/style.model";
import { CrudService } from "../crud.service";

export class StyleService extends CrudService<Style, Style> {
  override domain() {
    return constants.domains.music.name;
  }

  override route() {
    return constants.domains.music.routes.styles;
  }
}
