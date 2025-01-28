import { CrudService } from "@/services/crud.service";
import { PropsWithChildren, useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";
import getColumns from "./columns";
import { LabelDefinition } from "@/models/app/label-definition.model";
import { Identifiable } from "@/models/app/identifiable.model";
import { DataTable } from "./data-table";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { CrudContext, CrudContextState, CrudMode } from "@/utils/contexts";
import { getDialogTitle } from "@/utils/crud.util";
import { Path, PathValue, UseFormReturn } from "react-hook-form";
import { Button } from "./ui/button";
import { Form } from "./ui/form";

export interface CrudInputs<
  T extends Identifiable,
  V extends T | Identifiable
> {
  crudService: CrudService<T, V>;
  form: UseFormReturn<T>;
  labelDefintion: LabelDefinition;
  exampleRecord: V;
  propertyMap: Map<string, string>;
  singularTitle: string;
  pluralTitle: string;
  description: string;
}

export default function Crud<
  T extends Identifiable,
  V extends T | Identifiable
>({
  crudService,
  form,
  labelDefintion,
  exampleRecord,
  propertyMap,
  singularTitle,
  pluralTitle,
  description,
  children,
}: PropsWithChildren<CrudInputs<T, V>>) {
  const [records, setRecords] = useState<V[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [crudMode, setCrudMode] = useState<CrudMode>("save");
  const [crudId, setCrudId] = useState<number>(0);
  const crudModeState = {
    crudMode,
    setCrudMode,
    crudId,
    setCrudId,
  } as CrudContextState;

  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [openAddDialog, setOpenAddDialog] = useState(false);

  useEffect(() => {
    setDialogTitle(getDialogTitle(crudMode));
  }, [crudMode]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedRecords = await crudService.list();
      if (fetchedRecords) {
        setIsPending(false);
        setRecords(fetchedRecords);
      }
    };
    fetchData();
  }, [crudService]);

  async function notifyDelete(object: T) {
    toast({
      title: "registro excluído",
      description: `${singularTitle} ${object.id} excluído`,
    });
    setRecords(records.filter((i) => i.id != object.id));
  }

  const columns = getColumns<T, V>(
    labelDefintion,
    crudService,
    exampleRecord,
    propertyMap,
    false,
    true,
    handleEdit,
    notifyDelete
  );

  async function handleSave(data: T) {
    if (crudMode == "save") {
      data.id = 0;
    } else {
      data.id = crudId;
    }
    await saveData(data);
  }

  async function handleEdit(id: number) {
    const record = await crudService.id(id);
    if (record) {
      setCrudMode("edit");
      setCrudId(id);
      for (const property in record) {
        const path = property as unknown as Path<T>;
        const value = record[property] as unknown as PathValue<T, Path<T>>;
        form.setValue(path, value);
        setOpenAddDialog(true);
      }
    }
  }

  async function saveData(data: T) {
    const newObject = await crudService.save(data);
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

  const { handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{singularTitle}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <FadeLoader
            color="#FFFFFF"
            width={2}
            height={10}
            margin={-5}
            loading={isPending}
          />
        </div>
      </div>
      <CrudContext.Provider value={crudModeState}>
        <DataTable
          form={form}
          data={records}
          columns={columns}
          title={pluralTitle}
          filterColumn="name"
          propertyMap={propertyMap}
          setOpenAddDialog={setOpenAddDialog}
        >
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <Form {...form}>
                <form onSubmit={handleSubmit(handleSave)}>
                  <DialogHeader>
                    <DialogTitle>
                      {dialogTitle} {singularTitle}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">{children}</div>
                  <DialogFooter>
                    {isSubmitting ? (
                      <FadeLoader
                        width={3}
                        height={10}
                        margin={-10}
                        className="ml-8 mt-3"
                      />
                    ) : (
                      <Button type="submit">Salvar {singularTitle}</Button>
                    )}
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </DataTable>
      </CrudContext.Provider>
    </div>
  );
}
