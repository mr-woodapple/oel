import { AlertCircle, Beer as BeerIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

export function ListSkeleton() {
  return (
    <div className="grid gap-3" aria-label="Inhalte werden geladen">
      {[0, 1, 2].map((item) => (
        <div key={item} className="rounded-2xl border bg-card p-5">
          <Skeleton className="h-5 w-2/5 rounded-md" />
          <Skeleton className="mt-3 h-4 w-3/5 rounded-md" />
        </div>
      ))}
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed bg-card/70 px-6 py-12 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <BeerIcon className="size-6" />
      </div>
      <h2 className="m-0! text-xl! font-semibold text-foreground">{title}</h2>
      <p className="mt-2 max-w-sm text-base text-muted-foreground">{description}</p>
    </div>
  );
}

export function ErrorState() {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-3xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
      <AlertCircle className="mb-3 size-7 text-destructive" />
      <h2 className="m-0! text-xl! font-semibold text-foreground">Daten konnten nicht geladen werden</h2>
      <p className="mt-2 text-base text-muted-foreground">Bitte versuche es gleich noch einmal.</p>
    </div>
  );
}
