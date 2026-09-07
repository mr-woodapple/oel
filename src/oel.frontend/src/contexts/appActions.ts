import { createContext, useContext } from "react";

export type AppActions = {
  openAddBeer: () => void;
  openAddBeerLog: (beerId?: number) => void;
};

export const AppActionsContext = createContext<AppActions | null>(null);

export function useAppActions() {
  const context = useContext(AppActionsContext);

  if (!context) {
    throw new Error("useAppActions must be used inside AppActionsProvider");
  }

  return context;
}
