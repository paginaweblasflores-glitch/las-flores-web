import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../lib/supabase", () => ({ supabase: {} }));

import {
  buildDeliveryWhatsAppMessage,
  generateDeliveryDirectionsUrl,
} from "../utils/whatsappDispatch";

describe("WhatsApp delivery dispatch links", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses the public driver page when dispatch is opened from localhost", () => {
    vi.stubGlobal("window", { location: { origin: "http://localhost:5173" } });

    const message = buildDeliveryWhatsAppMessage({
      id: "550e8400-e29b-41d4-a716-446655440000",
      order_number: "LF-2401",
      driver_pin: "4217",
    });

    expect(message).toContain(
      "https://www.restaurantelasflores.com/d/550e8400-e29b-41d4-a716-446655440000",
    );
    expect(message).not.toContain("localhost");
    expect(message).toContain("Voy a recoger el pedido");
    expect(message).toContain("Pedido recogido");
    expect(message).toContain("Confirmar entrega al cliente");
  });

  it("keeps the active public origin when dispatch is sent from production", () => {
    vi.stubGlobal("window", { location: { origin: "https://www.restaurantelasflores.com" } });

    const message = buildDeliveryWhatsAppMessage({ id: "order-123" });

    expect(message).toContain("https://www.restaurantelasflores.com/d/order-123");
  });
});

describe("driver Google Maps directions", () => {
  it("opens a driving route to the customer's GPS coordinates", () => {
    const directionsUrl = generateDeliveryDirectionsUrl(-13.16, -74.22);
    expect(directionsUrl).not.toBeNull();
    if (!directionsUrl) throw new Error("Expected a GPS directions URL");
    const url = new URL(directionsUrl);

    expect(url.pathname).toBe("/maps/dir/");
    expect(url.searchParams.get("destination")).toBe("-13.16,-74.22");
    expect(url.searchParams.get("travelmode")).toBe("driving");
  });

  it("opens a driving route to the address when GPS coordinates are missing", () => {
    const directionsUrl = generateDeliveryDirectionsUrl(null, null, "Jr. Los Pinos 123");
    expect(directionsUrl).not.toBeNull();
    if (!directionsUrl) throw new Error("Expected an address directions URL");
    const url = new URL(directionsUrl);

    expect(url.pathname).toBe("/maps/dir/");
    expect(url.searchParams.get("destination")).toBe("Jr. Los Pinos 123, Huamanga, Ayacucho");
    expect(url.searchParams.get("travelmode")).toBe("driving");
  });

  it("does not create a route when the order has no destination", () => {
    expect(generateDeliveryDirectionsUrl(null, null, "  ")).toBeNull();
  });
});
