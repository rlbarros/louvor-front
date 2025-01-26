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

    let serviceId = idWatch;
    if (serviceId == 0) {
      const values = form.getValues();
      if (!values) {
        return;
      }
      const newService = await serviceService.save(values);
      serviceId = newService.id;
      services.push(newService);
      setServices(services);
    }

    const { interpreter, genre, style } = music;
    const serviceMusic = {
      id: 0,
      service_id: serviceId,
      music_id: music.id,
      music: music.name,
      interpreter,
      genre,
      style,
    } as ServiceMusic;
    const newServiceMusic = await serviceMusicService.save(serviceMusic);
    servicesMusics.push(newServiceMusic as ServiceMusicView);
    setServicesMusics(servicesMusics);
    setIsPending(false);
    form.setValue("id", serviceId);
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
