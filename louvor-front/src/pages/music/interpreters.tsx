import { z } from "zod";
import { labelDefinitionDefault } from "../../models/app/label-definition.model";

import Crud from "../../components/crud";
import { constants } from "../../constants";
import {
  defaultInterpreter,
  Interpreter,
} from "@/models/music/interpreter.model";
import { InterpreterService } from "@/services/music/interpreter.service";
import { ZodInput } from "@/components/form/zod-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import singularFromPlural from "@/utils/singular.util";

export function Interpreters() {
  const interpreterService = new InterpreterService();

  const name = "name";
  const nome = "nome";
  const schema = z.object({
    [name]: z.string().min(1, { message: `o ${nome} deve ser preenchdo` }),
  });

  const propertyMap = new Map<string, string>([[name, nome]]);

  const form = useForm<Interpreter>({
    resolver: zodResolver(schema),
  });
  const { register, formState } = form;
  const { errors } = formState;

  const pluralTitle = constants.menus.interpreters;
  const singularTitle = singularFromPlural(pluralTitle);
  const description = "Cantores ou Bandas que louvam as músicas";

  return (
    <Crud
      crudService={interpreterService}
      form={form}
      labelDefintion={labelDefinitionDefault}
      exampleRecord={defaultInterpreter}
      propertyMap={propertyMap}
      singularTitle={singularTitle}
      pluralTitle={pluralTitle}
      description={description}
    >
      <div className="grid grid-cols-1 items-center gap-4">
        <ZodInput
          className="w-full min-w-[100%]"
          label={nome}
          type="text"
          name={name}
          placeholder="informe o intérprete"
          errors={errors}
          register={register}
        />
      </div>
    </Crud>
  );
}
