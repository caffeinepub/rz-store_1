import { Link, useRouterState } from "@tanstack/react-router";
import {
  MessageSquare,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useCart } from "../hooks/useQueries";

export default function Navbar() {
  const { data: cart } = useCart();
  const cartCount =
    cart?.reduce((sum, item) => sum + Number(item.quantity), 0) ?? 0;
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const [prevCount, setPrevCount] = useState(cartCount);
  const [badgePulse, setBadgePulse] = useState(false);

  useEffect(() => {
    if (cartCount > prevCount) {
      setBadgePulse(true);
      const t = setTimeout(() => setBadgePulse(false), 500);
      return () => clearTimeout(t);
    }
    setPrevCount(cartCount);
  }, [cartCount, prevCount]);

  const navLinks = [
    { to: "/store", label: "Store", icon: Store },
    { to: "/feedback", label: "Feedback", icon: MessageSquare },
  ];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 glass-card border-b"
      style={{ borderColor: "oklch(0.78 0.18 75 / 0.2)" }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/store" className="flex items-center gap-2 group">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
              boxShadow: "0 0 15px oklch(0.78 0.18 75 / 0.4)",
            }}
          >
            <Sparkles
              className="w-4 h-4"
              style={{ color: "oklch(0.08 0.01 280)" }}
            />
          </div>
          <span className="font-display font-bold text-lg tracking-wider text-shimmer hidden sm:block">
            RZ STORE.IN
          </span>
          <span className="font-display font-bold text-lg tracking-wider text-shimmer sm:hidden">
            RZ
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = pathname === to || pathname.startsWith(`${to}/`);
            return (
              <Link
                key={to}
                to={to}
                className={`nav-link flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors ${
                  isActive
                    ? "text-gold-bright"
                    : "text-muted-foreground hover:text-foreground"
                } ${isActive ? "active" : ""}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}

          {/* Cart */}
          <Link
            to="/cart"
            className={`nav-link relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors ${
              pathname === "/cart"
                ? "text-gold-bright active"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span
                  className={`absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1 ${badgePulse ? "animate-bounce-badge" : ""}`}
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
                    color: "oklch(0.08 0.01 280)",
                    boxShadow: "0 0 8px oklch(0.78 0.18 75 / 0.5)",
                  }}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
