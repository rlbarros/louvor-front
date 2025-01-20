import { constants } from "../../constants";
import { Genre } from "../../models/music/genre.model";
import { ListService } from "../list.service";

export class GenreService extends ListService<Genre> {
  override domain() {
    return constants.domains.music.name;
  }

  override route() {
    return constants.domains.music.routes.genres;
  }
}
