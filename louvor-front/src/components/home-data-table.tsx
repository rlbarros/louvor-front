import { ServiceMusic } from "@/models/services/service-music.model";
import { UseFormReturn } from "react-hook-form";
import { DataTable } from "./data-table";
import getColumns from "./columns";
import {
  defaultServiceMusicView,
  ServiceMusicView,
} from "@/models/services/service-music.view";
import { LabelDefinition } from "@/models/app/label-definition.model";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
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
import { ServiceService } from "@/services/service/service.service";
import { ApiResponse } from "@/models/app/api-response.model";

interface HomeDataTableProps {
  form: UseFormReturn<Service>;
  suggestId: number;
  setSuggestId: (id: number) => void;
  services: Service[];
  setServices: Dispatch<SetStateAction<Service[]>>;
}

const serviceMusicService = new ServiceMusicService();
const serviceService = new ServiceService();

export default function HomeDataTable({
  form,
  suggestId,
  setSuggestId,
  services,
  setServices,
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
    labelColumnValue: "style_id",
  } as LabelDefinition;

  function notifyDelete(object: ApiResponse<ServiceMusic>) {
    const serviceMusicIndex = servicesMusics.findIndex(
      (item) => item.id == object.content.id
    );

    if (serviceMusicIndex >= 0) {
      servicesMusics.splice(serviceMusicIndex, 1);
      setServicesMusics([]);
      setIsPending(true);
      setTimeout(() => {
        setServicesMusics(servicesMusics);
        setIsPending(false);
      }, 300);
    }
  }

  const columns = getColumns<ServiceMusic, ServiceMusicView>(
    labelDefinition,
    serviceMusicService,
    defaultServiceMusicView,
    propertyMap,
    false,
    false,
    () => {},
    notifyDelete
  );

  const dayWatch = form.watch("day");

  const title = "Músicas dos Cultos";

  useEffect(() => {
    const updateMusicServices = _.debounce(async (day: Date) => {
      await fetchData(day);
    });

    const fetchData = async (day: Date) => {
      const service = services.find(
        (item) => new Date(item.day).toISOString() == day.toISOString()
      );

      setIsPending(true);
      if (service) {
        const queryParams = {
          service_id: `${service.id}`,
        } as Record<string, string>;

        const fetchedServiceMusics = await serviceMusicService.list(
          queryParams
        );
        setServicesMusics(fetchedServiceMusics);
        setIsPending(false);
      } else {
        await setServicesMusics([]);
        setTimeout(() => {
          setIsPending(false);
        }, 300);
      }
    };
    updateMusicServices(dayWatch);
  }, [dayWatch, services]);

  useEffect(() => {
    const fetchData = async (id: number) => {
      if (id == 0) {
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
      form.setValue("id", 0);
      setTimeout(() => {
        form.setValue("id", id);
      }, 50);
    };

    if (suggestId > 0 && !isPending) {
      fetchData(suggestId);
    }
  }, [suggestId, setSuggestId, form, isPending]);

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
            const sid = divs[0].id;
            addMusic(sid);
            setOpenAddDialog(false);
          }
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  });

  function handleMusicSelect(e: MouseEvent) {
    const sid = e.currentTarget.id;
    addMusic(sid);
    setOpenAddDialog(false);
  }

  async function addMusic(sid: string) {
    setIsPending(true);
    const id = Number(sid.replace("bid-", ""));
    const music = musics.find((i) => i.id == id);
    if (!music) {
      setIsPending(false);
      return;
    }

    let serviceId = form.getValues().id;
    if (serviceId == 0) {
      const values = form.getValues();
      if (!values) {
        return;
      }
      const newService = (await serviceService.save(values)).content;
      serviceId = newService.id;
      services.push(newService);
      setServices(services);
    }

    const { interpreter, genre, style, name } = music;
    const serviceMusic = {
      id: 0,
      service_id: serviceId,
      music_id: music.id,
    } as ServiceMusic;
    const newServiceMusic = (await serviceMusicService.save(serviceMusic))
      .content;
    const newServiceMusicView = {
      ...newServiceMusic,
      genre,
      interpreter,
      style,
      music: name,
    } as ServiceMusicView;
    servicesMusics.push(newServiceMusicView);
    setServicesMusics(servicesMusics);
    setIsPending(false);
    form.setValue("id", serviceId);
  }

  return !isPending ? (
    <DataTable
      form={form}
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
                <div
                  className="cursor-pointer flex w-full"
                  id={`bid-${music.id}`}
                  onClick={(e) => {
                    handleMusicSelect(e);
                  }}
                >
                  <Badge>{music.style}</Badge>
                  <Badge variant="outline">{music.interpreter}</Badge>

                  {music.name}
                </div>
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
