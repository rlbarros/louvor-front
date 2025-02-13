import { z } from "zod";

import Crud from "../../components/crud";
import { constants } from "../../constants";
import { MusicService } from "@/services/music/music.service";
import { defaultMusicView } from "@/models/music/music.view";
import { LabelDefinition } from "@/models/app/label-definition.model";
import { ZodInput } from "@/components/form/zod-input";
import { useForm } from "react-hook-form";
import { Music } from "@/models/music/music.model";
import { zodResolver } from "@hookform/resolvers/zod";
import singularFromPlural from "@/utils/singular.util";
import { StyleService } from "@/services/music/style.service";
import { GenreService } from "@/services/music/genre.service";
import { InterpreterService } from "@/services/music/interpreter.service";
import { useEffect, useState } from "react";
import { Interpreter } from "@/models/music/interpreter.model";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Style } from "@/models/music/style.model";
import { Genre } from "@/models/music/genre.model";
import { SelectGroup } from "@radix-ui/react-select";
import { AutoComplete, Option } from "@/components/autocomplete";
import { FadeLoader } from "react-spinners";

export function Musics() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const musicService = new MusicService();
  const [styles, setStyles] = useState<Style[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [interpreters, setInterpreters] = useState<Interpreter[]>([]);
  const [interpretersOptions, setInterpretersOptions] = useState<Option[]>([]);

  function getInterpreterOption(id: number) {
    const interpreterOption = interpretersOptions.find(
      (i) => Number(i.value) == id
    );
    return interpreterOption;
  }

  function setOptionInterpreter(option: Option) {
    const interpreter = interpreters.find(
      (i) => Number(i.id) == Number(option.value)
    );
    if (interpreter) {
      form.setValue("interpreter_id", interpreter.id);
    }
  }

  useEffect(() => {
    const styleService = new StyleService();
    const genreService = new GenreService();
    const interpreterService = new InterpreterService();

    const fetchStyles = async () => {
      const fetchedStyles = await styleService.list();
      if (fetchedStyles) {
        setStyles(fetchedStyles);
      }
    };

    const fetchGenres = async () => {
      const fetchedGenres = await genreService.list();
      if (fetchedGenres) {
        setGenres(fetchedGenres);
      }
    };

    const fetchInterpreters = async () => {
      const fetchedInterpreters = await interpreterService.list();
      if (fetchedInterpreters) {
        setInterpreters(fetchedInterpreters);
        const mappedInterpretedOptions = fetchedInterpreters.map((i) => {
          return {
            value: `${i.id}`,
            label: i.name,
          } as Option;
        });
        setInterpretersOptions(mappedInterpretedOptions);
        setIsLoading(false);
      }
    };

    fetchStyles();
    fetchGenres();
    setTimeout(() => {
      fetchInterpreters();
    }, 100);
  }, []);

  const genre = "genre";
  const genero = "gênero";
  const style = "style";
  const estilo = "estilo";
  const name = "name";
  const nome = "nome";
  const interpreter = "interpreter";
  const interprete = "intérprete";
  const schema = z.object({
    style_id: z.any({
      required_error: `o ${estilo} deve ser preenchdo`,
    }),
    genre_id: z.any({
      required_error: `o ${genero} deve ser preenchdo`,
    }),
    interpreter_id: z.any({
      required_error: `o ${interprete} deve ser preenchdo`,
    }),

    [name]: z.string().min(1, { message: `o ${nome} deve ser preenchdo` }),
  });

  const propertyMap = new Map<string, string>([
    [genre, genero],
    [style, estilo],
    [interpreter, interprete],
    [name, nome],
  ]);

  const labelDefinition = {
    labelContainer: "name",
    labelColumnLabel: "style",
    labelColumnValue: "style_id",
  } as LabelDefinition;

  const form = useForm<Music>({
    resolver: zodResolver(schema),
  });
  const { register, formState } = form;
  const { errors } = formState;

  const pluralTitle = constants.menus.musics;
  const singularTitle = singularFromPlural(pluralTitle);
  const description = "louvor que será entoado no culto";

  return isLoading ? (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex w-full items-center">
      <FadeLoader
        color="#FFFFFF"
        width={2}
        height={10}
        margin={-5}
        loading={isLoading}
      />
    </div>
  ) : (
    <Crud
      crudService={musicService}
      form={form}
      labelDefintion={labelDefinition}
      exampleRecord={defaultMusicView}
      propertyMap={propertyMap}
      singularTitle={singularTitle}
      pluralTitle={pluralTitle}
      description={description}
    >
      <div className="grid grid-cols-1 items-center gap-4">
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="style_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pl-2">{estilo}</FormLabel>
                <Select value={`${field.value}`} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Selectione o estilo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>estilos</SelectLabel>
                      {styles.map((s) => {
                        return (
                          <SelectItem key={s.id} value={`${s.id}`}>
                            {s.name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="genre_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pl-2">{genero}</FormLabel>
                <Select value={`${field.value}`} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Selectione o gênero" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>gêneros</SelectLabel>
                      {genres.map((g) => {
                        return (
                          <SelectItem key={g.id} value={`${g.id}`}>
                            {g.name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="interpreter_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pl-2" asChild>
                  <legend>{interprete}</legend>
                </FormLabel>
                <FormControl>
                  <AutoComplete
                    options={interpretersOptions}
                    emptyMessage="Sem Resultados"
                    placeholder="Selecione um intérprete"
                    isLoading={isLoading}
                    onValueChange={setOptionInterpreter}
                    value={getInterpreterOption(field.value)}
                    disabled={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
          <ZodInput
            className="w-full min-w-[100%]"
            label={nome}
            type="text"
            name={name}
            placeholder="informe o nome da música"
            errors={errors}
            register={register}
          />
        </div>
      </div>
    </Crud>
  );
}
