import { Identifiable } from "../app/identifiable.model";

export interface ReportItem extends Identifiable {
  name: string;
  count: number;
  fill?: string;
}
