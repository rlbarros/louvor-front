import { ListService } from "./list.service";

export abstract class CrudService<T, V> extends ListService<V> {
  crudOptions(method: string, record: T) {
    const options = super.options(method);
    const crudOptions = {
      ...options,
      body: JSON.stringify(record),
    };
    return crudOptions;
  }

  private apiIdPath(id: number) {
    return `${super.apiPath()}/${id}`;
  }

  public async save(record: T): Promise<T> {
    const options = this.crudOptions("POST", record);
    return await fetch(this.apiPath(), options).then((r) => r.json());
  }

  public async id(id: number): Promise<T> {
    const options = super.options("GET");
    return await fetch(this.apiIdPath(id), options).then((r) => r.json());
  }

  public async delete(id: number): Promise<T> {
    const options = super.options("DELETE");
    return await fetch(this.apiIdPath(id), options).then((r) => r.json());
  }
}
