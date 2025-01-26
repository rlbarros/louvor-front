import { Service } from "@/models/services/service.model";
import { ServiceService } from "@/services/service/service.service";
import { useEffect, useState } from "react";
import { z } from "zod";
import HomeHeader from "@/components/home-header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { FadeLoader } from "react-spinners";
import HomeDataTable from "@/components/home-data-table";
import { ServiceTypeService } from "@/services/service/service-type.service";
import { ServiceType } from "@/models/services/service-type.model";
import _ from "lodash";

const serviceSchema = z.object({
  day: z.date(),
  service_type_id: z.string(),
});

const serviceService = new ServiceService();
const serviceTypeService = new ServiceTypeService();

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [servicesTypes, setServicesTypes] = useState<ServiceType[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [suggestId, setSuggestId] = useState(0);

  const form = useForm<Service>({
    resolver: zodResolver(serviceSchema),
  });

  const dayWatch = form.watch("day");

  useEffect(() => {
    const updateForm = _.debounce((day: Date) => {
      if (!day) {
        return;
      }
      const service = services.find((item) => {
        if (typeof item.day == "string") {
          if (typeof day == "string") {
            return item.day == day;
          } else {
            return item.day == new Date(day).toISOString();
          }
        }
        return item.day.toISOString() == day.toISOString();
      });
      if (service) {
        const formValues = form.getValues();
        if (formValues && formValues.id != service.id) {
          form.setValue("id", service.id);
          form.setValue("service_type_id", service.service_type_id);
        }
      } else {
        form.setValue("id", 0);
        if (servicesTypes && servicesTypes.length > 0) {
          form.setValue("service_type_id", servicesTypes[0].id);
        }
      }
    }, 300);

    if (dayWatch) {
      updateForm(dayWatch);
    }
  }, [dayWatch, services, servicesTypes, form]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedServicesTypes = await serviceTypeService.list();
      if (fetchedServicesTypes) {
        setServicesTypes(fetchedServicesTypes);
      }

      const fetchedServices = await serviceService.list();
      if (fetchedServices) {
        setServices(fetchedServices);

        const orderedByDescendingDayServices = fetchedServices.sort((a, b) => {
          return b.day > a.day ? 1 : -1;
        });

        if (orderedByDescendingDayServices.length > 0) {
          const lastService = orderedByDescendingDayServices[0];
          form.setValue("id", lastService.id);
          form.setValue("day", new Date(lastService.day));
          form.setValue("service_type_id", lastService.service_type_id);

          setIsPending(false);
        } else {
          setIsPending(false);
        }
      }
    };

    fetchData();
  }, [form]);

  function inferMusics(id: number) {
    setSuggestId(id);
  }

  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Cultos</h2>
          {!isPending && (
            <HomeHeader
              form={form}
              services={services}
              servicesTypes={servicesTypes}
              serviceService={serviceService}
              inferMusics={inferMusics}
            />
          )}
          <FadeLoader loading={isPending} />
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          {!isPending && (
            <HomeDataTable
              form={form}
              suggestId={suggestId}
              setSuggestId={setSuggestId}
              services={services}
              setServices={setServices}
            />
          )}
        </div>
      </div>
    </>
  );
}
