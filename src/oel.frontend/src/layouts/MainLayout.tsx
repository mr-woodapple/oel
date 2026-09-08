import { useCallback, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router";

import { AddBeerLogDrawer } from "@/components/beerlogs/AddBeerLogDrawer";
import { AddBeerDrawer } from "@/components/beers/AddBeerDrawer";
import BottomBar from "@/components/shared/nav/BottomBar";
import { AppActionsProvider } from "@/contexts/AppActionsContext";
import type { Beer } from "@/models/Beer";
import type { BeerLog } from "@/models/BeerLog";

export default function MainLayout() {
  const location = useLocation();
  const [activeDrawer, setActiveDrawer] = useState<"beer" | "beerLog" | null>(null);
  const [initialBeerId, setInitialBeerId] = useState<number>();
  const [editingBeer, setEditingBeer] = useState<Beer>();
  const [editingBeerLog, setEditingBeerLog] = useState<BeerLog>();

  const openAddBeer = useCallback(() => {
    setEditingBeer(undefined);
    setActiveDrawer("beer");
  }, []);

  const openEditBeer = useCallback((beer: Beer) => {
    setEditingBeer(beer);
    setActiveDrawer("beer");
  }, []);

  const openAddBeerLog = useCallback((beerId?: number) => {
    setEditingBeerLog(undefined);
    setInitialBeerId(beerId);
    setActiveDrawer("beerLog");
  }, []);

  const openEditBeerLog = useCallback((beerLog: BeerLog) => {
    setEditingBeerLog(beerLog);
    setInitialBeerId(beerLog.beerId);
    setActiveDrawer("beerLog");
  }, []);

  const actions = useMemo(
    () => ({ openAddBeer, openEditBeer, openAddBeerLog, openEditBeerLog }),
    [openAddBeer, openEditBeer, openAddBeerLog, openEditBeerLog],
  );

  function handleQuickAdd() {
    if (location.pathname === "/beers" || location.pathname === "/beers/") {
      openAddBeer();
      return;
    }

    openAddBeerLog();
  }

  return (
    <AppActionsProvider value={actions}>
      <div className="h-dvh overflow-hidden bg-background">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>

          <BottomBar onAddClick={handleQuickAdd} />
        </div>

        <AddBeerDrawer
          open={activeDrawer === "beer"}
          beer={editingBeer}
          onOpenChange={(open) => setActiveDrawer(open ? "beer" : null)}
        />
        <AddBeerLogDrawer
          open={activeDrawer === "beerLog"}
          initialBeerId={initialBeerId}
          beerLog={editingBeerLog}
          onOpenChange={(open) => setActiveDrawer(open ? "beerLog" : null)}
          onRequestAddBeer={openAddBeer}
        />
      </div>
    </AppActionsProvider>
  );
}
