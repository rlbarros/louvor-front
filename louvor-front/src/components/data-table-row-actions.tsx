// import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Ellipsis } from "lucide-react";
import { CrudService } from "@/services/crud.service";
import { Identifiable } from "@/models/app/identifiable.model";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  crudService: CrudService<Identifiable, Identifiable>;
}

export function DataTableRowActions<TData>({
  row,
  crudService,
}: DataTableRowActionsProps<TData>) {
  const object = row.original as Identifiable;
  function editRecord() {
    window.alert("edit " + object.id);
  }

  async function deleteRecord() {
    const deleteObject = await crudService.delete(object.id);
    window.alert("deleted " + deleteObject.id);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          {/* <DotsHorizontalIcon className="h-4 w-4" /> */}
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={editRecord}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={deleteRecord}>
          Apagar
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
