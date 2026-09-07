import { useCallback, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router";

import { AddBeerLogDrawer } from "@/components/beerlogs/AddBeerLogDrawer";
import { AddBeerDrawer } from "@/components/beers/AddBeerDrawer";
import BottomBar from "@/components/shared/nav/BottomBar";
import { AppActionsProvider } from "@/contexts/AppActionsContext";

export default function MainLayout() {
  const location = useLocation();
  const [activeDrawer, setActiveDrawer] = useState<"beer" | "beerLog" | null>(null);
  const [initialBeerId, setInitialBeerId] = useState<number>();

  const openAddBeer = useCallback(() => {
    setActiveDrawer("beer");
  }, []);

  const openAddBeerLog = useCallback((beerId?: number) => {
    setInitialBeerId(beerId);
    setActiveDrawer("beerLog");
  }, []);

  const actions = useMemo(() => ({ openAddBeer, openAddBeerLog }), [openAddBeer, openAddBeerLog]);

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
          onOpenChange={(open) => setActiveDrawer(open ? "beer" : null)}
        />
        <AddBeerLogDrawer
          open={activeDrawer === "beerLog"}
          initialBeerId={initialBeerId}
          onOpenChange={(open) => setActiveDrawer(open ? "beerLog" : null)}
          onRequestAddBeer={openAddBeer}
        />
      </div>
    </AppActionsProvider>
  );
}
