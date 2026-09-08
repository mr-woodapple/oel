import { ArrowLeft, CalendarDays, MapPin, Pencil } from "lucide-react";
import { Link, useParams } from "react-router";

import { useBeer } from "@/api/hooks/useBeer";
import { useBeerLogs } from "@/api/hooks/useBeerLogs";
import { Rating } from "@/components/beerlogs/Rating";
import { ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLocation, formatLogDate, formatServingFormat } from "@/lib/beerFormatting";
import { useAppActions } from "@/contexts/appActions";

export default function BeerLog() {
  const { beerLogId } = useParams();
  const numericLogId = Number(beerLogId);
  const { beers } = useBeer();
  const { beerLogs } = useBeerLogs();
  const { openEditBeerLog } = useAppActions();
  const log = beerLogs.data?.find((candidate) => candidate.id === numericLogId);
  const beer = beers.data?.find((candidate) => candidate.id === log?.beerId);

  if (beerLogs.isPending || beers.isPending) {
    return <main className="min-h-full px-4 py-6 sm:px-8 sm:py-10"><ListSkeleton /></main>;
  }

  if (beerLogs.isError || beers.isError) {
    return <main className="min-h-full px-4 py-6 sm:px-8 sm:py-10"><ErrorState /></main>;
  }

  if (!log) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center px-6 text-center">
        <h1 className="m-0! text-3xl! font-semibold text-foreground">Bier-Log nicht gefunden</h1>
        <Button render={<Link to="/logs" />} variant="outline" className="mt-5 h-11 rounded-xl px-4 text-sm">
          Zurück zu den Bier-Logs
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-full px-4 py-6 sm:px-8 sm:py-10">
      <Link to="/logs" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Alle Bier-Logs
      </Link>

      <header className="flex flex-col gap-5 border-b border-border/70 pb-7 text-left sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Bier-Log</p>
          <h1 className="m-0! mt-1! text-3xl! font-semibold tracking-tight text-foreground sm:text-4xl!">
            {beer?.name ?? "Unbekanntes Bier"}
          </h1>
          {beer && <p className="mt-2 text-base text-muted-foreground">{beer.brewery} · {beer.style}</p>}
        </div>
        <Button variant="outline" className="h-11 rounded-xl px-4 text-sm" onClick={() => openEditBeerLog(log)}>
          <Pencil /> Bearbeiten
        </Button>
      </header>

      {log.photoUrl && (
        <img
          src={log.photoUrl}
          alt={`Foto zum Bier-Log${beer ? ` von ${beer.name}` : ""}`}
          className="mt-6 aspect-[16/9] max-h-[32rem] w-full rounded-2xl border bg-muted object-cover shadow-sm"
        />
      )}

      <Card className="mt-6 rounded-2xl text-base shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Verkostung</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 text-left sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Bewertung</p>
            <Rating value={log.rating} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Serviert als</p>
            <Badge variant="secondary" className="rounded-full">{formatServingFormat(log.format)}</Badge>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Datum</p>
            <p className="flex items-center gap-2 text-base text-foreground">
              <CalendarDays className="size-4 text-primary" /> {formatLogDate(log.dateLogged)}
            </p>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Ort</p>
            <p className="flex items-center gap-2 text-base text-foreground">
              <MapPin className="size-4 text-primary" /> {formatLocation(log.location)}
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
