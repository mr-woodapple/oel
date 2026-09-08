import { ArrowLeft, Beer as BeerIcon, Pencil, Plus } from "lucide-react";
import { Link, useParams } from "react-router";

import { useBeer } from "@/api/hooks/useBeer";
import { useBeerLogs } from "@/api/hooks/useBeerLogs";
import { BeerLogListItem } from "@/components/beerlogs/BeerLogListItem";
import { ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemGroup } from "@/components/ui/item";
import { useAppActions } from "@/contexts/appActions";

export default function Beer() {
  const { beerId } = useParams();
  const numericBeerId = Number(beerId);
  const { beers } = useBeer();
  const { beerLogs } = useBeerLogs();
  const { openAddBeerLog, openEditBeer } = useAppActions();
  const beer = beers.data?.find((candidate) => candidate.id === numericBeerId);
  const logs = beerLogs.data?.filter((log) => log.beerId === numericBeerId) ?? [];

  if (beers.isPending || beerLogs.isPending) {
    return <main className="min-h-full px-4 py-6 sm:px-8 sm:py-10"><ListSkeleton /></main>;
  }

  if (beers.isError || beerLogs.isError) {
    return <main className="min-h-full px-4 py-6 sm:px-8 sm:py-10"><ErrorState /></main>;
  }

  if (!beer) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center px-6 text-center">
        <h1 className="m-0! text-3xl! font-semibold text-foreground">Bier nicht gefunden</h1>
        <Button render={<Link to="/beers" />} variant="outline" className="mt-5 h-11 rounded-xl px-4 text-sm">
          Zurück zu den Bieren
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-full px-4 py-6 sm:px-8 sm:py-10">
      <Link to="/beers" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Alle Biere
      </Link>

      <header className="flex flex-col gap-5 border-b border-border/70 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-4 text-left">
          <div className="mt-1 flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <BeerIcon className="size-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">{beer.brewery}</p>
            <h1 className="m-0! mt-1! text-3xl! font-semibold tracking-tight text-foreground sm:text-4xl!">{beer.name}</h1>
            <p className="mt-2 text-base text-muted-foreground">{beer.style}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="h-11 rounded-xl px-4 text-sm" onClick={() => openEditBeer(beer)}>
            <Pencil /> Bearbeiten
          </Button>
          <Button className="h-11 rounded-xl px-4 text-sm" onClick={() => openAddBeerLog(beer.id)}>
            <Plus /> Log hinzufügen
          </Button>
        </div>
      </header>

      {beer.photoUrl && (
        <img
          src={beer.photoUrl}
          alt={`${beer.name} von ${beer.brewery}`}
          className="mt-6 aspect-[16/9] max-h-[32rem] w-full rounded-2xl border bg-muted object-cover shadow-sm"
        />
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)]">
        <section className="grid content-start gap-5" aria-label="Bierdetails">
          <Card className="rounded-2xl text-base shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Steckbrief</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge className="rounded-full" variant="secondary">{beer.style}</Badge>
              {beer.abv !== null && <Badge className="rounded-full" variant="outline">{beer.abv}% vol.</Badge>}
              {beer.ibu !== null && <Badge className="rounded-full" variant="outline">{beer.ibu} IBU</Badge>}
            </CardContent>
          </Card>

          {(beer.appearance || beer.tastingNotes || beer.generalNotes) && (
            <Card className="rounded-2xl text-base shadow-sm">
              <CardHeader><CardTitle className="text-lg">Notizen</CardTitle></CardHeader>
              <CardContent className="grid gap-5 text-left">
                {beer.appearance && <Note title="Aussehen" text={beer.appearance} />}
                {beer.tastingNotes && <Note title="Geschmack" text={beer.tastingNotes} />}
                {beer.generalNotes && <Note title="Allgemein" text={beer.generalNotes} />}
              </CardContent>
            </Card>
          )}
        </section>

        <section aria-label="Logs zu diesem Bier">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="m-0! text-xl! font-semibold text-foreground">Bier-Logs</h2>
            <span className="text-sm text-muted-foreground">{logs.length}</span>
          </div>
          {logs.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-6 text-left text-base text-muted-foreground">
              Dieses Bier hat noch keinen Log.
            </div>
          ) : (
            <ItemGroup className="gap-3">
              {logs.map((log) => <BeerLogListItem key={log.id} log={log} beer={beer} />)}
            </ItemGroup>
          )}
        </section>
      </div>
    </main>
  );
}

function Note({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 whitespace-pre-wrap text-base text-muted-foreground">{text}</p>
    </div>
  );
}
