import { Outlet } from "react-router";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import BottomBar from "@/components/shared/nav/BottomBar";

export default function MainLayout() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return(
    <div className="h-dvh bg-background overflow-hidden">

      <div className="h-full">
        {isDesktop ? (
          <div className="flex h-full flex-row">
            {/* <Sidebar onAddClick={handleAddClick} /> */}

            <div className="flex-1 max-w-screen-sm mx-auto w-full overflow-y-auto">
              <Outlet />
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto">
              <Outlet />
            </div>

            <BottomBar />
          </div>
        )}
      </div>
    </div>
  );
}
