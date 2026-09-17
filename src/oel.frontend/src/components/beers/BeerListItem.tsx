import { Link } from "react-router";
import { Beer as BeerIcon, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import type { Beer } from "@/models/Beer";

type BeerListItemProps = {
  beer: Beer;
};

export function BeerListItem({ beer }: BeerListItemProps) {
  return (
    <Item
      render={<Link to={`/beers/${beer.id}`} />}
      variant="outline"
      className="rounded-lg bg-card p-4 text-base transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <ItemMedia className="flex size-14 items-center justify-center overflow-hidden rounded-md bg-primary/15 text-primary">
        {beer.photoUrl ? (
          <img src={beer.photoUrl} alt="" className="size-full object-cover" loading="lazy" />
        ) : (
          <BeerIcon className="size-5" />
        )}
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
