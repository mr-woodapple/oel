import { NavLink } from "react-router";
import { Beer, ClipboardList, House, Map as MapIcon, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type BottomBarProps = {
  onAddClick?: () => void;
}

export default function BottomBar({ onAddClick }: BottomBarProps) {

  return (
    <div className="pb-[env(safe-area-inset-bottom)] z-50 w-full bg-white border-t border-gray-200">
      <div className="grid h-16 grid-cols-5 items-center justify-items-center">

        <NavLink to="/" end aria-label="Übersicht">
          {({ isActive }) => <BottomBarButton isActive={isActive} iconName="home" />}
        </NavLink>

        <NavLink to="/beers" aria-label="Biere">
          {({ isActive }) => <BottomBarButton isActive={isActive} iconName="beers" />}
        </NavLink>

        <NavLink to="/logs" aria-label="Bier-Logs">
          {({ isActive }) => <BottomBarButton isActive={isActive} iconName="logs" />}
        </NavLink>

        <NavLink to="/map" aria-label="Karte">
          {({ isActive }) => <BottomBarButton isActive={isActive} iconName="map" />}
        </NavLink>

        <Button size="icon" onClick={onAddClick} aria-label="Hinzufügen">
          <Plus />
        </Button>
      </div>
    </div>
  )
}


type BottomBarButtonProps = {
  isActive?: boolean
  iconName: "home" | "beers" | "logs" | "map"
}

function BottomBarButton({ isActive, iconName }: BottomBarButtonProps) {
  const props = { strokeWidth: isActive ? 3 : 2 };

  return (
    <Button variant={isActive ? "secondary" : "ghost"}>
      {iconName === "home" && <House {...props} />}
      {iconName === "beers" && <Beer {...props} />}
      {iconName === "logs" && <ClipboardList {...props} />}
      {iconName === "map" && <MapIcon {...props} />}
    </Button>
  )
}
