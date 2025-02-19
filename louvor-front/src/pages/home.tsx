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
import { AuthContext } from "@/utils/contexts";
import React from "react";

const serviceSchema = z.object({
  day: z.date(),
  service_type_id: z.any(),
  ministry_id: z.any(),
});

const serviceService = new ServiceService();
const serviceTypeService = new ServiceTypeService();

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [servicesTypes, setServicesTypes] = useState<ServiceType[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [suggestId, setSuggestId] = useState(0);
  const currentUser = React.useContext(AuthContext);

  const form = useForm<Service>({
    resolver: zodResolver(serviceSchema),
  });

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
          form.setValue("ministry_id", currentUser.ministry_id);

          setIsPending(false);
        } else {
          setIsPending(false);
        }
      }
    };

    fetchData();
  }, [form, currentUser]);

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
