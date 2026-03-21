import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import type { SearchCatalogProperty } from "@/data/searchCatalogTypes";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapFlyTo({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 0.5 });
  }, [lat, lng, zoom, map]);
  return null;
}

type Props = {
  properties: SearchCatalogProperty[];
  highlightedId: number | null;
};

export function SearchMapView({ properties, highlightedId }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const focus = useMemo(() => {
    const h = properties.find((p) => p.id === highlightedId);
    if (h) return { lat: h.coordinates.lat, lng: h.coordinates.lng, zoom: 14 };
    const first = properties[0];
    if (first) return { lat: first.coordinates.lat, lng: first.coordinates.lng, zoom: 6 };
    return { lat: 54.5, lng: -3.5, zoom: 6 };
  }, [properties, highlightedId]);

  if (!mounted) {
    return <div className="h-[min(70vh,520px)] w-full animate-pulse rounded-xl bg-slate-200 lg:sticky lg:top-28" />;
  }

  return (
    <div className="h-[min(70vh,520px)] w-full overflow-hidden rounded-xl border border-slate-200 shadow-md lg:sticky lg:top-28 lg:w-[30%] lg:min-w-[280px]">
      <MapContainer
        center={[focus.lat, focus.lng]}
        zoom={focus.zoom}
        className="h-full w-full z-0"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFlyTo lat={focus.lat} lng={focus.lng} zoom={focus.zoom} />
        {properties.map((p) => {
          const isHi = highlightedId === p.id;
          const dimOthers = highlightedId != null && !isHi;
          return (
          <Marker
            key={p.id}
            position={[p.coordinates.lat, p.coordinates.lng]}
            opacity={dimOthers ? 0.4 : 1}
            zIndexOffset={isHi ? 800 : 0}
          >
            <Popup>
              <div className="min-w-[160px] text-slate-900">
                <p className="font-semibold">{p.priceDisplay}</p>
                <p className="text-sm">{p.title}</p>
                <Link to={`/listings/${p.slug}`} className="mt-2 inline-block text-sm font-medium text-blue-600 underline">
                  View
                </Link>
              </div>
            </Popup>
          </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
