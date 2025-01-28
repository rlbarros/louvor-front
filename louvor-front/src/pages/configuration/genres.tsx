import { GenreService } from "../../services/music/genre.service";
import { z } from "zod";
import { labelDefinitionDefault } from "../../models/app/label-definition.model";
import { defaultGenre, Genre } from "../../models/music/genre.model";
import Crud from "../../components/crud";
import { constants } from "../../constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import singularFromPlural from "@/utils/singular.util";
import { ZodInput } from "@/components/form/zod-input";

export function Genres() {
  const genreService = new GenreService();

  const name = "name";
  const nome = "nome";
  const schema = z.object({
    [name]: z.string().min(1, { message: `o ${nome} deve ser preenchdo` }),
  });

  const propertyMap = new Map<string, string>([[name, nome]]);

  const form = useForm<Genre>({
    resolver: zodResolver(schema),
  });
  const { register, formState } = form;
  const { errors } = formState;

  const pluralTitle = constants.menus.genres;
  const singularTitle = singularFromPlural(pluralTitle);
  const description = "Gênero músical ";

  return (
    <Crud
      crudService={genreService}
      form={form}
      labelDefintion={labelDefinitionDefault}
      exampleRecord={defaultGenre}
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
          placeholder="informe o gênero"
          errors={errors}
          register={register}
        />
      </div>
    </Crud>
  );
}
