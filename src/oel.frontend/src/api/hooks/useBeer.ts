import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { BEER_API_ROUTE, beerKeys } from "../queries/beerQueries";
import { beerLogKeys } from "../queries/beerLogQueries";
import { fetchApi } from "../api";
import type { Beer, CreateBeerInput, UpdateBeerInput } from "@/models/Beer";

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
        body: createBeerFormData(newBeer),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: beerKeys.all });
      toast.success("Bier hinzugefügt");
    },
    onError: () => {
      toast.error("Bier konnte nicht hinzugefügt werden");
    }
  });

  const updateBeer = useMutation({
    mutationFn: (beer: UpdateBeerInput) =>
      fetchApi<Beer>(`${BEER_API_ROUTE}/${beer.id}`, {
        method: "PUT",
        body: createBeerFormData(beer, beer.removePhoto),
      }),
    onSuccess: (updatedBeer) => {
      queryClient.invalidateQueries({ queryKey: beerKeys.all });
      toast.success(`${updatedBeer.name} aktualisiert`);
    },
    onError: () => {
      toast.error("Bier konnte nicht aktualisiert werden");
    },
  });

  const deleteBeer = useMutation({
    mutationFn: (beer: Beer) =>
      fetchApi<void>(`${BEER_API_ROUTE}/${beer.id}`, {
        method: "DELETE",
      }),
    onSuccess: (_response, beer) => {
      queryClient.invalidateQueries({ queryKey: beerKeys.all });
      queryClient.invalidateQueries({ queryKey: beerLogKeys.all });
      toast.success(`${beer.name} gelöscht`);
    },
    onError: () => {
      toast.error("Bier konnte nicht gelöscht werden");
    },
  });

  return {
    beers,
    addBeer,
    updateBeer,
    deleteBeer,
  };
}

function createBeerFormData(beer: CreateBeerInput, removePhoto = false) {
  const formData = new FormData();
  formData.append("name", beer.name);
  formData.append("brewery", beer.brewery);
  formData.append("style", beer.style);

  if (beer.abv !== null) formData.append("abv", String(beer.abv));
  if (beer.ibu !== null) formData.append("ibu", String(beer.ibu));
  if (beer.appearance !== null) formData.append("appearance", beer.appearance);
  if (beer.tastingNotes !== null) formData.append("tastingNotes", beer.tastingNotes);
  if (beer.generalNotes !== null) formData.append("generalNotes", beer.generalNotes);
  if (beer.photo !== null) formData.append("photo", beer.photo);
  if (removePhoto) formData.append("removePhoto", "true");

  return formData;
}
