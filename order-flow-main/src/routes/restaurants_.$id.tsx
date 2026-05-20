import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Leaf, Minus, Plus, Star } from "lucide-react";
import { restaurants } from "@/data/restaurants";
import { useApp } from "@/store/useApp";

export const Route = createFileRoute("/restaurants_/$id")({
  loader: ({ params }) => {
    const r = restaurants.find((x) => x.id === params.id);
    if (!r) throw notFound();
    return { restaurant: r };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.restaurant.name ?? "Restaurant"} — swft` },
      {
        name: "description",
        content: loaderData?.restaurant
          ? `Order from ${loaderData.restaurant.name} (${loaderData.restaurant.cuisine}) on swft.`
          : "Restaurant on swft.",
      },
    ],
  }),
  component: RestaurantDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center">
      <h1 className="font-display text-4xl font-bold">Restaurant not found</h1>
      <Link to="/restaurants" className="mt-4 inline-block text-brand hover:underline">
        Back to restaurants
      </Link>
    </div>
  ),
});

function RestaurantDetail() {
  const { restaurant: r } = Route.useLoaderData();
  const navigate = useNavigate();
  const cart = useApp((s) => s.cart);
  const cartRid = useApp((s) => s.cartRestaurantId);
  const addToCart = useApp((s) => s.addToCart);
  const decrement = useApp((s) => s.decrement);

  const qty = (id: string) => (cartRid === r.id ? cart.find((c) => c.id === id)?.quantity ?? 0 : 0);
  const totalQty = cartRid === r.id ? cart.reduce((a, c) => a + c.quantity, 0) : 0;
  const totalAmount = cartRid === r.id ? cart.reduce((a, c) => a + c.price * c.quantity, 0) : 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <Link
        to="/restaurants"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All restaurants
      </Link>

      {/* hero */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 grid gap-6 md:grid-cols-[1.2fr_1fr]"
      >
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src={r.image}
            alt={r.name}
            width={1024}
            height={768}
            className="h-72 w-full object-cover md:h-96"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-brand">{r.cuisine}</p>
            <h1 className="font-display text-4xl font-bold md:text-5xl">{r.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{r.address}</p>
          </div>
        </div>
        <div className="glass rounded-3xl p-6">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Rating" value={`★ ${r.rating}`} />
            <Stat label="Delivery" value={`${r.deliveryMins} min`} />
            <Stat label="Cost / 2" value={`₹${r.priceForTwo}`} />
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4" /> Prep time ~ {r.prepMins} min
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Star className="size-4" /> {r.rating} stars · {r.tags.join(" · ")}
            </p>
          </div>
          <div className="mt-5 rounded-xl bg-background/60 p-3 font-mono text-[11px] text-muted-foreground">
            <span className="text-brand">pickup</span> · {r.coords.lat}, {r.coords.lng}
          </div>
        </div>
      </motion.div>

      {/* menu */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Menu</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {r.menu.map((item: typeof r.menu[number], i: number) => {
            const q = qty(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass flex items-start justify-between gap-4 rounded-2xl p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`grid size-4 place-items-center rounded-sm border ${
                        item.veg ? "border-success" : "border-destructive"
                      }`}
                      style={{ borderColor: item.veg ? "oklch(0.72 0.18 155)" : undefined }}
                    >
                      <span
                        className={`size-1.5 rounded-full ${item.veg ? "bg-success" : "bg-destructive"}`}
                        style={{ background: item.veg ? "oklch(0.72 0.18 155)" : undefined }}
                      />
                    </span>
                    <p className="font-display text-base font-semibold">{item.name}</p>
                    {item.veg && <Leaf className="size-3.5 text-success" style={{ color: "oklch(0.72 0.18 155)" }} />}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  <p className="mt-2 font-semibold">₹{item.price}</p>
                </div>
                {q === 0 ? (
                  <button
                    onClick={() => addToCart(r, item)}
                    className="rounded-xl border border-brand bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-brand-foreground"
                  >
                    Add
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1 rounded-xl border border-brand bg-brand/10 p-1">
                    <button
                      onClick={() => decrement(item.id)}
                      className="grid size-7 place-items-center rounded-lg text-brand hover:bg-brand hover:text-brand-foreground"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="min-w-6 text-center text-sm font-semibold text-brand">{q}</span>
                    <button
                      onClick={() => addToCart(r, item)}
                      className="grid size-7 place-items-center rounded-lg text-brand hover:bg-brand hover:text-brand-foreground"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* sticky cart bar */}
      {totalQty > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed inset-x-3 bottom-3 z-30 mx-auto max-w-md md:inset-x-auto md:right-6"
        >
          <button
            onClick={() => navigate({ to: "/checkout" })}
            className="flex w-full items-center justify-between gap-4 rounded-2xl gradient-brand px-5 py-4 text-brand-foreground shadow-glow"
          >
            <span className="text-sm font-semibold">
              {totalQty} item{totalQty > 1 ? "s" : ""} · ₹{totalAmount}
            </span>
            <span className="text-sm font-bold">Checkout →</span>
          </button>
        </motion.div>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background/40 p-3 text-center">
      <p className="font-display text-base font-bold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
