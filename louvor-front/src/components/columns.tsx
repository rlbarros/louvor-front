import { ColumnDef, Row } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Label } from "@/models/app/label.model";
import { Identifiable } from "@/models/app/identifiable.model";
import { constants } from "@/constants";
import { CrudService } from "@/services/crud.service";
import { LabelDefinition } from "@/models/app/label-definition.model";
import { isNumber } from "lodash";

function filter<V>(row: Row<V>, id: string, value: string): boolean {
  const rowValue = row.getValue(id);
  if (typeof rowValue == "string") {
    return (rowValue as string).toLowerCase().includes(value.toLowerCase());
  }
  return false;
}

export default function getColumns<
  T extends Identifiable,
  V extends Identifiable
>(
  labelDefinition: LabelDefinition,
  crudService: CrudService<T, V>,
  record: V,
  propertyMap: Map<string, string>,
  selectVisible: boolean = false,
  editVisible: boolean,
  notifyDelete: (object: T) => void
): ColumnDef<V>[] {
  const columnsDefs: ColumnDef<V>[] = [];

  if (selectVisible) {
    columnsDefs.push({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    });
  }

  for (const property in record) {
    let title = "";
    if (propertyMap.has(property)) {
      const value = propertyMap.get(property);
      if (value) {
        title = value;
      }
    }

    if (property == "id") {
      columnsDefs.push({
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="#" />
        ),
        cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
        enableSorting: false,
        enableHiding: false,
      });
    } else if (property == labelDefinition?.labelContainer) {
      columnsDefs.push({
        accessorKey: property,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={title} />
        ),
        cell: ({ row }) => {
          let labelValue: string | number = 0;
          let labelLabel: string | number = "";
          const record = row.original;
          if (record) {
            if (labelDefinition?.labelColumnValue in record) {
              labelValue = (record as Record<string, number | string>)[
                labelDefinition?.labelColumnValue
              ];
            }
            if (labelDefinition?.labelColumnLabel in record) {
              labelLabel = (record as Record<string, number | string>)[
                labelDefinition?.labelColumnLabel
              ];
            }
          }

          const label = {
            value: labelValue,
            label: labelLabel,
          } as Label;

          let variant: "outline" | "default" = "outline";
          if (isNumber(labelValue)) {
            if (labelValue % 2 == 0) {
              variant = "default";
            }
          }

          return (
            <div className="flex space-x-2">
              {label && (
                <Badge variant={variant} key={label.value}>
                  {label.label}
                </Badge>
              )}
              <span className="max-w-[500px] truncate font-medium">
                {row.getValue(property)}
              </span>
            </div>
          );
        },
        filterFn: filter,
      });
    } else if (property == labelDefinition?.labelColumnValue) {
      continue;
    } else if (property == labelDefinition?.labelColumnLabel) {
      continue;
    } else if (property.endsWith(constants._id)) {
      continue;
    } else {
      columnsDefs.push({
        accessorKey: property,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={title} />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex items-center">
              <span>{row.getValue(property)}</span>
            </div>
          );
        },
        filterFn: filter,
      });
    }
  }

  columnsDefs.push({
    id: "actions",
    cell: ({ row }) => {
      return (
        <DataTableRowActions
          row={row}
          crudService={crudService}
          editVisible={editVisible}
          notifyDelete={notifyDelete}
        />
      );
    },
  });

  return columnsDefs;
}
