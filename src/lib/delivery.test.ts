import { describe, expect, it } from "vitest";
import { deliveryFee, distanceKm, STORE_LOCATION } from "./delivery";

describe("envío", () => {
  it("cobra 1 por cada km, redondeando hacia arriba", () => {
    expect(deliveryFee(3)).toBe(3);
    expect(deliveryFee(3.2)).toBe(4);
  });
  it("en la misma tienda la distancia es 0", () => {
    expect(distanceKm(STORE_LOCATION, STORE_LOCATION)).toBe(0);
  });
});
