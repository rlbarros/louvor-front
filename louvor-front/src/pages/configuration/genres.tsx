import { GenreService } from "../../services/music/genre.service";
import { z } from "zod";
import { labelDefinitionDefault } from "../../models/app/label-definition.model";
import { defaultGenre } from "../../models/music/genre.model";
import Crud from "../../components/crud";
import { constants } from "../../constants";

export function Genres() {
  const genreService = new GenreService();

  const schema = z.object({
    name: z.string().min(1, { message: "o nome deve ser preenchdo" }),
  });

  const propertyMap = new Map<string, string>([["name", "nome"]]);

  return (
    <Crud
      crudService={genreService}
      schema={schema}
      labelDefintion={labelDefinitionDefault}
      record={defaultGenre}
      propertyMap={propertyMap}
      title={constants.menus.genres}
    />
  );
}
