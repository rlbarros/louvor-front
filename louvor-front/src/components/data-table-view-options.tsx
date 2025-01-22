import { Table } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Settings2 } from "lucide-react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  propertyMap: Map<string, string>;
}

export function DataTableViewOptions<TData>({
  table,
  propertyMap,
}: DataTableViewOptionsProps<TData>) {
  return (
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
  );
}
