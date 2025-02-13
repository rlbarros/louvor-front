import { ApiResponse } from "@/models/app/api-response.model";
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

  public async save(record: T): Promise<ApiResponse<T>> {
    const options = this.crudOptions("POST", record);
    const apiReponse = (await fetch(this.apiPath(), options).then((r) =>
      r.json()
    )) as ApiResponse<T>;
    return apiReponse;
  }

  public async id(id: number): Promise<T> {
    const options = super.options("GET");
    const apiResponse = (await fetch(this.apiIdPath(id), options).then((r) =>
      r.json()
    )) as ApiResponse<T>;
    return apiResponse.content;
  }

  public async delete(id: number): Promise<ApiResponse<T>> {
    const options = super.options("DELETE");
    const apiResponse = (await fetch(this.apiIdPath(id), options).then((r) =>
      r.json()
    )) as ApiResponse<T>;
    return apiResponse;
  }
}
