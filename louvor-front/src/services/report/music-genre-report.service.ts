import { ReportItem } from "@/models/report/report-item.model";
import { constants } from "../../constants";
import { ListService } from "../list.service";

export class GenreReportService extends ListService<ReportItem> {
    override domain() {
        return constants.domains.report.name;
    }

    override route() {
        return constants.domains.report.routes.musicsByGenre;
    }
}
