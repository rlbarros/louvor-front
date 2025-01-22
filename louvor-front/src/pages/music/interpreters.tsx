import { z } from "zod";
import { labelDefinitionDefault } from "../../models/app/label-definition.model";

import Crud from "../../components/crud";
import { constants } from "../../constants";
import { defaultInterpreter } from "@/models/music/interpreter.model";
import { InterpreterService } from "@/services/music/interpreter.service";

export function Interpreters() {
  const interpreterService = new InterpreterService();

  const schema = z.object({
    name: z.string().min(1, { message: "o nome deve ser preenchdo" }),
  });

  const propertyMap = new Map<string, string>([["name", "nome"]]);

  return (
    <Crud
      crudService={interpreterService}
      schema={schema}
      labelDefintion={labelDefinitionDefault}
      record={defaultInterpreter}
      propertyMap={propertyMap}
      title={constants.menus.interpreters}
    />
  );
}
