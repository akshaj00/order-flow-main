import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Code2, Home, Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import { LiveTrackingMap } from "@/components/LiveTrackingMap";
import { useApp } from "@/store/useApp";
import { socket } from "@/lib/socket";

export const Route = createFileRoute("/order/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.id} confirmed — swft` },
      {
        name: "description",
        content: "Order confirmed. Your delivery request has been generated.",
      },
    ],
  }),
  component: OrderConfirmation,
});

function OrderConfirmation() {
  const { id } = Route.useParams();

  const order = useApp((s) => s.lastOrder);

  const dispatch = useApp((s) => s.dispatch);

  const setDispatch = useApp((s) => s.setDispatch);

  const clearCart = useApp((s) => s.clearCart);

  const setDevOpen = useApp((s) => s.setDevOpen);

  const navigate = useNavigate();

  const [riderLocation, setRiderLocation] = useState<any>(null);

  // INITIAL CHECK
  useEffect(() => {
    if (!order) {
      navigate({ to: "/" });
      return;
    }

    clearCart();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SEND ORDER TO RIDERS
  useEffect(() => {
    if (!order) return;

    const payload = {
      orderId: id,

      restaurant: {
        name: order.restaurant.name,
        address: order.restaurant.pickupAddress,
        coordinates: order.restaurant.pickupCoordinates,
      },

      customer: {
        name: order.customer.name,
      },

      drop: {
        address: order.deliveryLocation.dropAddress,
        coordinates: order.deliveryLocation.dropCoordinates,
      },

      items: order.orderedItems,

      totalAmount: order.totalAmount,

      estimatedPreparationTime: order.estimatedPreparationTime,

      paymentMethod: order.paymentMethod,
    };

    console.log("SENDING ORDER:", payload);

    if (!(window as any).__orderSent) {

      (window as any).__orderSent = true;
    
      socket.emit("new_order", payload);
    
    }

  }, [order, id]);

  // LISTEN FOR RIDER ACCEPTANCE
  useEffect(() => {

    socket.on("order_accepted", (data) => {

      console.log("RIDER ACCEPTED:", data);

      if (data.orderId !== id) return;

      setDispatch({
        
        status: "assigned",
        acceptedAt: new Date().toISOString(),
        partner: {
          name: data.rider.name,

          phone: data.rider.phone,

          photo: "🛵",

          rating: 4.9,

          vehicle: "Bike",

          vehicleNumber: "KA01AB1234",

          partnerId: "RIDER01",

          etaPickupMins: 5,
        },
        
      });
      setRiderLocation({
        lat: data.currentLocation.lat,
        lng: data.currentLocation.lng,
      });
    });

    return () => {
      socket.off("order_accepted");
    };

  }, [id, setDispatch]);

  useEffect(() => {

    socket.on("live_location_update", (data) => {
  
      if (data.orderId !== id) return;
  
      setRiderLocation({
        lat: data.lat,
        lng: data.lng,
      });
  
    });
  
    return () => {
      socket.off("live_location_update");
    };
  
  }, [id]);

  useEffect(() => {

    return () => {
  
      (window as any).__orderSent = false;
  
    };
  
  }, []);

  if (!order) return null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-8">

      {/* SUCCESS ICON */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 14, stiffness: 200 }}
        className="mx-auto grid size-20 place-items-center rounded-3xl gradient-brand shadow-glow"
      >
        <Check className="size-10 text-brand-foreground" strokeWidth={3} />
      </motion.div>

      {/* TITLE */}
      <motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.2 }}
  className="mt-6 text-center"
>
  <h1 className="font-display text-4xl font-bold md:text-5xl">
    {dispatch
      ? "Delivery partner assigned!"
      : "Finding delivery partner..."}
  </h1>

  <p className="mt-2 text-muted-foreground">
    {dispatch ? (
      <>
        <span className="font-semibold text-foreground">
          {dispatch.partner.name}
        </span>{" "}
        is heading to the restaurant
      </>
    ) : (
      <>
        Waiting for a rider to accept your order
      </>
    )}
  </p>
</motion.div>

      {/* MAP */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 glass rounded-2xl p-5"
      >
        <div className="flex items-center gap-3">
          <Receipt className="size-5 text-brand" />

          <h2 className="font-display text-lg font-semibold">
            Pickup → Drop
          </h2>
        </div>

        <div className="mt-4">
        <LiveTrackingMap
          pickup={order.restaurant.pickupCoordinates}
          drop={order.deliveryLocation.dropCoordinates}
          rider={riderLocation}
        />
        </div>

        <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Pickup from
            </p>

            <p className="mt-1 font-semibold">
              {order.restaurant.name}
            </p>

            <p className="text-muted-foreground">
              {order.restaurant.pickupAddress}
            </p>

            <p className="font-mono text-xs text-muted-foreground">
              {order.restaurant.pickupCoordinates.lat},{" "}
              {order.restaurant.pickupCoordinates.lng}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Deliver to
            </p>

            <p className="mt-1 font-semibold">
              {order.customer.name}
            </p>

            <p className="text-muted-foreground">
              {order.deliveryLocation.dropAddress}
            </p>

            <p className="font-mono text-xs text-muted-foreground">
              {order.deliveryLocation.dropCoordinates.lat},{" "}
              {order.deliveryLocation.dropCoordinates.lng}
            </p>
          </div>
        </div>
      </motion.div>

      {/* WAITING FOR RIDER */}
      {!dispatch && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-4 glass rounded-2xl p-5"
        >
          <h2 className="font-display text-lg font-semibold">
            Searching for delivery partner...
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Waiting for a rider to accept your order.
          </p>
        </motion.div>
      )}

      {/* DELIVERY PARTNER */}
      {dispatch && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-4 glass rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">
              Delivery partner
            </h2>

            <span className="rounded-full bg-brand/15 px-2.5 py-0.5 text-[11px] font-semibold text-brand">
              {dispatch.status === "assigned"
                ? "Assigned"
                : dispatch.status}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-4">

            <div className="grid size-14 place-items-center rounded-2xl gradient-brand text-3xl shadow-glow">
              {dispatch.partner.photo}
            </div>

            <div className="flex-1">
              <p className="font-display text-base font-semibold">
                {dispatch.partner.name}
              </p>

              <p className="text-xs text-muted-foreground">
                ★ {dispatch.partner.rating} ·{" "}
                {dispatch.partner.vehicle} ·{" "}
                {dispatch.partner.vehicleNumber}
              </p>

              <p className="font-mono text-[11px] text-muted-foreground">
                {dispatch.partner.partnerId}
              </p>
            </div>

            <a
              href={`tel:${dispatch.partner.phone}`}
              className="rounded-xl border border-brand bg-brand/10 px-3 py-2 text-xs font-semibold text-brand"
            >
              Call
            </a>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Arriving at restaurant in{" "}
            <span className="font-semibold text-foreground">
              {dispatch.partner.etaPickupMins} min
            </span>
          </p>
        </motion.div>
      )}

      {/* ITEMS */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 glass rounded-2xl p-5"
      >
        <h2 className="font-display text-lg font-semibold">
          Items
        </h2>

        <ul className="mt-3 space-y-2 text-sm">
          {order.orderedItems.map((it) => (
            <li
              key={it.name}
              className="flex items-center justify-between"
            >
              <span>
                {it.name}{" "}
                <span className="text-muted-foreground">
                  ×{it.quantity}
                </span>
              </span>

              <span className="font-semibold">
                ₹{it.price * it.quantity}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 font-display text-base font-bold">
          <span>Total paid · {order.paymentMethod}</span>

          <span>₹{order.totalAmount}</span>
        </div>
      </motion.div>

      {/* ACTIONS */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex flex-wrap justify-center gap-3"
      >
        <button
          onClick={() => setDevOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl gradient-brand px-5 py-3 text-sm font-semibold text-brand-foreground shadow-glow"
        >
          <Code2 className="size-4" />
          View JSON payload
        </button>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-5 py-3 text-sm font-semibold backdrop-blur hover:bg-secondary"
        >
          <Home className="size-4" />
          Home
        </Link>
      </motion.div>
    </main>
  );
}