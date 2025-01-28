// import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Edit, Ellipsis, Loader2, Trash } from "lucide-react";
import { CrudService } from "@/services/crud.service";
import { Identifiable } from "@/models/app/identifiable.model";
import { useEffect, useState } from "react";

interface DataTableRowActionsProps<TData, T, V> {
  row: Row<TData>;
  crudService: CrudService<T, V>;
  editVisible: boolean;
  handleEdit: (id: number) => void;
  notifyDelete: (object: T) => void;
}

export function DataTableRowActions<TData, T, V>({
  row,
  crudService,
  editVisible = true,
  handleEdit,
  notifyDelete,
}: DataTableRowActionsProps<TData, T, V>) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const object = row.original as Identifiable;
  function editRecord() {
    handleEdit(object.id);
  }

  function handleDeleteClick() {
    setIsPending(true);
  }

  useEffect(() => {
    const deleteRecord = async () => {
      const deleteObject = await crudService.delete(object.id);
      notifyDelete(deleteObject);
      setIsPending(false);
    };

    if (isPending) {
      deleteRecord();
    }
  }, [isPending, crudService, notifyDelete, object]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Ellipsis className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          style={editVisible ? {} : { display: "none" }}
          onClick={editRecord}
        >
          <div className="flex flew-row gap-4">
            Editar <Edit className="ml-14" />
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDeleteClick}
          className="cursor-pointer"
        >
          <div className="flex flew-row gap-4">
            Deletar <Trash className="ml-12" />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
