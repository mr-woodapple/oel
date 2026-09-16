import { ArrowLeft, CalendarDays, MapPin, Pencil } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

import { useBeer } from "@/api/hooks/useBeer";
import { useBeerLogs } from "@/api/hooks/useBeerLogs";
import { Rating } from "@/components/beerlogs/Rating";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { ErrorState, ListSkeleton } from "@/components/shared/QueryState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLocation, formatLogDate, formatServingFormat } from "@/lib/beerFormatting";
import { useAppActions } from "@/contexts/appActions";

export default function BeerLog() {
  const { beerLogId } = useParams();
  const navigate = useNavigate();
  const numericLogId = Number(beerLogId);
  const { beers } = useBeer();
  const { beerLogs, deleteBeerLog } = useBeerLogs();
  const { openEditBeerLog } = useAppActions();
  const log = beerLogs.data?.find((candidate) => candidate.id === numericLogId);
  const beer = beers.data?.find((candidate) => candidate.id === log?.beerId);

  async function handleDelete() {
    if (!log) return;

    try {
      await deleteBeerLog.mutateAsync(log);
      navigate("/logs", { replace: true });
    } catch {
      // The mutation displays the user-facing error toast.
    }
  }

  if (beerLogs.isPending || beers.isPending) {
    return <main className="min-h-full px-4 py-6 sm:px-8 sm:py-10"><ListSkeleton /></main>;
  }

  if (beerLogs.isError || beers.isError) {
    return <main className="min-h-full px-4 py-6 sm:px-8 sm:py-10"><ErrorState /></main>;
  }

  if (!log) {
    return (
      // TODO: This could be nicer, maybe add a broken mug??
      <main className="flex min-h-full flex-col items-center justify-center px-6 text-center">
        <h1 className="m-0 text-3xl font-semibold text-foreground">Bier-Log nicht gefunden</h1>
        <Button render={<Link to="/logs" />} variant="outline" className="mt-5">
          Zurück zu den Bier-Logs
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-full px-4 py-6">
      <Link to="/logs" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Alle Bier-Logs
      </Link>

      <header className="flex flex-col gap-5 text-left sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Bier-Log</p>
          <h1 className="m-0! mt-1! text-3xl! font-semibold tracking-tight text-foreground sm:text-4xl!">
            {beer?.name ?? "Unbekanntes Bier"}
          </h1>
          {beer && <p className="mt-2 text-base text-muted-foreground">{beer.brewery} · {beer.style}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <DeleteConfirmationDialog
            title="Bier-Log endgültig löschen?"
            description="Dieser Bier-Log wird dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden."
            pending={deleteBeerLog.isPending}
            onConfirm={handleDelete}
          />
          <Button variant="outline" className="h-11 rounded-xl px-4 text-sm" onClick={() => openEditBeerLog(log)}>
            <Pencil /> Bearbeiten
          </Button>
        </div>
      </header>

      {log.photoUrl && (
        <img
          src={log.photoUrl}
          alt={`Foto zum Bier-Log${beer ? ` von ${beer.name}` : ""}`}
          className="mt-5 aspect-video max-h-128 w-full rounded-lg bg-muted object-cover"
        />
      )}

      <Card className="mt-5 rounded-lg text-base">
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
