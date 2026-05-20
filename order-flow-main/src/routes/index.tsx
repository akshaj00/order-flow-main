import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Code2, MapPin, Sparkles, Zap } from "lucide-react";
import heroImg from "@/assets/hero-food.jpg";
import { restaurants } from "@/data/restaurants";
import { useApp } from "@/store/useApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "swft — Order food, generate JSON in real time" },
      {
        name: "description",
        content:
          "A premium food ordering UI that streams structured JSON delivery requests to any backend the moment a customer checks out.",
      },
      { property: "og:title", content: "swft — Order food, generate JSON in real time" },
      { property: "og:description", content: "Premium ordering experience with a live developer console." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const setDevOpen = useApp((s) => s.setDevOpen);
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-12 md:grid-cols-2 md:gap-8 md:px-8 md:pb-24 md:pt-20">
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
            >
              <Sparkles className="size-3.5 text-brand" />
              Smart order-to-JSON pipeline
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
            >
              Crave it.<br />
              <span className="text-gradient-brand">Order it.</span>
              <br />
              Stream it.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-5 max-w-md text-base text-muted-foreground md:text-lg"
            >
              A premium food ordering experience for customers — and a real-time JSON delivery
              request generator for everything behind the scenes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/restaurants"
                className="inline-flex items-center gap-2 rounded-xl gradient-brand px-5 py-3 font-semibold text-brand-foreground shadow-glow transition-transform hover:scale-105"
              >
                Order now <ArrowRight className="size-4" />
              </Link>
              <button
                onClick={() => setDevOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-5 py-3 font-semibold backdrop-blur transition-colors hover:bg-secondary"
              >
                <Code2 className="size-4 text-brand" /> See live JSON
              </button>
            </motion.div>

            <div className="mt-10 grid grid-cols-3 gap-3 md:gap-6">
              {[
                { k: "12k+", v: "Restaurants" },
                { k: "<25 min", v: "Avg delivery" },
                { k: "99.9%", v: "JSON uptime" },
              ].map((s) => (
                <div key={s.v} className="glass rounded-xl p-3 md:p-4">
                  <p className="font-display text-lg font-bold md:text-2xl">{s.k}</p>
                  <p className="text-xs text-muted-foreground">{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image stack */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-soft md:aspect-[4/5]"
            >
              <img
                src={heroImg}
                alt="Premium spread of curries, biryani and breads"
                width={1536}
                height={1024}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </motion.div>

            {/* floating cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="animate-float absolute -left-3 top-10 w-44 glass rounded-2xl p-3 md:-left-8"
            >
              <div className="flex items-center gap-2">
                <div className="grid size-9 place-items-center rounded-lg gradient-brand">
                  <Zap className="size-4 text-brand-foreground" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Order placed</p>
                  <p className="font-mono text-xs font-semibold">ORD2048</p>
                </div>
              </div>
              <div className="mt-2 rounded-md bg-background/60 p-2 font-mono text-[10px] text-muted-foreground">
                <span className="text-brand">POST</span> /api/orders → 200
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="animate-float absolute -right-2 bottom-12 w-52 glass rounded-2xl p-3 md:-right-6"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-brand" />
                <p className="text-xs font-semibold">MG Road → BTM</p>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">8.2 km · 22 min ETA</p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                  className="h-full gradient-brand"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "Beautiful ordering",
              desc: "Browse restaurants, customize your cart, and check out with a single tap.",
            },
            {
              icon: MapPin,
              title: "Pickup + drop coords",
              desc: "Every order ships with restaurant pickup and customer drop coordinates baked in.",
            },
            {
              icon: Code2,
              title: "Live JSON console",
              desc: "Inspect, copy, export, or POST the structured order payload — in real time.",
            },
          ].map((f) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 transition-transform hover:-translate-y-1"
            >
              <div className="grid size-11 place-items-center rounded-xl gradient-brand shadow-glow">
                <f.icon className="size-5 text-brand-foreground" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Trending now</h2>
            <p className="mt-1 text-sm text-muted-foreground">A taste of what's on swft tonight.</p>
          </div>
          <Link to="/restaurants" className="text-sm font-semibold text-brand hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.slice(0, 3).map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to="/restaurants/$id"
                params={{ id: r.id }}
                className="group block overflow-hidden rounded-2xl border border-border bg-card transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-[5/4] overflow-hidden">
                  <img
                    src={r.image}
                    alt={r.name}
                    width={1024}
                    height={768}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute right-3 top-3 rounded-lg bg-background/80 px-2 py-1 text-xs font-semibold backdrop-blur">
                    ★ {r.rating}
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-display text-lg font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.cuisine} · {r.deliveryMins} min</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
