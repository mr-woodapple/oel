import { useBeer } from "@/api/hooks/useBeer";
import { Item, ItemContent, ItemGroup } from "@/components/ui/item";
import type { Beer } from "@/models/Beer";

export default function Home() {
  const { beers } = useBeer()

  return (
    <div className="flex flex-col gap-5 p-2.5">
      <div className="mt-5 text-center">Öl</div>

      { 
        beers.isPending ? (<p>Lädt...</p>) : 
        beers.isError ? (<p>Fehler beim Laden!</p>) :
        beers.data.length === 0 ? (<p>Keine Biere vorhanden!</p>) :
        (
          <ItemGroup>
            {
              beers.data.map((b: Beer) => (
                <div key={b.id}>
                  <Item size="sm">
                    <ItemContent>
                      {b.name}
                    </ItemContent>
                  </Item>
                </div>
              ))
            }
          </ItemGroup>
        )
      }
    </div>
  );
}
