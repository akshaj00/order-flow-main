import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Banknote, CreditCard, MapPin, Minus, Plus, ShoppingBag, Smartphone, Trash2, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { restaurants } from "@/data/restaurants";
import { useApp } from "@/store/useApp";
import { LiveTrackingMap } from "@/components/LiveTrackingMap";
import { buildOrderPreview } from "@/components/JsonDevPanel";
import type { Address } from "@/store/useApp";


export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — swft" },
      { name: "description", content: "Confirm your address, payment, and place your order on swft." },
    ],
  }),
  component: Checkout,
});

const savedAddresses: Address[] = [
  { label: "Home", full: "BTM Layout, Bangalore", coords: { lat: 12.9166, lng: 77.6101 } },
  { label: "Work", full: "Manyata Tech Park, Bangalore", coords: { lat: 13.0432, lng: 77.6207 } },
  { label: "Friend's", full: "Jayanagar, Bangalore", coords: { lat: 12.9252, lng: 77.5938 } },
];

const paymentMethods = [
  { id: "UPI", label: "UPI", Icon: Smartphone },
  { id: "Card", label: "Card", Icon: CreditCard },
  { id: "Wallet", label: "Wallet", Icon: Wallet },
  { id: "COD", label: "Cash", Icon: Banknote },
];

function Checkout() {
  const cart = useApp((s) => s.cart);
  const rid = useApp((s) => s.cartRestaurantId);
  const customer = useApp((s) => s.customer);
  const setCustomer = useApp((s) => s.setCustomer);
  const address = useApp((s) => s.address);
  const setAddress = useApp((s) => s.setAddress);
  const paymentMethod = useApp((s) => s.paymentMethod);
  const setPaymentMethod = useApp((s) => s.setPaymentMethod);
  const specialInstructions = useApp((s) => s.specialInstructions);
  const setSpecialInstructions = useApp((s) => s.setSpecialInstructions);
  const addToCart = useApp((s) => s.addToCart);
  const decrement = useApp((s) => s.decrement);
  const removeFromCart = useApp((s) => s.removeFromCart);
  const setLastOrder = useApp((s) => s.setLastOrder);
  const setDevOpen = useApp((s) => s.setDevOpen);
  const navigate = useNavigate();

  const restaurant = restaurants.find((r) => r.id === rid);
  const subtotal = cart.reduce((a, c) => a + c.price * c.quantity, 0);
  const deliveryFee = subtotal > 0 ? 39 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;
  

if (cart.length === 0 || !restaurant) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl gradient-brand shadow-glow">
          <ShoppingBag className="size-7 text-brand-foreground" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Find something delicious to order tonight.</p>
        <Link
          to="/restaurants"
          className="mt-6 inline-block rounded-xl gradient-brand px-5 py-3 font-semibold text-brand-foreground shadow-glow"
        >
          Browse restaurants
        </Link>
      </main>
    );
  }

  const setDispatch = useApp((s) => s.setDispatch);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchStep, setDispatchStep] = useState(0);

  const placeOrder = async () => {
    const state = useApp.getState();
    const payload = buildOrderPreview(state);
    if (!payload) return;
    setLastOrder(payload);
    setDispatch(null);
    setDispatching(true);
    setDispatchStep(0);
    setTimeout(() => setDispatchStep(1), 700);
    setTimeout(() => setDispatchStep(2), 1600);
    try {

      // STEP 1
      setDispatchStep(2);
    
      // STEP 2
      navigate({
        to: "/order/$id",
        params: { id: payload.orderId },
      });
    
    } catch (e) {
      console.error(e);
      setDispatching(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Checkout</h1>
      <p className="text-muted-foreground">Review your order and place it in one tap.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          {/* Address + map */}
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Delivery address</h2>
              <span className="text-xs text-muted-foreground">{address.label}</span>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {savedAddresses.map((a) => (
                <button
                  key={a.label}
                  onClick={() => setAddress(a)}
                  className={`text-left rounded-xl border p-3 transition ${
                    address.label === a.label
                      ? "border-brand bg-brand/10"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    <MapPin className="size-3.5 text-brand" /> {a.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.full}</p>
                </button>
              ))}
            </div>
            <div className="mt-4">
            <LiveTrackingMap
  pickup={restaurant.coords}
  drop={address.coords}
  
/>
            </div>
          </motion.section>

          {/* Items */}
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Your order</h2>
              <span className="text-xs text-muted-foreground">{restaurant.name}</span>
            </div>
            <div className="mt-4 space-y-3">
              {cart.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 rounded-xl bg-background/40 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">₹{c.price} each</p>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-lg border border-border p-1">
                    <button onClick={() => decrement(c.id)} className="grid size-6 place-items-center rounded-md hover:bg-secondary">
                      <Minus className="size-3" />
                    </button>
                    <span className="min-w-6 text-center text-sm font-semibold">{c.quantity}</span>
                    <button
                      onClick={() => addToCart(restaurant, c)}
                      className="grid size-6 place-items-center rounded-md hover:bg-secondary"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                  <p className="w-16 text-right text-sm font-semibold">₹{c.price * c.quantity}</p>
                  <button
                    onClick={() => removeFromCart(c.id)}
                    className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Special instructions
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Less spicy, extra napkins"
                rows={2}
                className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-brand"
              />
            </div>
          </motion.section>

          {/* Customer */}
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
            <h2 className="font-display text-lg font-semibold">Contact details</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Field label="Name" value={customer.name} onChange={(v) => setCustomer({ name: v })} />
              <Field label="Phone" value={customer.phone} onChange={(v) => setCustomer({ phone: v })} />
              <Field label="Email" value={customer.email} onChange={(v) => setCustomer({ email: v })} />
            </div>
          </motion.section>

          {/* Payment */}
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
            <h2 className="font-display text-lg font-semibold">Payment</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {paymentMethods.map((p) => {
                const active = paymentMethod === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPaymentMethod(p.id)}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-sm transition ${
                      active
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    <p.Icon className="size-4" /> {p.label}
                  </button>
                );
              })}
            </div>
          </motion.section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass rounded-2xl p-5">
            <h2 className="font-display text-lg font-semibold">Bill</h2>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={`₹${subtotal}`} />
              <Row label="Delivery fee" value={`₹${deliveryFee}`} />
              <Row label="Taxes (5%)" value={`₹${tax}`} />
              <div className="my-2 h-px bg-border" />
              <div className="flex items-center justify-between font-display text-lg font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
            <button
              onClick={placeOrder}
              disabled={dispatching}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-brand px-5 py-3.5 font-semibold text-brand-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            >
              {dispatching ? "Dispatching…" : `Place order · ₹${total}`}
            </button>
            <button
              onClick={() => setDevOpen(true)}
              className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground"
            >
              Preview JSON payload →
            </button>
          </div>
        </aside>
      </div>

      <DispatchOverlay open={dispatching} step={dispatchStep} />
    </main>
  );
}

function DispatchOverlay({ open, step }: { open: boolean; step: number }) {
  const steps = [
    { label: "Sending order JSON to dispatch API", code: "POST /api/orders" },
    { label: "Notifying nearby delivery partners", code: "broadcast → 8 partners" },
    { label: "Awaiting partner acceptance", code: "waiting…" },
    
  ];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-background/70 px-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass w-full max-w-md rounded-3xl p-6 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <div className="relative grid size-12 place-items-center rounded-2xl gradient-brand shadow-glow">
                {step < 3 ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="size-5 rounded-full border-2 border-brand-foreground border-t-transparent"
                  />
                ) : (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="size-6 text-brand-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                )}
              </div>
              <div>
                <p className="font-display text-lg font-bold">
                "Searching for delivery partner"
                </p>
                <p className="text-xs text-muted-foreground">
                "Waiting for a rider to accept your order"
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-2.5">
              {steps.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <li key={s.label} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 grid size-5 place-items-center rounded-full text-[10px] font-bold ${
                        done
                          ? "bg-brand text-brand-foreground"
                          : active
                            ? "bg-brand/20 text-brand"
                            : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm ${
                          done || active ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {s.label}
                      </p>
                      <p className="font-mono text-[10px] text-muted-foreground">{s.code}</p>
                    </div>
                    {active && (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                        className="size-3 rounded-full border-2 border-brand border-t-transparent"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
      />
    </label>
  );
}
