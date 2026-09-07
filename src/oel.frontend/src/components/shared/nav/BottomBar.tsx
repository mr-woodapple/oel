import { NavLink } from "react-router";
import { Beer, ClipboardList, House, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BottomBarProps = {
  onAddClick?: () => void;
}

export default function BottomBar({ onAddClick }: BottomBarProps) {

  return (
    <div className="z-40 w-full border-t border-border/70 bg-background/95 backdrop-blur [padding-bottom:env(safe-area-inset-bottom)]">
      <div className="h-16 grid grid-cols-4 items-center justify-items-center">

        <NavLink to="/" end aria-label="Übersicht">
          {({ isActive }) => <BottomBarButton isActive={isActive} iconName="home" />}
        </NavLink>

        <NavLink to="/beers" aria-label="Biere">
          {({ isActive }) => <BottomBarButton isActive={isActive} iconName="beers" />}
        </NavLink>

        <NavLink to="/logs" aria-label="Bier-Logs">
          {({ isActive }) => <BottomBarButton isActive={isActive} iconName="logs" />}
        </NavLink>

        <Button size="icon" className="size-11 rounded-2xl shadow-sm" onClick={onAddClick} aria-label="Hinzufügen">
          <Plus />
        </Button>
      </div>
    </div>
  )
}


type BottomBarButtonProps = {
  isActive?: boolean
  iconName: "home" | "beers" | "logs"
}

function BottomBarButton({ isActive, iconName }: BottomBarButtonProps) {
  const props = { strokeWidth: isActive ? 3 : 2 };

  return (
    <span className={cn(
      "flex size-10 items-center justify-center rounded-xl transition-colors",
      isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground",
    )}>
      {iconName === "home" && <House {...props} />}
      {iconName === "beers" && <Beer {...props} />}
      {iconName === "logs" && <ClipboardList {...props} />}
    </span>
  )
}
