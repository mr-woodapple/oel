import { createContext, useContext } from "react";
import type { Beer } from "@/models/Beer";
import type { BeerLog } from "@/models/BeerLog";

export type AppActions = {
  openAddBeer: () => void;
  openEditBeer: (beer: Beer) => void;
  openAddBeerLog: (beerId?: number) => void;
  openEditBeerLog: (beerLog: BeerLog) => void;
};

export const AppActionsContext = createContext<AppActions | null>(null);

export function useAppActions() {
  const context = useContext(AppActionsContext);

  if (!context) {
    throw new Error("useAppActions must be used inside AppActionsProvider");
  }

  return context;
}
