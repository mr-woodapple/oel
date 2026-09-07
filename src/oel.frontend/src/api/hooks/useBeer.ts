import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { BEER_API_ROUTE, beerKeys } from "../queries/beerQueries";
import { fetchApi } from "../api";
import type { Beer } from "@/models/Beer";

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
    select: (data) => data.sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by name
  });

  // Create beer
  const addBeer = useMutation({
    mutationFn: (newBeer: Omit<Beer, "id">) =>
      fetchApi<Beer>(BEER_API_ROUTE, {
        method: "POST",
        body: JSON.stringify(newBeer),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: beerKeys.all });
      toast.success("Created new account! 🎉");
    },
    onError: () => {
      toast.error("Failed to add account!");
    }
  });

  return {
    beers,
    addBeer
  };
}