import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { STORE_LOCATION, distanceKm } from "@/lib/delivery";

// Iconos de Leaflet desde CDN (evita problemas de bundling con las imágenes)
const storeIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const customerIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function DeliveryMap({
  position,
  onChange,
}: {
  position: { lat: number; lng: number } | null;
  onChange: (pos: { lat: number; lng: number }, km: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current).setView([STORE_LOCATION.lat, STORE_LOCATION.lng], 15);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    L.marker([STORE_LOCATION.lat, STORE_LOCATION.lng], { icon: storeIcon })
      .addTo(map)
      .bindPopup("CapyWaffles — Av. 10 #36, El Alto");

    const place = (latlng: L.LatLng) => {
      const pos = { lat: latlng.lat, lng: latlng.lng };
      if (markerRef.current) {
        markerRef.current.setLatLng(latlng);
      } else {
        markerRef.current = L.marker(latlng, { icon: customerIcon, draggable: true })
          .addTo(map)
          .bindPopup("Tu ubicación de entrega");
        markerRef.current.on("dragend", () => {
          const ll = markerRef.current!.getLatLng();
          const p = { lat: ll.lat, lng: ll.lng };
          onChangeRef.current(p, distanceKm(STORE_LOCATION, p));
        });
      }
      onChangeRef.current(pos, distanceKm(STORE_LOCATION, pos));
    };

    map.on("click", (e: L.LeafletMouseEvent) => place(e.latlng));
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Sincronizar marcador cuando la posición cambia desde fuera (botón "Usar mi ubicación")
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !position) return;
    const latlng = L.latLng(position.lat, position.lng);
    if (markerRef.current) {
      markerRef.current.setLatLng(latlng);
    } else {
      markerRef.current = L.marker(latlng, { icon: customerIcon, draggable: true })
        .addTo(map)
        .bindPopup("Tu ubicación de entrega");
      markerRef.current.on("dragend", () => {
        const ll = markerRef.current!.getLatLng();
        const p = { lat: ll.lat, lng: ll.lng };
        onChangeRef.current(p, distanceKm(STORE_LOCATION, p));
      });
    }
    map.setView(latlng, Math.max(map.getZoom(), 15));
  }, [position]);

  return <div ref={containerRef} className="h-72 w-full rounded-xl" />;
}
