import { constants } from "../constants";

export abstract class BaseService {
  ApiBaseUrl = "https://louvor-api.ieabrasil.org.br"; //import.meta.env.VITE_API_BASE_URL;

  abstract domain(): string;

  apiPath(): string {
    let path = "";
    if (this.ApiBaseUrl) {
      path += `${this.ApiBaseUrl}/`;
    }
    return `${path}${constants.api}/${this.domain()}`;
  }
}
