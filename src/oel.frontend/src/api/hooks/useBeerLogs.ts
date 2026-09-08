import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchApi } from "@/api/api";
import { BEER_LOG_API_ROUTE, beerLogKeys } from "@/api/queries/beerLogQueries";
import type { BeerLog, CreateBeerLogInput } from "@/models/BeerLog";

export function useBeerLogs() {
  const queryClient = useQueryClient();

  const beerLogs = useQuery({
    queryKey: beerLogKeys.lists(),
    queryFn: () => fetchApi<BeerLog[]>(BEER_LOG_API_ROUTE),
    staleTime: 1000 * 60 * 5,
    select: (data) => [...data].sort(
      (a, b) => new Date(b.dateLogged).getTime() - new Date(a.dateLogged).getTime(),
    ),
  });

  const addBeerLog = useMutation({
    mutationFn: (newBeerLog: CreateBeerLogInput) =>
      fetchApi<BeerLog>(BEER_LOG_API_ROUTE, {
        method: "POST",
        body: createBeerLogFormData(newBeerLog),
      }),
    onSuccess: (_createdLog, variables) => {
      queryClient.invalidateQueries({ queryKey: beerLogKeys.all });
      queryClient.invalidateQueries({ queryKey: ["beers", "detail", variables.beerId] });
      toast.success("Bier-Log hinzugefügt");
    },
    onError: () => {
      toast.error("Bier-Log konnte nicht hinzugefügt werden");
    },
  });

  return {
    beerLogs,
    addBeerLog,
  };
}

function createBeerLogFormData(beerLog: CreateBeerLogInput) {
  const formData = new FormData();
  formData.append("beerId", String(beerLog.beerId));
  formData.append("rating", String(beerLog.rating));
  formData.append("format", String(beerLog.format));
  formData.append("dateLogged", beerLog.dateLogged);

  if (beerLog.location !== null) formData.append("location", beerLog.location);
  if (beerLog.photo !== null) formData.append("photo", beerLog.photo);

  return formData;
}
