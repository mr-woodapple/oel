import { Plus } from "lucide-react";

import { useBeer } from "@/api/hooks/useBeer";
import { useBeerLogs } from "@/api/hooks/useBeerLogs";
import { BeerLogListItem } from "@/components/beerlogs/BeerLogListItem";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { Button } from "@/components/ui/button";
import { ItemGroup } from "@/components/ui/item";
import { useAppActions } from "@/contexts/appActions";

export default function BeerLogs() {
  const { beerLogs } = useBeerLogs();
  const { beers } = useBeer();
  const { openAddBeerLog } = useAppActions();
  const beersById = new Map(beers.data?.map((beer) => [beer.id, beer]));

  return (
    <main className="min-h-full px-4 py-6 sm:px-8 sm:py-10">
      <PageHeader
        eyebrow="Journal"
        title="Bier-Logs"
        description={beerLogs.isSuccess ? `${beerLogs.data.length} ${beerLogs.data.length === 1 ? "Moment" : "Momente"} festgehalten` : "Deine Verkostungen in zeitlicher Reihenfolge"}
        actions={(
          <Button className="h-11 rounded-xl px-4 text-sm" onClick={() => openAddBeerLog()}>
            <Plus /> Log hinzufügen
          </Button>
        )}
      />

      <section className="mt-6" aria-label="Bier-Logs">
        {beerLogs.isPending || beers.isPending ? (
          <ListSkeleton />
        ) : beerLogs.isError || beers.isError ? (
          <ErrorState />
        ) : beerLogs.data.length === 0 ? (
          <EmptyState title="Noch keine Bier-Logs" description="Halte fest, wann und wo du dein nächstes Bier trinkst." />
        ) : (
          <ItemGroup className="gap-3">
            {beerLogs.data.map((log) => (
              <BeerLogListItem key={log.id} log={log} beer={beersById.get(log.beerId)} />
            ))}
          </ItemGroup>
        )}
      </section>
    </main>
  );
}
