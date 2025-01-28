import { CrudMode } from "./contexts";

export function getDialogTitle(crudMode: CrudMode) {
  return crudMode == "save" ? "Adicionar" : "Editar";
}
