import { StyleService } from "../../services/music/style.service";
import { z } from "zod";
import { labelDefinitionDefault } from "../../models/app/label-definition.model";

import Crud from "../../components/crud";
import { constants } from "../../constants";
import { defaultStyle, Style } from "../../models/music/style.model";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZodInput } from "@/components/form/zod-input";
import { FadeLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";

export function Styles() {
  const styleService = new StyleService();
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const schema = z.object({
    name: z.string().min(1, { message: "o nome deve ser preenchdo" }),
  });

  const propertyMap = new Map<string, string>([["name", "nome"]]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Style>({
    resolver: zodResolver(schema),
  });

  async function handleSave(data: Style) {
    data.id = 0;
    await saveData(data);
  }

  async function saveData(data: Style) {
    const newObject = await styleService.save(data);
    setOpenAddDialog(false);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(newObject, null, 2)}
          </code>
        </pre>
      ),
    });
  }

  return (
    <Crud
      crudService={styleService}
      schema={schema}
      labelDefintion={labelDefinitionDefault}
      record={defaultStyle}
      propertyMap={propertyMap}
      title={constants.menus.styles}
      setOpenAddDialog={setOpenAddDialog}
    >
      (
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(handleSave)}>
            <DialogHeader>
              <DialogTitle>Adicionar Estilo</DialogTitle>
              <DialogDescription>
                Estilo informa o tipo geral da música que será um agrupamento
                geral quando as músicas foream sugeridas no repertório de um
                culto
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 items-center gap-4">
                <ZodInput
                  className="w-full min-w-[100%]"
                  label="nome"
                  type="text"
                  name="name"
                  placeholder="informe o estilo"
                  errors={errors}
                  register={register}
                />
              </div>
            </div>
            <DialogFooter>
              {isSubmitting ? (
                <FadeLoader
                  width={3}
                  height={10}
                  margin={-10}
                  className="ml-8 mt-3"
                />
              ) : (
                <Button type="submit">Salvar Estilo</Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      )
    </Crud>
  );
}
