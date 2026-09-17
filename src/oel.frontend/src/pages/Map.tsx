import { useMemo } from "react";

import { useBeer } from "@/api/hooks/useBeer";
import { useBeerLogs } from "@/api/hooks/useBeerLogs";
import { BeerLogMap } from "@/components/map/BeerLogMap";
import { EmptyState, ErrorState } from "@/components/shared/QueryState";
import { Skeleton } from "@/components/ui/skeleton";

export default function MapPage() {
  const { beerLogs } = useBeerLogs();
  const { beers } = useBeer();
  const beersById = useMemo(
    () => new Map(beers.data?.map((beer) => [beer.id, beer])),
    [beers.data],
  );
  const mappedLogs = useMemo(
    () => beerLogs.data?.filter(hasValidCoordinates) ?? [],
    [beerLogs.data],
  );

  const description = beerLogs.isSuccess && beers.isSuccess
    ? `${mappedLogs.length} ${mappedLogs.length === 1 ? "Moment" : "Momente"} auf der Karte`
    : "Deine Bier-Momente an ihren Orten";

  return (
    <main className="flex h-full min-h-136 flex-col px-4 py-6 sm:px-8 sm:py-10">
      <header className="shrink-0 text-left">
        <p className="mb-1 text-sm font-semibold uppercase tracking-[0.16em] text-primary">Orte</p>
        <h1 className="m-0 text-3xl font-semibold sm:text-4xl">Karte</h1>
        <p className="mt-2 text-base text-muted-foreground">{description}</p>
      </header>

      <section className="mt-5 min-h-80 flex-1 overflow-hidden rounded-3xl border bg-card shadow-sm" aria-label="Bier-Log-Karte">
        {beerLogs.isPending || beers.isPending ? (
          <Skeleton className="h-full min-h-80 w-full rounded-none" aria-label="Karte wird geladen" />
        ) : beerLogs.isError || beers.isError ? (
          <div className="flex h-full min-h-80 items-center p-4"><ErrorState /></div>
        ) : mappedLogs.length === 0 ? (
          <div className="flex h-full min-h-80 items-center p-4">
            <EmptyState
              title="Noch keine Orte auf der Karte"
              description="Füge einem Bier-Log Koordinaten hinzu, damit es hier erscheint."
            />
          </div>
        ) : (
          <BeerLogMap logs={mappedLogs} beersById={beersById} />
        )}
      </section>
    </main>
  );
}

function hasValidCoordinates(log: { location: { latitude: number | null; longitude: number | null } | null }) {
  const latitude = log.location?.latitude;
  const longitude = log.location?.longitude;

  return latitude !== null && latitude !== undefined
    && longitude !== null && longitude !== undefined
    && Number.isFinite(latitude) && Number.isFinite(longitude)
    && latitude >= -90 && latitude <= 90
    && longitude >= -180 && longitude <= 180;
}
