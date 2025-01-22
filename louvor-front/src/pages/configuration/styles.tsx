import { StyleService } from "../../services/music/style.service";
import { z } from "zod";
import { labelDefinitionDefault } from "../../models/app/label-definition.model";

import Crud from "../../components/crud";
import { constants } from "../../constants";
import { defaultStyle } from "../../models/music/style.model";

export function Styles() {
  const styleService = new StyleService();

  const schema = z.object({
    name: z.string().min(1, { message: "o nome deve ser preenchdo" }),
  });

  const propertyMap = new Map<string, string>([["name", "nome"]]);

  return (
    <Crud
      crudService={styleService}
      schema={schema}
      labelDefintion={labelDefinitionDefault}
      record={defaultStyle}
      propertyMap={propertyMap}
      title={constants.menus.styles}
    />
  );
}
