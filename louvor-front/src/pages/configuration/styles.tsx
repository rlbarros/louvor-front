import { StyleService } from "../../services/music/style.service";
import { z } from "zod";
import { labelDefinitionDefault } from "../../models/app/label-definition.model";

import Crud from "../../components/crud";
import { constants } from "../../constants";
import { defaultStyle, Style } from "../../models/music/style.model";

import { ZodInput } from "@/components/form/zod-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import singularFromPlural from "@/utils/singular.util";

export function Styles() {
  const styleService = new StyleService();

  const name = "name";
  const nome = "nome";

  const schema = z.object({
    [name]: z.string().min(1, { message: `o ${nome} deve ser preenchdo` }),
  });

  const propertyMap = new Map<string, string>([[name, nome]]);

  const form = useForm<Style>({
    resolver: zodResolver(schema),
  });
  const { register, formState } = form;
  const { errors } = formState;

  const pluralTitle = constants.menus.styles;
  const singularTitle = singularFromPlural(pluralTitle);
  const description =
    "Estilo informa o tipo geral da música que será um agrupamento geral quando as músicas foream sugeridas no repertório de um culto";

  return (
    <Crud
      crudService={styleService}
      form={form}
      labelDefintion={labelDefinitionDefault}
      exampleRecord={defaultStyle}
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
          placeholder="informe o estilo"
          errors={errors}
          register={register}
        />
      </div>
    </Crud>
  );
}
