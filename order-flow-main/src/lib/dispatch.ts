import type { DispatchResponse, OrderPayload } from "@/store/useApp";

const partners = [
  { name: "Rahul Verma", vehicle: "Bike", vehicleNumber: "KA 05 AB 1234", phone: "+91 99001 22334", photo: "👨🏽‍🦱" },
  { name: "Aarav Singh", vehicle: "Bike", vehicleNumber: "KA 03 CD 5678", phone: "+91 99001 44556", photo: "🧔🏽" },
  { name: "Meera Iyer", vehicle: "Scooter", vehicleNumber: "KA 01 EF 9012", phone: "+91 99001 66778", photo: "👩🏽" },
  { name: "Karan Patel", vehicle: "Bike", vehicleNumber: "KA 09 GH 3456", phone: "+91 99001 88990", photo: "👨🏻" },
];

/**
 * Simulates POSTing the order JSON to a backend and waiting for a delivery
 * partner to be assigned. Replace the body with a real fetch() to your
 * dispatch service when wiring up production.
 */
export async function dispatchOrder(payload: OrderPayload): Promise<DispatchResponse> {
  // Real-world: POST payload to your backend
  try {
    await fetch("https://example.com/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // mock environment — ignore network failure
  }

  // Simulate dispatch latency (2.4–3.6s)
  await new Promise((r) => setTimeout(r, 2400 + Math.random() * 1200));

  const p = partners[Math.floor(Math.random() * partners.length)];
  return {
    status: "assigned",
    acceptedAt: new Date().toISOString(),
    partner: {
      partnerId: `DP${Math.floor(1000 + Math.random() * 9000)}`,
      name: p.name,
      phone: p.phone,
      vehicle: p.vehicle,
      vehicleNumber: p.vehicleNumber,
      rating: +(4.5 + Math.random() * 0.4).toFixed(1),
      etaPickupMins: 4 + Math.floor(Math.random() * 6),
      photo: p.photo,
    },
  };
}
