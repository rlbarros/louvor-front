import { z } from "zod";
import { labelDefinitionDefault } from "../../models/app/label-definition.model";

import Crud from "../../components/crud";
import { constants } from "../../constants";
import { ServiceTypeService } from "@/services/service/service-type.service";
import {
  defaultServiceType,
  ServiceType,
} from "@/models/services/service-type.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodInput } from "@/components/form/zod-input";
import { useForm } from "react-hook-form";

export function ServiceTypes() {
  const serviceTypeService = new ServiceTypeService();

  const name = "name";
  const nome = "nome";
  const music_count = "music_count";
  const qtd_musicas = "qtd. de músicas";
  const schema = z.object({
    [name]: z.string().min(1, { message: `o ${nome} deve ser preenchdo` }),
    [music_count]: z.coerce
      .number()
      .min(1, { message: `a ${qtd_musicas} deve ser preenchida` }),
  });

  const propertyMap = new Map<string, string>([
    [name, nome],
    [music_count, qtd_musicas],
  ]);

  const form = useForm<ServiceType>({
    resolver: zodResolver(schema),
  });
  const { register, formState } = form;
  const { errors } = formState;

  const pluralTitle = constants.menus.servicesTypes;
  const singularTitle = "Tipo de culto";
  const description =
    "Configuração de tipos de cultos personalizam a quantidade de músicas para inferência automática";

  return (
    <Crud
      crudService={serviceTypeService}
      form={form}
      labelDefintion={labelDefinitionDefault}
      exampleRecord={defaultServiceType}
      propertyMap={propertyMap}
      singularTitle={singularTitle}
      pluralTitle={pluralTitle}
      description={description}
    >
      <div className="grid grid-cols-1 items-center gap-4">
        <div className="grid gap-2">
          <ZodInput
            className="w-full min-w-[100%]"
            label={nome}
            type="text"
            name={name}
            placeholder="informe o nome do tipo"
            errors={errors}
            register={register}
          />
        </div>
        <div className="grid gap-2">
          <ZodInput
            className="w-full min-w-[100%]"
            label={qtd_musicas}
            type="number"
            name={music_count}
            placeholder="informe a quantidade"
            errors={errors}
            register={register}
          />
        </div>
      </div>
    </Crud>
  );
}
