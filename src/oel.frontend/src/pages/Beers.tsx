import { Plus } from "lucide-react";

import { useBeer } from "@/api/hooks/useBeer";
import { BeerListItem } from "@/components/beers/BeerListItem";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { Button } from "@/components/ui/button";
import { ItemGroup } from "@/components/ui/item";
import { useAppActions } from "@/contexts/appActions";

export default function Beers() {
  const { beers } = useBeer();
  const { openAddBeer } = useAppActions();

  return (
    <main className="min-h-full px-4 py-6 sm:px-8 sm:py-10">
      <PageHeader
        eyebrow="Sammlung"
        title="Biere"
        description={beers.isSuccess ? `${beers.data.length} ${beers.data.length === 1 ? "Bier" : "Biere"} in deiner Sammlung` : "Deine bisher probierten Biere"}
        actions={(
          <Button className="h-11 rounded-xl px-4 text-sm" onClick={openAddBeer}>
            <Plus /> Bier hinzufügen
          </Button>
        )}
      />

      <section className="mt-6" aria-label="Bier-Sammlung">
        {beers.isPending ? (
          <ListSkeleton />
        ) : beers.isError ? (
          <ErrorState />
        ) : beers.data.length === 0 ? (
          <EmptyState title="Noch keine Biere" description="Füge dein erstes Bier hinzu und starte deine Sammlung." />
        ) : (
          <ItemGroup className="gap-3">
            {beers.data.map((beer) => <BeerListItem key={beer.id} beer={beer} />)}
          </ItemGroup>
        )}
      </section>
    </main>
  );
}
