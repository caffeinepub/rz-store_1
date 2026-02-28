import { Link } from "@tanstack/react-router";
import { Heart, Sparkles } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="mt-auto py-8 px-4"
      style={{
        borderTop: "1px solid oklch(0.78 0.18 75 / 0.1)",
        background: "oklch(0.07 0.018 280)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
              }}
            >
              <Sparkles
                className="w-3.5 h-3.5"
                style={{ color: "oklch(0.08 0.01 280)" }}
              />
            </div>
            <span
              className="font-display font-bold text-sm tracking-widest"
              style={{ color: "oklch(0.78 0.18 75)" }}
            >
              RZ STORE.IN
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-5">
            {[
              { to: "/store", label: "Store" },
              { to: "/cart", label: "Cart" },
              { to: "/feedback", label: "Feedback" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-xs text-muted-foreground font-sans hover:text-gold-bright transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground font-sans flex items-center gap-1">
            © {year}. Built with{" "}
            <Heart
              className="w-3 h-3 fill-current"
              style={{ color: "oklch(0.70 0.20 25)" }}
            />{" "}
            using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              style={{ color: "oklch(0.78 0.18 75)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
