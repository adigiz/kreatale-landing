"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface RecenterMapProps {
  center: [number, number];
  zoom: number;
}

export default function RecenterMap({ center, zoom }: RecenterMapProps) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);
  return null;
}
