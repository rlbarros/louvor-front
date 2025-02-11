import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { X } from "lucide-react";
import { DataTableViewOptions } from "./data-table-view-options";
import { PropsWithChildren } from "react";
import { UseFormReturn } from "react-hook-form";
import { Identifiable } from "@/models/app/identifiable.model";

interface DataTableToolbarProps<
  T extends Identifiable,
  V extends Identifiable
> {
  form: UseFormReturn<T>;
  table: Table<V>;
  title: string;
  filterColumn: string;
  propertyMap: Map<string, string>;
  setOpenAddDialog: (value: boolean) => void;
}

export function DataTableToolbar<
  T extends Identifiable,
  V extends Identifiable
>({
  form,
  table,
  title,
  filterColumn,
  propertyMap,
  setOpenAddDialog,
  children,
}: PropsWithChildren<DataTableToolbarProps<T, V>>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const placeholder = `filtre ${title.toLowerCase()}...`;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={placeholder}
          value={
            (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Excluir Filtro
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions
        form={form}
        table={table}
        propertyMap={propertyMap}
        setOpenAddDialog={setOpenAddDialog}
      >
        {children}
      </DataTableViewOptions>
    </div>
  );
}
