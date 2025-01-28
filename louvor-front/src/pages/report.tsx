import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ReportItem } from "@/models/report/report-item.model";
import { GenreReportService } from "@/services/report/music-genre-report.service";
import { InterpreterReportService } from "@/services/report/music-interpreter-report.service";
import { getChartConfig } from "@/utils/chart.util";
import { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";
import { Pie, PieChart } from "recharts";

export default function Report() {
  const [isPending, setIsPending] = useState<boolean>(true);
  const [genresGroups, setGenreGroups] = useState<ReportItem[]>([]);
  const [interpretersGroups, setInterpretersGroups] = useState<ReportItem[]>(
    []
  );
  const [chartConfigGenres, setChartConfigGenres] = useState<ChartConfig>({});
  const [chartConfigInterpreters, setChartConfigInterpreters] =
    useState<ChartConfig>({});

  useEffect(() => {
    const genreReportService = new GenreReportService();
    const interpreterReportService = new InterpreterReportService();

    const fetchData = async () => {
      const fetchedGenreReports = await genreReportService.list();
      if (fetchedGenreReports) {
        setIsPending(false);
        const chartConfig = getChartConfig(fetchedGenreReports);
        setChartConfigGenres(chartConfig);
        setGenreGroups(fetchedGenreReports);
      }

      const fetchedInterpreters = await interpreterReportService.list();
      if (fetchedInterpreters) {
        setIsPending(false);
        const chartConfig = getChartConfig(fetchedInterpreters);
        setChartConfigInterpreters(chartConfig);
        setInterpretersGroups(fetchedInterpreters);
      }
    };

    fetchData();
  }, []);

  return isPending && chartConfigGenres ? (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex w-full items-center">
      <FadeLoader
        color="#FFFFFF"
        width={2}
        height={10}
        margin={-5}
        loading={isPending}
      />
    </div>
  ) : (
    <div className="grid grid-cols2">
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Musicas Tocadas Por Intérprete</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfigGenres}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={genresGroups} dataKey="count" nameKey="name" label />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Musicas Tocadas Por Intérprete</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfigInterpreters}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={interpretersGroups} dataKey="count" nameKey="name" />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
