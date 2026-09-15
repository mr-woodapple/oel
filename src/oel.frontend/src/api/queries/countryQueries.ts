import { queryOptions } from "@tanstack/react-query";

import { fetchApi } from "@/api/api";
import { countryName } from "@/lib/countryFormatting";

export const countryKeys = {
  all: ["countries"] as const,
};

export const countryOptions = queryOptions({
  queryKey: countryKeys.all,
  queryFn: () => fetchApi<string[]>("/country"),
  staleTime: Infinity,
  select: (codes) => codes
    .map((value) => ({ value, label: countryName(value) }))
    .sort((a, b) => a.label.localeCompare(b.label, "de")),
});
