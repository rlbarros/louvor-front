import { Music } from "@/models/music/music.model";
import { constants } from "../../constants";
import { CrudService } from "../crud.service";
import { MusicView } from "@/models/music/music.view";

export class MusicService extends CrudService<Music, MusicView> {
  override domain() {
    return constants.domains.music.name;
  }

  override route() {
    return constants.domains.music.routes.musics;
  }
}
