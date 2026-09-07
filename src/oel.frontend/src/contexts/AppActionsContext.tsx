import type { ReactNode } from "react";

import { AppActionsContext, type AppActions } from "@/contexts/appActions";

export function AppActionsProvider({ value, children }: { value: AppActions; children: ReactNode }) {
  return <AppActionsContext value={value}>{children}</AppActionsContext>;
}
