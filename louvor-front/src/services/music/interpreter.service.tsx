import { Interpreter } from "@/models/music/interpreter.model";
import { constants } from "../../constants";
import { CrudService } from "../crud.service";

export class InterpreterService extends CrudService<Interpreter, Interpreter> {
  override domain() {
    return constants.domains.music.name;
  }

  override route() {
    return constants.domains.music.routes.interpreters;
  }
}
