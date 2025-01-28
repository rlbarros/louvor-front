import { ChartConfig } from "@/components/ui/chart";
import { ReportItem } from "@/models/report/report-item.model";

const colors = [
  "#F0D3F7",
  "#B98EA7",
  "#A57982",
  "#302F4D",
  "#120D31",
  "#9B8816",
  "#F98948",
  "#5D3A00",
  "#684E32",
  "#F9EA9A",
  "#ADD7F6",
  "#87BFFF",
  "#3F8EFC",
  "#2667FF",
  "#3B28CC",
  "#FB3640",
  "#605F5E",
  "#1D3461",
  "#1F487E",
  "#247BA0",
  "#93B5C6",
  "#DDEDAA",
  "#F0CF65",
  "#D7816A",
  "#BD4F6C",
  "#AEFFD8",
  "#8AFFC1",
  "#8FDC97",
  "#AC8887",
  "#9F4A54",
];

export function getChartConfig(records: ReportItem[]) {
  const chartConfig: ChartConfig = {};
  records.forEach((r, index) => {
    const color = colors[index];
    r.fill = color;
    chartConfig[r.name] = {
      label: r.name,
      color: color,
    };
  });
  return chartConfig;
}
