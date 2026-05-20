import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Star, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { cuisines, restaurants } from "@/data/restaurants";

export const Route = createFileRoute("/restaurants")({
  head: () => ({
    meta: [
      { title: "Restaurants — swft" },
      { name: "description", content: "Browse top restaurants near you and order in seconds." },
      { property: "og:title", content: "Restaurants — swft" },
    ],
  }),
  component: RestaurantsPage,
});

function RestaurantsPage() {
  const [q, setQ] = useState("");
  const [cuisine, setCuisine] = useState("All");

  const list = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesQ =
        !q ||
        r.name.toLowerCase().includes(q.toLowerCase()) ||
        r.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()));
      const matchesC = cuisine === "All" || r.cuisine === cuisine || r.tags.includes(cuisine);
      return matchesQ && matchesC;
    });
  }, [q, cuisine]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="font-display text-4xl font-bold md:text-5xl">Restaurants</h1>
        <p className="text-muted-foreground">Hand-picked spots, ready to deliver.</p>
      </motion.div>

      {/* search + filters */}
      <div className="mt-6 glass rounded-2xl p-3 md:p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search restaurants, cuisines, dishes..."
            className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none focus:border-brand"
          />
        </div>
        <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto pb-1">
          {cuisines.map((c) => (
            <button
              key={c}
              onClick={() => setCuisine(c)}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                cuisine === c
                  ? "border-transparent gradient-brand text-brand-foreground"
                  : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* grid */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link
              to="/restaurants/$id"
              params={{ id: r.id }}
              className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <img
                  src={r.image}
                  alt={r.name}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/0 to-transparent" />
                <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg bg-background/85 px-2 py-1 text-xs font-semibold backdrop-blur">
                  <Star className="size-3 fill-brand text-brand" /> {r.rating}
                </div>
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-lg bg-background/85 px-2 py-1 text-xs font-medium backdrop-blur">
                  <Clock className="size-3 text-muted-foreground" /> {r.deliveryMins} min
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display text-lg font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">₹{r.priceForTwo} for two</p>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{r.cuisine} · {r.address}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {r.tags.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
        {list.length === 0 && (
          <p className="col-span-full py-20 text-center text-muted-foreground">No restaurants match your search.</p>
        )}
      </div>
    </main>
  );
}
