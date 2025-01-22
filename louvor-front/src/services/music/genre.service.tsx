import { constants } from "../../constants";
import { Genre } from "../../models/music/genre.model";
import { CrudService } from "../crud.service";

export class GenreService extends CrudService<Genre, Genre> {
  override domain() {
    return constants.domains.music.name;
  }

  override route() {
    return constants.domains.music.routes.genres;
  }
}
