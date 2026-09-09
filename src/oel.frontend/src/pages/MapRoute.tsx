import { lazy, Suspense } from "react";

const MapPage = lazy(() => import("@/pages/Map"));

export default function MapRoute() {
  return (
    <Suspense fallback={<div className="p-6 text-muted-foreground">Karte wird geladen …</div>}>
      <MapPage />
    </Suspense>
  );
}
