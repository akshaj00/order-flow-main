import { motion } from "framer-motion";

type Coords = { lat: number; lng: number };

export function MapVisual({
  pickup,
  drop,
  pickupLabel = "Pickup",
  dropLabel = "Drop",
  animated = true,
  height = 280,
}: {
  pickup: Coords;
  drop: Coords;
  pickupLabel?: string;
  dropLabel?: string;
  animated?: boolean;
  height?: number;
}) {
  // Project coords to SVG space
  const all = [pickup, drop];
  const minLat = Math.min(...all.map((c) => c.lat));
  const maxLat = Math.max(...all.map((c) => c.lat));
  const minLng = Math.min(...all.map((c) => c.lng));
  const maxLng = Math.max(...all.map((c) => c.lng));
  const padLat = Math.max((maxLat - minLat) * 0.4, 0.01);
  const padLng = Math.max((maxLng - minLng) * 0.4, 0.01);

  const project = (c: Coords) => {
    const x = ((c.lng - (minLng - padLng)) / (maxLng - minLng + 2 * padLng)) * 100;
    const y = 100 - ((c.lat - (minLat - padLat)) / (maxLat - minLat + 2 * padLat)) * 100;
    return { x, y };
  };

  const p = project(pickup);
  const d = project(drop);
  // curved path control point
  const mx = (p.x + d.x) / 2;
  const my = (p.y + d.y) / 2 - 18;

  // Haversine
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(drop.lat - pickup.lat);
  const dLng = toRad(drop.lng - pickup.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(pickup.lat)) * Math.cos(toRad(drop.lat)) * Math.sin(dLng / 2) ** 2;
  const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const eta = Math.max(8, Math.round((distance / 25) * 60)); // 25 km/h avg

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-secondary"
      style={{ height }}
    >
      {/* grid background */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M 6 0 L 0 0 0 6" fill="none" stroke="currentColor" strokeWidth="0.15" className="text-border" />
          </pattern>
          <radialGradient id="glow-pickup" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.78 0.18 45)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="oklch(0.78 0.18 45)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-drop" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.62 0.25 350)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="oklch(0.62 0.25 350)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="route" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.78 0.18 45)" />
            <stop offset="100%" stopColor="oklch(0.62 0.25 350)" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />

        {/* fake roads */}
        <g stroke="currentColor" className="text-border" strokeWidth="0.4" fill="none" opacity="0.6">
          <path d={`M 0 ${p.y + 15} Q 30 ${p.y + 5} 100 ${p.y + 20}`} />
          <path d={`M 0 ${d.y - 10} Q 60 ${d.y + 10} 100 ${d.y - 5}`} />
          <path d={`M ${p.x - 10} 0 Q ${p.x} 50 ${p.x + 8} 100`} />
          <path d={`M ${d.x + 5} 0 Q ${d.x - 5} 60 ${d.x + 10} 100`} />
        </g>

        {/* glow circles */}
        <circle cx={p.x} cy={p.y} r="14" fill="url(#glow-pickup)" />
        <circle cx={d.x} cy={d.y} r="14" fill="url(#glow-drop)" />

        {/* route */}
        <path
          d={`M ${p.x} ${p.y} Q ${mx} ${my} ${d.x} ${d.y}`}
          stroke="url(#route)"
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="2 2"
          className={animated ? "animate-dash" : ""}
        />

        {/* pickup marker */}
        <g>
          <circle cx={p.x} cy={p.y} r="2.2" fill="oklch(0.78 0.18 45)" stroke="white" strokeWidth="0.5" />
          {animated && (
            <circle cx={p.x} cy={p.y} r="2.2" fill="none" stroke="oklch(0.78 0.18 45)" strokeWidth="0.4">
              <animate attributeName="r" from="2.2" to="6" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
            </circle>
          )}
        </g>
        {/* drop marker */}
        <g>
          <circle cx={d.x} cy={d.y} r="2.2" fill="oklch(0.62 0.25 350)" stroke="white" strokeWidth="0.5" />
          {animated && (
            <circle cx={d.x} cy={d.y} r="2.2" fill="none" stroke="oklch(0.62 0.25 350)" strokeWidth="0.4">
              <animate attributeName="r" from="2.2" to="6" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
            </circle>
          )}
        </g>
      </svg>

      {/* Labels */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-3 top-3 rounded-lg bg-background/80 px-2.5 py-1.5 text-[11px] font-medium backdrop-blur-md"
      >
        <span className="mr-1.5 inline-block size-2 rounded-full bg-brand" />
        {pickupLabel}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute right-3 bottom-3 rounded-lg bg-background/80 px-2.5 py-1.5 text-[11px] font-medium backdrop-blur-md"
      >
        <span className="mr-1.5 inline-block size-2 rounded-full" style={{ background: "oklch(0.62 0.25 350)" }} />
        {dropLabel}
      </motion.div>

      {/* Stats */}
      <div className="absolute bottom-3 left-3 flex gap-2">
        <div className="rounded-lg bg-background/80 px-2.5 py-1.5 text-[11px] font-medium backdrop-blur-md">
          <span className="text-muted-foreground">Distance</span>{" "}
          <span className="font-semibold">{distance.toFixed(1)} km</span>
        </div>
        <div className="rounded-lg bg-background/80 px-2.5 py-1.5 text-[11px] font-medium backdrop-blur-md">
          <span className="text-muted-foreground">ETA</span>{" "}
          <span className="font-semibold">{eta} min</span>
        </div>
      </div>
    </div>
  );
}
