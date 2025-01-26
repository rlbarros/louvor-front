import { ServiceMusic } from "@/models/services/service-music.model";
import { UseFormReturn } from "react-hook-form";
import { DataTable } from "./data-table";
import getColumns from "./columns";
import {
  defaultServiceMusicView,
  ServiceMusicView,
} from "@/models/services/service-music.view";
import { LabelDefinition } from "@/models/app/label-definition.model";
import { MouseEvent, useEffect, useState } from "react";
import { Service } from "@/models/services/service.model";
import { ServiceMusicService } from "@/services/service/service-music.service";
import { FadeLoader } from "react-spinners";
import _ from "lodash";
import { MusicView } from "@/models/music/music.view";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { DialogDescription, DialogTitle } from "./ui/dialog";
import { MusicService } from "@/services/music/music.service";
import { Badge } from "./ui/badge";

interface HomeDataTableProps {
  form: UseFormReturn<Service>;
  suggestId: number;
  setSuggestId: (id: number) => void;
}

const serviceMusicService = new ServiceMusicService();

export default function HomeDataTable({
  form,
  suggestId,
  setSuggestId,
}: HomeDataTableProps) {
  const [servicesMusics, setServicesMusics] = useState<ServiceMusicView[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [musics, setMusics] = useState<MusicView[]>([]);
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

  useEffect(() => {
    const fetchData = async (id: number) => {
      if (id == 0) {
        setServicesMusics([]);
        return;
      }

      setIsPending(true);
      const queryParams = {
        service_id: `${id}`,
      } as Record<string, string>;

      const fetchedServiceMusics = await serviceMusicService.action(
        queryParams
      );
      setIsPending(false);
      setServicesMusics(fetchedServiceMusics);
      setSuggestId(0);
    };

    if (suggestId > 0) {
      fetchData(suggestId);
    }
  }, [suggestId, setSuggestId]);

  useEffect(() => {
    const fetchData = async () => {
      const musicService = new MusicService();
      const fetchedMusics = await musicService.list();
      setMusics(fetchedMusics);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const commandGroupDiv = document.getElementById("command-group");
        if (commandGroupDiv) {
          const divs = commandGroupDiv.querySelectorAll("[id^='bid-']");
          if (divs.length == 1) {
            console.log(divs[0].id);
            setOpenAddDialog(false);
          }
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  function handleMusicSelect(e: MouseEvent) {
    console.log("teste", e);
    const id = e.currentTarget.id;
    console.log(id);
    setOpenAddDialog(false);
  }

  return !isPending ? (
    <DataTable
      data={servicesMusics}
      columns={columns}
      title={title}
      filterColumn="music"
      propertyMap={propertyMap}
      setOpenAddDialog={setOpenAddDialog}
    >
      <CommandDialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogTitle>
          <DialogDescription>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; digite abaixo
          </DialogDescription>
          <CommandInput placeholder="Escolha uma música..." />
        </DialogTitle>
        <CommandList>
          <CommandEmpty>Sem músicas encontradas.</CommandEmpty>
          <CommandGroup heading="Músicas" id="command-group">
            {musics.map((music) => (
              <CommandItem key={music.id}>
                <Badge
                  className="cursor-pointer"
                  variant="outline"
                  id={`bid-${music.id}`}
                  onClick={(e) => {
                    handleMusicSelect(e);
                  }}
                >
                  {music.name}
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </DataTable>
  ) : (
    <div className="w-full min-h-96 flex items-center justify-center">
      <FadeLoader loading={isPending} color="#FFFFFF" />
    </div>
  );
}
