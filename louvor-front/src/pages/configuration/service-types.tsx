import { z } from "zod";
import { labelDefinitionDefault } from "../../models/app/label-definition.model";

import Crud from "../../components/crud";
import { constants } from "../../constants";
import { ServiceTypeService } from "@/services/service/service-type.service";
import { defaultServiceType } from "@/models/services/service-type.model";

export function ServiceTypes() {
  const serviceTypeService = new ServiceTypeService();

  const schema = z.object({
    name: z.string().min(1, { message: "o nome deve ser preenchdo" }),
    music_count: z
      .number()
      .min(1, { message: "a quantidade de músicas deve ser preenchida" }),
  });

  const propertyMap = new Map<string, string>([
    ["name", "nome"],
    ["music_count", "qtd. de músicas"],
  ]);

  return (
    <Crud
      crudService={serviceTypeService}
      schema={schema}
      labelDefintion={labelDefinitionDefault}
      record={defaultServiceType}
      propertyMap={propertyMap}
      title={constants.menus.servicesTypes}
    />
  );
}
