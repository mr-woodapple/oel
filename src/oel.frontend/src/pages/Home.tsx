import { ArrowRight, Beer, ClipboardList, Plus, Star } from "lucide-react";
import { Link } from "react-router";

import { useBeer } from "@/api/hooks/useBeer";
import { useBeerLogs } from "@/api/hooks/useBeerLogs";
import { BeerLogListItem } from "@/components/beerlogs/BeerLogListItem";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ItemGroup } from "@/components/ui/item";
import { useAppActions } from "@/contexts/appActions";

export default function Home() {
  const { beers } = useBeer();
  const { beerLogs } = useBeerLogs();
  const { openAddBeerLog } = useAppActions();
  const beersById = new Map(beers.data?.map((beer) => [beer.id, beer]));
  const averageRating = beerLogs.data?.length
    ? beerLogs.data.reduce((sum, log) => sum + log.rating, 0) / beerLogs.data.length
    : 0;

  return (
    <main className="min-h-full px-4 py-6 sm:px-8 sm:py-10">
      <PageHeader
        eyebrow="Übersicht"
        title="Dein Bierjournal"
        description="Sammlung und Verkostungen auf einen Blick"
        actions={(
          <Button className="h-11 rounded-xl px-4 text-sm" onClick={() => openAddBeerLog()}>
            <Plus /> Log hinzufügen
          </Button>
        )}
      />

      {beers.isPending || beerLogs.isPending ? (
        <div className="mt-6"><ListSkeleton /></div>
      ) : beers.isError || beerLogs.isError ? (
        <div className="mt-6"><ErrorState /></div>
      ) : (
        <>
          <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Statistik">
            <StatCard icon={<Beer />} label="Biere" value={String(beers.data.length)} />
            <StatCard icon={<ClipboardList />} label="Bier-Logs" value={String(beerLogs.data.length)} />
            <StatCard icon={<Star />} label="Ø Bewertung" value={beerLogs.data.length ? averageRating.toFixed(1) : "–"} className="col-span-2 sm:col-span-1" />
          </section>

          <section className="mt-8" aria-label="Letzte Bier-Logs">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="m-0! text-xl! font-semibold text-foreground">Zuletzt getrunken</h2>
              <Link to="/logs" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                Alle <ArrowRight className="size-4" />
              </Link>
            </div>
            {beerLogs.data.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-6 text-left text-base text-muted-foreground">
                Dein erster Bier-Moment wartet darauf, festgehalten zu werden.
              </div>
            ) : (
              <ItemGroup className="gap-3">
                {beerLogs.data.slice(0, 3).map((log) => (
                  <BeerLogListItem key={log.id} log={log} beer={beersById.get(log.beerId)} />
                ))}
              </ItemGroup>
            )}
          </section>
        </>
      )}
    </main>
  );
}

function StatCard({ icon, label, value, className = "" }: { icon: React.ReactNode; label: string; value: string; className?: string }) {
  return (
    <Card className={`rounded-2xl py-4 shadow-sm ${className}`}>
      <CardContent className="flex items-center gap-3 px-4 text-left">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary [&_svg]:size-5">
          {icon}
        </span>
        <span>
          <span className="block text-2xl font-semibold tracking-tight text-foreground">{value}</span>
          <span className="block text-sm text-muted-foreground">{label}</span>
        </span>
      </CardContent>
    </Card>
  );
}
