import { Beer as BeerIcon, ChevronRight } from "lucide-react";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import type { Beer } from "@/models/Beer";

type BeerListItemProps = {
  beer: Beer;
};

export function BeerListItem({ beer }: BeerListItemProps) {
  return (
    <Item
      render={<Link to={`/beers/${beer.id}`} />}
      variant="outline"
      className="rounded-2xl bg-card p-4 text-base shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:p-5"
    >
      <ItemMedia className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <BeerIcon className="size-5" />
      </ItemMedia>
      <ItemContent className="min-w-0 gap-1.5 text-left">
        <ItemTitle className="text-base font-semibold text-foreground">{beer.name}</ItemTitle>
        <ItemDescription className="text-sm text-muted-foreground">
          {beer.brewery} · {beer.style}
        </ItemDescription>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {beer.abv !== null && <Badge variant="secondary" className="rounded-full">{beer.abv}% vol.</Badge>}
          {beer.ibu !== null && <Badge variant="outline" className="rounded-full">{beer.ibu} IBU</Badge>}
        </div>
      </ItemContent>
      <ItemActions>
        <ChevronRight className="size-5 text-muted-foreground" />
      </ItemActions>
    </Item>
  );
}
