import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { BEER_API_ROUTE, beerKeys } from "../queries/beerQueries";
import { fetchApi } from "../api";
import type { Beer, CreateBeerInput } from "@/models/Beer";

export function useBeer() {
  const queryClient = useQueryClient();

  // Fetching beers
  const beers = useQuery({
    queryKey: beerKeys.lists(),
    queryFn: async () => {
      const response = await fetchApi<Beer[]>(BEER_API_ROUTE);
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 Minutes
    select: (data) => [...data].sort((a, b) => a.name.localeCompare(b.name))
  });

  // Create beer
  const addBeer = useMutation({
    mutationFn: (newBeer: CreateBeerInput) =>
      fetchApi<Beer>(BEER_API_ROUTE, {
        method: "POST",
        body: JSON.stringify(newBeer),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: beerKeys.all });
      toast.success("Bier hinzugefügt");
    },
    onError: () => {
      toast.error("Bier konnte nicht hinzugefügt werden");
    }
  });

  return {
    beers,
    addBeer
  };
}
