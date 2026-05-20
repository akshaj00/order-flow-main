import { useApp } from "@/store/useApp";
import { AnimatePresence, motion } from "framer-motion";
import { restaurants } from "@/data/restaurants";
import { Check, Copy, Download, Send, X, Zap } from "lucide-react";
import { useMemo, useState } from "react";

export function buildOrderPreview(state: ReturnType<typeof useApp.getState>) {
  const { cart, cartRestaurantId, customer, address, paymentMethod, specialInstructions } = state;
  const r = restaurants.find((x) => x.id === cartRestaurantId);
  if (!r || cart.length === 0) return null;
  const total = cart.reduce((a, c) => a + c.price * c.quantity, 0);
  return {
    orderId: `ORD${Math.floor(1000 + Math.random() * 9000)}`,
    customer,
    restaurant: {
      name: r.name,
      phone: r.phone,
      pickupAddress: r.address,
      pickupCoordinates: r.coords,
    },
    deliveryLocation: {
      dropAddress: address.full,
      dropCoordinates: address.coords,
    },
    orderedItems: cart.map((c) => ({ name: c.name, quantity: c.quantity, price: c.price })),
    totalAmount: total,
    paymentMethod,
    estimatedPreparationTime: `${r.prepMins} mins`,
    specialInstructions,
    timestamp: new Date().toISOString(),
  };
}

export function JsonDevPanel() {
  const open = useApp((s) => s.devOpen);
  const setOpen = useApp((s) => s.setDevOpen);
  const lastOrder = useApp((s) => s.lastOrder);

  const cart = useApp((s) => s.cart);
  const cartRestaurantId = useApp((s) => s.cartRestaurantId);
  const customer = useApp((s) => s.customer);
  const address = useApp((s) => s.address);
  const paymentMethod = useApp((s) => s.paymentMethod);
  const specialInstructions = useApp((s) => s.specialInstructions);

  const previewObj = useMemo(() => {
    if (lastOrder) return lastOrder;
    return buildOrderPreview({
      cart,
      cartRestaurantId,
      customer,
      address,
      paymentMethod,
      specialInstructions,
    } as ReturnType<typeof useApp.getState>);
  }, [lastOrder, cart, cartRestaurantId, customer, address, paymentMethod, specialInstructions]);

  const json = useMemo(() => JSON.stringify(previewObj, null, 2), [previewObj]);
  const [copied, setCopied] = useState(false);
  const [posting, setPosting] = useState<null | "ok" | "loading">(null);
  const [endpoint, setEndpoint] = useState("https://api.example.com/orders");

  const copy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const download = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${previewObj?.orderId ?? "order"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const post = async () => {
    if (!previewObj) return;
    setPosting("loading");
    await new Promise((r) => setTimeout(r, 900));
    setPosting("ok");
    setTimeout(() => setPosting(null), 1500);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm md:hidden"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-border bg-popover shadow-soft"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="grid size-7 place-items-center rounded-md gradient-brand">
                  <Zap className="size-4 text-brand-foreground" />
                </div>
                <div>
                  <p className="font-display text-sm font-bold">Live JSON Console</p>
                  <p className="text-[11px] text-muted-foreground">
                    {lastOrder ? "Last submitted payload" : "Live preview as you build the order"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="border-b border-border p-3">
              <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                POST endpoint
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs outline-none focus:border-brand"
                />
                <button
                  onClick={post}
                  disabled={!previewObj || posting === "loading"}
                  className="inline-flex items-center gap-1.5 rounded-lg gradient-brand px-3 py-2 text-xs font-semibold text-brand-foreground disabled:opacity-50"
                >
                  {posting === "loading" ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="size-3 rounded-full border-2 border-brand-foreground border-t-transparent"
                    />
                  ) : posting === "ok" ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Send className="size-3.5" />
                  )}
                  POST
                </button>
              </div>
              {posting === "ok" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-[11px] text-success"
                  style={{ color: "oklch(0.72 0.18 155)" }}
                >
                  ✓ 200 OK · Payload accepted by mock endpoint
                </motion.p>
              )}
            </div>

            <div className="flex-1 overflow-auto p-3">
              {previewObj ? (
                <pre className="rounded-xl border border-border bg-background p-4 font-mono text-[11px] leading-relaxed text-foreground">
                  <code>{json}</code>
                </pre>
              ) : (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">No items in cart yet.</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Add items to a restaurant to see the live JSON payload.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 border-t border-border p-3">
              <button
                onClick={copy}
                disabled={!previewObj}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-secondary disabled:opacity-50"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={download}
                disabled={!previewObj}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-secondary disabled:opacity-50"
              >
                <Download className="size-3.5" />
                Export
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
