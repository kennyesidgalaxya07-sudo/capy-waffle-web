// Tienda: Avenida 10 #36, El Alto
export const STORE_LOCATION = { lat: -16.4813942, lng: -68.1858708 };
export const DELIVERY_FEE_PER_KM = 1;

/** Distancia en línea recta (km) entre dos puntos. */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Costo de envío: 1 por cada km (o fracción). */
export function deliveryFee(km: number) {
  return Math.ceil(km) * DELIVERY_FEE_PER_KM;
}
