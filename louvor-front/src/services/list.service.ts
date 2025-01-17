import { BaseService } from "./base.service";

export abstract class ListService<T> extends BaseService {
    abstract route(): string;

    override apiPath(): string {
        const apiPath = `${super.apiPath()}/${this.route()}`;
        return apiPath;
    }

    async list(): Promise<T[]> {
        return await fetch(this.apiPath()).then(r => r.json());
    }
}