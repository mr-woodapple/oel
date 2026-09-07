import { NavLink } from "react-router";
import { ChartSpline, House, Plus, UserCog } from "lucide-react";

import { Button } from "@/components/ui/button";

type BottomBarProps = {
  onAddClick?: () => void;
}

export default function BottomBar({ onAddClick }: BottomBarProps) {

  return (
    <div className="apple-safe-area z-50 w-full bg-white border-t border-gray-200">
      <div className="h-16 grid grid-cols-4 items-center justify-items-center">

        <NavLink to="/">
          {({ isActive }) => <BottomBarButton isActive={isActive} iconName="House" />}
        </NavLink>

        <NavLink to="stats">
          {({ isActive }) => <BottomBarButton isActive={isActive} iconName="ChartSpline" />}
        </NavLink>

        <NavLink to="settings">
          {({ isActive }) => <BottomBarButton isActive={isActive} iconName="UserCog" />}
        </NavLink>

        <Button onClick={onAddClick}>
          <Plus />
        </Button>
      </div>
    </div>
  )
}


type BottomBarButtonProps = {
  isActive?: boolean
  iconName?: "House" | "ChartSpline" | "UserCog"
}

function BottomBarButton({ isActive, iconName }: BottomBarButtonProps) {
  const props = { strokeWidth: isActive ? 3 : 2 };

  return (
    <Button variant={isActive ? "secondary" : "ghost"}>
      {iconName === "House" && <House {...props} />}
      {iconName === "ChartSpline" && <ChartSpline {...props} />}
      {iconName === "UserCog" && <UserCog {...props} />}
    </Button>
  )
}
