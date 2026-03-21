import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import { propertyDetailPath } from "@/data/properties";
import type { Property } from "@/data/properties";
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
    map.flyTo([lat, lng], zoom, { duration: 0.45 });
  }, [lat, lng, zoom, map]);
  return null;
}

type Props = {
  properties: Property[];
  highlightedSlug: string | null;
};

export function HomePropertiesMapView({ properties, highlightedSlug }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const withCoords = useMemo(() => properties.filter((p) => p.coordinates), [properties]);

  const focus = useMemo(() => {
    const h = withCoords.find((p) => p.slug === highlightedSlug);
    if (h?.coordinates) return { lat: h.coordinates.lat, lng: h.coordinates.lng, zoom: 11 };
    const first = withCoords[0];
    if (first?.coordinates) return { lat: first.coordinates.lat, lng: first.coordinates.lng, zoom: 6 };
    return { lat: 54.5, lng: -3.5, zoom: 6 };
  }, [withCoords, highlightedSlug]);

  if (!mounted) {
    return <div className="h-[min(70vh,520px)] w-full animate-pulse rounded-xl bg-slate-200 lg:min-w-[280px]" />;
  }

  return (
    <div className="h-[min(70vh,520px)] w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md lg:sticky lg:top-24 lg:min-w-[300px] lg:w-[38%]">
      <MapContainer center={[focus.lat, focus.lng]} zoom={focus.zoom} className="z-0 h-full w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFlyTo lat={focus.lat} lng={focus.lng} zoom={focus.zoom} />
        {withCoords.map((p) => {
          if (!p.coordinates) return null;
          const isHi = highlightedSlug === p.slug;
          const dimOthers = highlightedSlug != null && !isHi;
          return (
            <Marker
              key={p.slug}
              position={[p.coordinates.lat, p.coordinates.lng]}
              opacity={dimOthers ? 0.35 : 1}
              zIndexOffset={isHi ? 800 : 0}
            >
              <Popup>
                <div className="min-w-[140px] text-slate-900">
                  <p className="font-semibold">{p.price}</p>
                  <p className="text-sm">{p.title}</p>
                  <Link to={propertyDetailPath(p)} className="mt-2 inline-block text-sm font-medium text-blue-600 underline">
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
