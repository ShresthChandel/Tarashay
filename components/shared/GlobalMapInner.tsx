"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapPin } from "@/lib/country-coordinates";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface GlobalMapInnerProps {
  pins: MapPin[];
}

export default function GlobalMapInner({ pins }: GlobalMapInnerProps) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom={false}
      className="z-0 h-[400px] w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {pins.map((pin) => (
        <Marker
          key={`${pin.country}-${pin.lat}`}
          position={[pin.lat, pin.lng]}
          icon={icon}
        >
          <Popup>{pin.country}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
