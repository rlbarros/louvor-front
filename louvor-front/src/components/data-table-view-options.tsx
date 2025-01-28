import { Table } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CirclePlus, Settings2 } from "lucide-react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { PropsWithChildren, useContext } from "react";
import { CrudContext } from "@/utils/contexts";
import { UseFormReturn } from "react-hook-form";
import { Identifiable } from "@/models/app/identifiable.model";

interface DataTableViewOptionsProps<
  T extends Identifiable,
  V extends Identifiable
> {
  form: UseFormReturn<T>;
  table: Table<V>;
  propertyMap: Map<string, string>;
  setOpenAddDialog: (value: boolean) => void;
}

export function DataTableViewOptions<
  T extends Identifiable,
  V extends Identifiable
>({
  form,
  table,
  propertyMap,
  setOpenAddDialog,
  children,
}: PropsWithChildren<DataTableViewOptionsProps<T, V>>) {
  const crudContextState = useContext(CrudContext);
  const { setCrudMode } = crudContextState;

  function handleAddClick() {
    form.reset();
    setCrudMode("save");
    setOpenAddDialog(true);
  }

  return (
    <div className="flex flex-row gap-4 items-center">
      <Button variant="outline" onClick={handleAddClick}>
        <CirclePlus /> Adicionar
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="hidden w-24 h-8 lg:flex"
          style={{ padding: ".25rem 1rem" }}
        >
          <Settings2 className="mr-2 h-6 w-6" />
          <span className="text-sm">Visão</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Alternar Colunas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              let columnName = column.id;
              if (propertyMap.has(column.id)) {
                const value = propertyMap.get(column.id);
                if (value) {
                  columnName = value;
                }
              }

              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnName}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
      {children}
    </div>
  );
}
