import { useEffect, useRef } from "react";
import * as L from "leaflet";
import { useNavigate } from "react-router";

import "leaflet/dist/leaflet.css";

import { formatLocation, formatLogDate } from "@/lib/beerFormatting";
import type { Beer } from "@/models/Beer";
import type { BeerLog } from "@/models/BeerLog";

type BeerLogMapProps = {
  logs: BeerLog[];
  beersById: Map<number, Beer>;
};

const FALLBACK_CENTER: L.LatLngExpression = [51.1657, 10.4515];

const beerMarkerIcon = L.divIcon({
  className: "border-0! bg-transparent!",
  html: `
    <span class="flex size-11 -rotate-45 items-center justify-center rounded-[50%_50%_50%_0] border-[3px] border-white bg-primary text-primary-foreground shadow-lg" aria-hidden="true">
      <svg class="size-[1.35rem] rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 11h1a3 3 0 0 1 0 6h-1" />
        <path d="M9 12v6" />
        <path d="M13 12v6" />
        <path d="M14 7.5c1 0 3 .5 3 2.5v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-1.5 1-2.5 2.5-2.5" />
        <path d="M6.5 7.5A2.5 2.5 0 0 1 9 4.75a3 3 0 0 1 5.83.92A2.5 2.5 0 0 1 14 10.5H6.5a1.5 1.5 0 0 1 0-3Z" />
      </svg>
    </span>
  `,
  iconAnchor: [22, 48],
  iconSize: [44, 50],
  popupAnchor: [0, -42],
});

export function BeerLogMap({ logs, beersById }: BeerLogMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { zoomControl: true }).setView(FALLBACK_CENTER, 5);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    markerLayerRef.current = L.layerGroup().addTo(map);

    const resizeFrame = window.requestAnimationFrame(() => map.invalidateSize());

    return () => {
      window.cancelAnimationFrame(resizeFrame);
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const markerLayer = markerLayerRef.current;
    if (!map || !markerLayer) return;

    markerLayer.clearLayers();
    const coordinates: L.LatLngExpression[] = [];

    for (const log of logs) {
      const latitude = log.location?.latitude;
      const longitude = log.location?.longitude;
      if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) continue;

      const coordinate: L.LatLngExpression = [latitude, longitude];
      const beerName = beersById.get(log.beerId)?.name ?? "Unbekanntes Bier";
      coordinates.push(coordinate);

      const marker = L.marker(coordinate, {
        icon: beerMarkerIcon,
        title: `${beerName}, ${formatLogDate(log.dateLogged)}`,
      }).addTo(markerLayer);

      marker.bindPopup(createPopup(log, beerName, () => navigate(`/logs/${log.id}`)), {
        closeButton: false,
        minWidth: 190,
      });
    }

    if (coordinates.length === 1) {
      map.setView(coordinates[0], 13);
    } else if (coordinates.length > 1) {
      map.fitBounds(L.latLngBounds(coordinates), { maxZoom: 15, padding: [36, 36] });
    }
  }, [beersById, logs, navigate]);

  return (
    <div
      ref={containerRef}
      className="h-full min-h-80 w-full bg-muted font-sans"
      role="application"
      aria-label={`Karte mit ${logs.length} ${logs.length === 1 ? "Bier-Log" : "Bier-Logs"}`}
    />
  );
}

function createPopup(log: BeerLog, beerName: string, openLog: () => void) {
  const popup = document.createElement("div");
  popup.className = "grid gap-1.5 font-sans";

  const title = document.createElement("strong");
  title.className = "text-sm font-semibold";
  title.textContent = beerName;

  const details = document.createElement("span");
  details.className = "text-xs text-muted-foreground";
  details.textContent = `${formatLogDate(log.dateLogged)} · ${formatLocation(log.location!)}`;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "mt-1 w-fit cursor-pointer border-0 bg-transparent p-0 text-left text-xs font-semibold text-primary-foreground";
  button.textContent = "Bier-Log öffnen";
  button.addEventListener("click", openLog);

  popup.append(title, details, button);
  return popup;
}
