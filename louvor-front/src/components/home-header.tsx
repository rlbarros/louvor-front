import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ServiceType } from "@/models/services/service-type.model";
import { Service } from "@/models/services/service.model";
import { format } from "date-fns";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { UseFormReturn } from "react-hook-form";
import { PopoverClose } from "@radix-ui/react-popover";
import { useState } from "react";
import { ptBR } from "date-fns/locale";
import { ServiceService } from "@/services/service/service.service";

interface HomeHeaderProps {
  form: UseFormReturn<Service>;
  services: Service[];
  servicesTypes: ServiceType[];
  serviceService: ServiceService;
  inferMusics: (id: number) => void;
}

export default function HomeHeader({
  form,
  services,
  servicesTypes,
  serviceService,
  inferMusics,
}: HomeHeaderProps) {
  const [open, setOpen] = useState<boolean>(false);

  function scheculedDays() {
    return services.map((item) => {
      return new Date(item.day);
    });
  }

  async function save(data: Service) {
    const serviceDay = services.find(
      (i) => new Date(i.day).toISOString() == data.day.toISOString()
    );
    let isNew = false;
    if (serviceDay) {
      data.id = serviceDay.id;
    } else {
      isNew = true;
      data.id = 0;
    }
    const apiResponse = await serviceService.save(data);
    const newRecord = apiResponse.content;
    if (isNew) {
      services.push(newRecord);
    } else {
      const index = services.findIndex((i) => i.id == newRecord.id);
      services[index] = newRecord;
    }
    return newRecord;
  }

  async function formSubmit(data: Service) {
    const serviceDay = services.find(
      (i) => new Date(i.day).toISOString() == data.day.toISOString()
    );
    if (serviceDay) {
      if (Number(serviceDay.service_type_id) == Number(data.service_type_id)) {
        return;
      }
    }

    const newRecord = await save(data);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(newRecord, null, 2)}
          </code>
        </pre>
      ),
    });
  }

  function orderedServices() {
    return services.sort((a, b) => {
      return a.day > b.day ? 1 : -1;
    });
  }

  function moveLeft() {
    const values = form.getValues();
    if (values) {
      const day = values.day;
      const servicesBefore = orderedServices().filter(
        (item) => new Date(item.day).toISOString() < day.toISOString()
      );
      if (servicesBefore.length == 0) {
        toast({
          title: "limite atingido",
          description: "não existem cultos anteriores",
        });
        return;
      }
      const lastServiceOfBefore = servicesBefore[servicesBefore.length - 1];
      form.setValue("id", lastServiceOfBefore.id);
      form.setValue("day", new Date(lastServiceOfBefore.day));
      form.setValue("service_type_id", lastServiceOfBefore.service_type_id);
    }
  }

  function moveRight() {
    const values = form.getValues();
    if (values) {
      const day = values.day;
      const servicesAfter = orderedServices().filter(
        (item) => new Date(item.day).toISOString() > day.toISOString()
      );
      if (servicesAfter.length == 0) {
        toast({
          title: "limite atingido",
          description: "não existem cultos posteriores",
        });
        return;
      }
      const firstServiceOfAfter = servicesAfter[0];
      form.setValue("id", firstServiceOfAfter.id);
      form.setValue("day", new Date(firstServiceOfAfter.day));
      form.setValue("service_type_id", firstServiceOfAfter.service_type_id);
    }
  }

  const handleSubmit = form.handleSubmit;

  async function handleSuggestClick() {
    let service = form.getValues();
    if (service) {
      const id = service.id;
      if (id == 0) {
        service = await save(service);
      }
      inferMusics(service.id);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(formSubmit)}>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data do Culto</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Escolha uma data</span>
                            )}
                            <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(newValue) => {
                            field.onChange(newValue);
                            if (newValue) {
                              form.setValue("day", newValue);
                              const service = services.find(
                                (item) =>
                                  new Date(item.day).toISOString() ==
                                  newValue.toISOString()
                              );
                              if (service) {
                                form.setValue("id", service.id);
                                form.setValue(
                                  "service_type_id",
                                  service.service_type_id
                                );
                              } else {
                                form.setValue("id", 0);
                                form.setValue("service_type_id", 1);
                              }
                            }

                            setOpen(false);
                          }}
                          disabled={(date) => date < new Date("1900-01-01")}
                          modifiers={{
                            scheduled: scheculedDays(),
                          }}
                          modifiersClassNames={{
                            scheduled: "bg-accent rounded-[50%]",
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      O dia em que aconterá o culto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row w-[240px]">
                <Button variant="outline" size="icon" onClick={moveLeft}>
                  <ChevronLeft />
                </Button>
                <span className="flex-1" />
                <Button variant="outline" size="icon" onClick={moveRight}>
                  <ChevronRight />
                </Button>
              </div>
            </div>
            <div className="aspect-video rounded-xl">
              <FormField
                control={form.control}
                name="service_type_id"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tipo de culto</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[250px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? servicesTypes.find(
                                    (serviceType) =>
                                      serviceType.id == field.value
                                  )?.name
                                : "Escolha um tipo de culto"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-0">
                          <Command>
                            <CommandInput placeholder="Pesquise um tipo de culto" />
                            <CommandList>
                              <CommandEmpty>
                                Tipo de culto não encontrado.
                              </CommandEmpty>
                              <PopoverClose asChild>
                                <CommandGroup>
                                  {servicesTypes?.map((serviceType) => (
                                    <CommandItem
                                      value={serviceType.name}
                                      key={`${serviceType.id}`}
                                      onSelect={() => {
                                        form.setValue(
                                          "service_type_id",
                                          serviceType.id
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          serviceType.id == field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {serviceType.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </PopoverClose>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        o tipo de culto define a quantidade de músicas no
                        planjamento de repertório
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div
              className="aspect-video rounded-xl items-top flex-row gap-4"
              style={{ paddingTop: "1.5rem" }}
            >
              <Button type="submit">Salvar</Button>
              <Button
                className="ml-4"
                variant="secondary"
                onClick={handleSuggestClick}
              >
                Sugerir
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
