import { ServiceMusic } from "@/models/services/service-music.model";
import { UseFormReturn } from "react-hook-form";
import { DataTable } from "./data-table";
import getColumns from "./columns";
import {
  defaultServiceMusicView,
  ServiceMusicView,
} from "@/models/services/service-music.view";
import { LabelDefinition } from "@/models/app/label-definition.model";
import { useEffect, useState } from "react";
import { Service } from "@/models/services/service.model";
import { ServiceMusicService } from "@/services/service/service-music.service";
import { FadeLoader } from "react-spinners";
import _ from "lodash";

interface HomeDataTableProps {
  form: UseFormReturn<Service>;
}

const serviceMusicService = new ServiceMusicService();

export default function HomeDataTable({ form }: HomeDataTableProps) {
  const [servicesMusics, setServicesMusics] = useState<ServiceMusicView[]>([]);
  const [isPending, setIsPending] = useState(false);

  const propertyMap = new Map<string, string>([
    ["service_type", "tipo de culto"],
    ["music", "núsica"],
    ["genre", "gênero"],
    ["style", "estilo"],
    ["interpreter", "intérprete"],
  ]);

  const labelDefinition = {
    labelContainer: "music",
    labelColumnLabel: "style",
    labelColumnValue: "style",
  } as LabelDefinition;

  const columns = getColumns<ServiceMusic, ServiceMusicView>(
    labelDefinition,
    serviceMusicService,
    defaultServiceMusicView,
    propertyMap
  );

  const idWatch = form.watch("id");

  const title = "Músicas dos Cultos";

  useEffect(() => {
    const updateMusicServices = _.debounce(async (id: number) => {
      console.log("ums", id);
      await fetchData(id);
    });

    const fetchData = async (id: number) => {
      if (id == 0) {
        setServicesMusics([]);
        return;
      }

      setIsPending(true);
      const queryParams = {
        service_id: `${id}`,
      } as Record<string, string>;

      const fetchedServiceMusics = await serviceMusicService.list(queryParams);
      setIsPending(false);
      setServicesMusics(fetchedServiceMusics);
    };

    if (idWatch) {
      updateMusicServices(idWatch);
      return;
    }

    const values = form.getValues();
    let id = 0;
    if (values) {
      id = values.id;
    }

    fetchData(id);
  }, [idWatch, form]);

  return !isPending ? (
    <DataTable
      data={servicesMusics}
      columns={columns}
      title={title}
      filterColumn="music"
      propertyMap={propertyMap}
    />
  ) : (
    <div className="w-full min-h-96 flex items-center justify-center">
      <FadeLoader loading={isPending} color="#FFFFFF" />
    </div>
  );
}
