import { Link, useRouterState } from "@tanstack/react-router";
import { useApp } from "@/store/useApp";
import { ShoppingBag, Code2, Sun, Moon, Flame } from "lucide-react";
import { motion } from "framer-motion";

export function NavBar() {
  const cart = useApp((s) => s.cart);
  const setDevOpen = useApp((s) => s.setDevOpen);
  const devOpen = useApp((s) => s.devOpen);
  const theme = useApp((s) => s.theme);
  const toggleTheme = useApp((s) => s.toggleTheme);
  const count = cart.reduce((a, c) => a + c.quantity, 0);
  const path = useRouterState({ select: (s) => s.location.pathname });

  const links = [
    { to: "/", label: "Home" },
    { to: "/restaurants", label: "Restaurants" },
    { to: "/checkout", label: "Cart" },
  ];

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl gradient-brand shadow-glow">
            <Flame className="size-5 text-brand-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            swft<span className="text-gradient-brand">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = path === l.to || (l.to !== "/" && path.startsWith(l.to));
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="navpill"
                    className="absolute inset-0 -z-10 rounded-lg bg-secondary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="grid size-10 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <button
            onClick={() => setDevOpen(!devOpen)}
            className={`hidden items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors md:inline-flex ${
              devOpen
                ? "border-brand bg-brand/10 text-brand"
                : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Code2 className="size-4" />
            JSON
          </button>
          <Link
            to="/checkout"
            className="relative inline-flex items-center gap-2 rounded-xl gradient-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-glow transition-transform hover:scale-105"
          >
            <ShoppingBag className="size-4" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="grid size-5 place-items-center rounded-full bg-background text-[11px] font-bold text-foreground"
              >
                {count}
              </motion.span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
