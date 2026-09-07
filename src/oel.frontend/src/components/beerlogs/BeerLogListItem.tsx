import { ChevronRight, MapPin } from "lucide-react";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { formatLogDate, formatServingFormat } from "@/lib/beerFormatting";
import type { Beer } from "@/models/Beer";
import type { BeerLog } from "@/models/BeerLog";
import { Rating } from "@/components/beerlogs/Rating";

type BeerLogListItemProps = {
  log: BeerLog;
  beer?: Beer;
};

export function BeerLogListItem({ log, beer }: BeerLogListItemProps) {
  return (
    <Item
      render={<Link to={`/logs/${log.id}`} />}
      variant="outline"
      className="rounded-2xl bg-card p-4 text-base shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:p-5"
    >
      <ItemContent className="min-w-0 gap-2 text-left">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ItemTitle className="text-base font-semibold text-foreground">
            {beer?.name ?? "Unbekanntes Bier"}
          </ItemTitle>
          <Rating value={log.rating} compact />
        </div>
        <ItemDescription className="text-sm text-muted-foreground">
          {formatLogDate(log.dateLogged)}
          {log.location && (
            <span className="mt-1 flex items-center gap-1">
              <MapPin className="size-3.5" /> {log.location}
            </span>
          )}
        </ItemDescription>
        <Badge variant="secondary" className="mt-1 rounded-full">
          {formatServingFormat(log.format)}
        </Badge>
      </ItemContent>
      <ItemActions>
        <ChevronRight className="size-5 text-muted-foreground" />
      </ItemActions>
    </Item>
  );
}
