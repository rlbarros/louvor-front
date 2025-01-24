import { z } from "zod";

import Crud from "../../components/crud";
import { constants } from "../../constants";
import { MusicService } from "@/services/music/music.service";
import { defaultMusicView } from "@/models/music/music.view";
import { LabelDefinition } from "@/models/app/label-definition.model";

export function Musics() {
  const musicService = new MusicService();

  const schema = z.object({
    genre: z.string().min(1, { message: "o gênero deve ser preenchdo" }),
    style: z.string().min(1, { message: "o estilo deve ser preenchdo" }),
    interpreter: z
      .string()
      .min(1, { message: "o intérprete deve ser preenchdo" }),
    name: z.string().min(1, { message: "o nome deve ser preenchdo" }),
  });

  const propertyMap = new Map<string, string>([
    ["genre", "gênero"],
    ["style", "estilo"],
    ["interpreter", "intérprete"],
    ["name", "nome"],
  ]);

  const labelDefinition = {
    labelContainer: "name",
    labelColumnLabel: "style",
    labelColumnValue: "style_id",
  } as LabelDefinition;

  return (
    <Crud
      crudService={musicService}
      schema={schema}
      labelDefintion={labelDefinition}
      record={defaultMusicView}
      propertyMap={propertyMap}
      title={constants.menus.musics}
    />
  );
}
