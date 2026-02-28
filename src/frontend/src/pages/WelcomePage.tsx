import { useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Sparkles, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/* ---------- Particle ---------- */
interface Particle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  driftX: number;
  type: "circle" | "star" | "diamond";
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: Math.random() * 6 + 2,
    delay: Math.random() * 8,
    duration: Math.random() * 8 + 6,
    driftX: (Math.random() - 0.5) * 80,
    type: (["circle", "star", "diamond"] as const)[
      Math.floor(Math.random() * 3)
    ],
  }));
}

const TITLE = "WELCOME TO RZ STORE.IN";

/* ---------- LetterReveal ---------- */
function LetterReveal({
  text,
  baseDelay = 0,
}: { text: string; baseDelay?: number }) {
  const letters = text.split("").map((char, i) => ({ char, pos: i }));
  return (
    <span aria-label={text}>
      {letters.map(({ char, pos }) => (
        <motion.span
          key={`letter-${pos}`}
          initial={{ opacity: 0, y: 40, skewY: 6 }}
          animate={{ opacity: 1, y: 0, skewY: 0 }}
          transition={{
            delay: baseDelay + pos * 0.04,
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : "normal",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function WelcomePage() {
  const navigate = useNavigate();
  const [particles] = useState(() => generateParticles(40));
  const [showContent, setShowContent] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;
    const t = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, oklch(0.20 0.08 280 / 0.8) 0%, transparent 55%), " +
          "radial-gradient(ellipse at 75% 75%, oklch(0.16 0.06 260 / 0.6) 0%, transparent 55%), " +
          "oklch(0.06 0.02 280)",
      }}
    >
      {/* ---- Particles ---- */}
      <div className="particles-container">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute"
            style={
              {
                left: `${p.x}%`,
                bottom: "-10px",
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationName: "drift-up, twinkle",
                animationDuration: `${p.duration}s, ${p.duration * 0.5}s`,
                animationDelay: `${p.delay}s, ${p.delay * 0.5}s`,
                animationTimingFunction: "ease-in-out, ease-in-out",
                animationIterationCount: "infinite, infinite",
                "--drift-x": `${p.driftX}px`,
                background:
                  p.type === "circle"
                    ? "oklch(0.88 0.22 78)"
                    : "oklch(0.88 0.22 78 / 0.8)",
                borderRadius:
                  p.type === "circle"
                    ? "50%"
                    : p.type === "diamond"
                      ? "2px"
                      : "1px",
                transform: p.type === "diamond" ? "rotate(45deg)" : undefined,
                boxShadow: `0 0 ${p.size * 3}px oklch(0.88 0.22 78 / 0.6)`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* ---- Decorative rings ---- */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.78 0.18 75 / 0.03) 30%, transparent 70%)",
        }}
      />

      {/* ---- Main content ---- */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex flex-col items-center gap-8 px-4 text-center max-w-4xl"
          >
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-gold animate-twinkle" />
              <span
                className="text-sm font-sans tracking-[0.3em] uppercase"
                style={{ color: "oklch(0.78 0.18 75)" }}
              >
                Premium Luxury Shopping
              </span>
              <Sparkles
                className="w-5 h-5 text-gold animate-twinkle"
                style={{ animationDelay: "0.5s" }}
              />
            </motion.div>

            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.4,
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="animate-float"
            >
              <div
                className="relative rounded-full overflow-hidden"
                style={{
                  width: "220px",
                  height: "220px",
                  boxShadow:
                    "0 0 60px oklch(0.78 0.18 75 / 0.5), 0 0 120px oklch(0.78 0.18 75 / 0.2)",
                  border: "3px solid oklch(0.78 0.18 75 / 0.6)",
                }}
              >
                <img
                  src="/assets/generated/rz-store-hero.dim_600x600.png"
                  alt="RZ Store"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle, transparent 50%, oklch(0.06 0.02 280 / 0.4) 100%)",
                  }}
                />
              </div>
            </motion.div>

            {/* Main headline */}
            <div>
              <h1
                className="font-display font-black leading-none"
                style={{
                  fontSize: "clamp(2rem, 6vw, 4.5rem)",
                  letterSpacing: "0.05em",
                  color: "oklch(0.88 0.22 78)",
                  textShadow:
                    "0 0 30px oklch(0.78 0.18 75 / 0.8), 0 0 60px oklch(0.78 0.18 75 / 0.4), 0 0 90px oklch(0.78 0.18 75 / 0.2)",
                }}
              >
                <LetterReveal text={TITLE} baseDelay={0.6} />
              </h1>

              {/* Subtitle shimmer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1 }}
                className="text-shimmer font-heading mt-3 text-lg tracking-widest"
                style={{ letterSpacing: "0.4em" }}
              >
                ✦ Curated Excellence ✦ Unmatched Quality ✦
              </motion.p>
            </div>

            {/* Banner */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4, duration: 0.8 }}
              className="w-full max-w-2xl rounded-xl overflow-hidden border-gold-glow"
              style={{
                boxShadow:
                  "0 0 40px oklch(0.78 0.18 75 / 0.25), 0 20px 40px oklch(0 0 0 / 0.4)",
              }}
            >
              <img
                src="/assets/generated/rz-store-banner.dim_800x400.png"
                alt="RZ Store Banner"
                className="w-full object-cover"
                style={{ maxHeight: "200px" }}
              />
            </motion.div>

            {/* Features row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.7, duration: 0.6 }}
              className="flex items-center gap-6 flex-wrap justify-center"
            >
              {[
                { icon: "🛡️", text: "Secure Payments" },
                { icon: "🚀", text: "Fast Delivery" },
                { icon: "💎", text: "Premium Quality" },
                { icon: "🎁", text: "Gift Wrapping" },
              ].map((feat) => (
                <div
                  key={feat.text}
                  className="flex items-center gap-2 glass-card px-3 py-2 rounded-full"
                  style={{ border: "1px solid oklch(0.78 0.18 75 / 0.2)" }}
                >
                  <span>{feat.icon}</span>
                  <span className="text-xs font-sans text-muted-foreground tracking-wide">
                    {feat.text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 3.0,
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <motion.button
                onClick={() => navigate({ to: "/store" })}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="relative group flex items-center gap-3 px-10 py-4 rounded-full font-display font-bold text-lg tracking-widest uppercase overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78), oklch(0.78 0.18 75))",
                  color: "oklch(0.08 0.01 280)",
                  boxShadow:
                    "0 0 30px oklch(0.78 0.18 75 / 0.5), 0 0 60px oklch(0.78 0.18 75 / 0.25), 0 8px 24px oklch(0 0 0 / 0.4)",
                  letterSpacing: "0.25em",
                  animationName: "glow-pulse",
                  animationDuration: "2s",
                  animationIterationCount: "infinite",
                }}
              >
                {/* Shimmer overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, oklch(1 0 0 / 0.2) 50%, transparent 100%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s linear infinite",
                  }}
                />
                <ShoppingBag className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Enter Store</span>
                <Star className="w-4 h-4 relative z-10 fill-current" />
              </motion.button>
            </motion.div>

            {/* Scroll hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 3.5, duration: 1 }}
              className="text-xs tracking-[0.3em] uppercase font-sans"
              style={{ color: "oklch(0.55 0.04 78)" }}
            >
              Discover · Explore · Indulge
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
