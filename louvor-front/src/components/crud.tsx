import { CrudService } from "@/services/crud.service";
import { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";
import { ZodTypeAny } from "zod";
import getColumns from "./columns";
import { LabelDefinition } from "@/models/app/label-definition.model";
import { Identifiable } from "@/models/app/identifiable.model";
import { DataTable } from "./data-table";

export interface CrudInputs<T extends Identifiable, V extends Identifiable> {
  crudService: CrudService<T, V>;
  schema: ZodTypeAny;
  labelDefintion: LabelDefinition;
  record: V;
  propertyMap: Map<string, string>;
  title: string;
}

export default function Crud<T extends Identifiable, V extends Identifiable>({
  crudService,
  labelDefintion,
  record,
  propertyMap,
  title,
}: CrudInputs<T, V>) {
  const [records, setRecords] = useState<V[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);

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

  const columns = getColumns<T, V>(
    labelDefintion,
    crudService,
    record,
    propertyMap
  );

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
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
      <DataTable
        data={records}
        columns={columns}
        title={title}
        filterColumn="name"
        propertyMap={propertyMap}
        setOpenAddDialog={setOpenAddDialog}
      >
        <span>teste {openAddDialog}</span>
      </DataTable>
    </div>
  );
}
