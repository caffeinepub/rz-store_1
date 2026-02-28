import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Package, ShoppingCart, Tag, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useAddToCart, useProducts } from "../hooks/useQueries";

const PRODUCT_IMAGES: Record<string, string> = {
  watch: "/assets/generated/product-watch.dim_400x400.png",
  bag: "/assets/generated/product-bag.dim_400x400.png",
  handbag: "/assets/generated/product-bag.dim_400x400.png",
  headphone: "/assets/generated/product-headphones.dim_400x400.png",
  necklace: "/assets/generated/product-necklace.dim_400x400.png",
  jewel: "/assets/generated/product-necklace.dim_400x400.png",
  jewelry: "/assets/generated/product-necklace.dim_400x400.png",
  wallet: "/assets/generated/product-wallet.dim_400x400.png",
  perfume: "/assets/generated/product-perfume.dim_400x400.png",
  fragrance: "/assets/generated/product-perfume.dim_400x400.png",
  ring: "/assets/generated/product-rings.dim_400x400.png",
  rings: "/assets/generated/product-rings.dim_400x400.png",
  combo: "/assets/generated/product-rings.dim_400x400.png",
};

function getProductImage(product: Product): string {
  const url = product.imageUrl ?? "";
  // Return any valid local asset or external URL
  if (url.startsWith("http") || url.startsWith("/assets/")) {
    return url;
  }
  // Fall back to keyword matching on name and category
  const search = `${product.name} ${product.category}`.toLowerCase();
  const nameKey = Object.keys(PRODUCT_IMAGES).find((k) => search.includes(k));
  return nameKey
    ? PRODUCT_IMAGES[nameKey]
    : "/assets/generated/rz-store-hero.dim_600x600.png";
}

function formatPrice(paise: bigint): string {
  const rupees = Number(paise) / 100;
  return `₹${rupees.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "oklch(0.60 0.18 260)",
  Fashion: "oklch(0.65 0.18 320)",
  Accessories: "oklch(0.78 0.18 75)",
  Jewelry: "oklch(0.72 0.20 50)",
  Lifestyle: "oklch(0.60 0.16 200)",
  default: "oklch(0.55 0.12 290)",
};

function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const imgSrc = getProductImage(product);

  const handleAddToCart = async () => {
    try {
      await addToCart.mutateAsync({ productId: product.id, quantity: 1n });
      toast.success(`${product.name} added to cart!`, {
        description: "View your cart to checkout",
        icon: "🛒",
      });
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = () => {
    // Store product in sessionStorage so checkout can read it without requiring login
    sessionStorage.setItem(
      "buyNowProduct",
      JSON.stringify({
        id: product.id,
        name: product.name,
        price: product.price.toString(),
        imageUrl: product.imageUrl,
        category: product.category,
        quantity: 1,
      }),
    );
    navigate({ to: "/checkout" });
  };

  const catColor = CATEGORY_COLORS[product.category] ?? CATEGORY_COLORS.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.07,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="product-card glass-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer"
      onClick={() =>
        navigate({
          to: "/product/$productId",
          params: { productId: product.id },
        })
      }
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "220px" }}>
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, oklch(0.10 0.02 275 / 0.8) 0%, transparent 60%)",
          }}
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-xs font-sans font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: `${catColor} / 0.15`,
              backgroundColor: `oklch(from ${catColor} l c h / 0.2)`,
              border: `1px solid ${catColor}`,
              color: catColor,
              backdropFilter: "blur(8px)",
            }}
          >
            <Tag className="inline w-3 h-3 mr-1" />
            {product.category}
          </span>
        </div>
        {/* Stock */}
        {Number(product.stock) <= 5 && Number(product.stock) > 0 && (
          <div className="absolute top-3 right-3">
            <span
              className="text-xs font-sans px-2 py-1 rounded-full"
              style={{
                background: "oklch(0.60 0.22 25 / 0.2)",
                border: "1px solid oklch(0.60 0.22 25)",
                color: "oklch(0.80 0.18 30)",
              }}
            >
              Only {String(product.stock)} left!
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className="font-heading font-bold text-foreground text-base leading-tight line-clamp-1">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2 font-sans">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span
            className="font-display font-black text-xl"
            style={{
              color: "oklch(0.88 0.22 78)",
              textShadow: "0 0 10px oklch(0.78 0.18 75 / 0.4)",
            }}
          >
            {formatPrice(product.price)}
          </span>
          {Number(product.stock) > 0 && (
            <span
              className="text-xs font-sans px-2 py-0.5 rounded-full"
              style={{
                background: "oklch(0.55 0.18 150 / 0.15)",
                border: "1px solid oklch(0.55 0.18 150 / 0.4)",
                color: "oklch(0.70 0.18 150)",
              }}
            >
              In Stock
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={addToCart.isPending || Number(product.stock) === 0}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-sans font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
            style={{
              background: "oklch(0.20 0.04 278)",
              border: "1px solid oklch(0.78 0.18 75 / 0.4)",
              color: "oklch(0.88 0.22 78)",
            }}
          >
            {addToCart.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
            Add to Cart
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleBuyNow();
            }}
            disabled={addToCart.isPending || Number(product.stock) === 0}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-sans font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
              color: "oklch(0.08 0.01 280)",
              boxShadow: "0 0 15px oklch(0.78 0.18 75 / 0.3)",
            }}
          >
            <Zap className="w-4 h-4" />
            Buy
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      <Skeleton
        className="h-[220px] w-full rounded-none"
        style={{ background: "oklch(0.15 0.02 278)" }}
      />
      <div className="p-4 space-y-3">
        <Skeleton
          className="h-5 w-3/4"
          style={{ background: "oklch(0.15 0.02 278)" }}
        />
        <Skeleton
          className="h-4 w-full"
          style={{ background: "oklch(0.15 0.02 278)" }}
        />
        <Skeleton
          className="h-4 w-2/3"
          style={{ background: "oklch(0.15 0.02 278)" }}
        />
        <Skeleton
          className="h-8 w-1/3"
          style={{ background: "oklch(0.15 0.02 278)" }}
        />
        <div className="flex gap-2">
          <Skeleton
            className="h-10 flex-1"
            style={{ background: "oklch(0.15 0.02 278)" }}
          />
          <Skeleton
            className="h-10 w-20"
            style={{ background: "oklch(0.15 0.02 278)" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function StorePage() {
  const { data: products, isLoading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    ...Array.from(new Set(products?.map((p) => p.category) ?? [])),
  ];

  const filtered =
    selectedCategory === "All"
      ? (products ?? [])
      : (products ?? []).filter((p) => p.category === selectedCategory);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--page-bg, oklch(0.08 0.015 280))" }}
    >
      {/* Page header */}
      <div
        className="relative overflow-hidden py-12 px-4"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, oklch(0.20 0.06 278 / 0.6) 0%, transparent 70%)",
          borderBottom: "1px solid oklch(0.78 0.18 75 / 0.15)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto text-center"
        >
          <h1
            className="font-display font-black text-4xl md:text-5xl text-shimmer"
            style={{ letterSpacing: "0.08em" }}
          >
            OUR COLLECTION
          </h1>
          <p className="text-muted-foreground font-sans mt-2 text-sm tracking-widest uppercase">
            ✦ Handpicked Luxury Items ✦
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Category filter */}
        {!isLoading && categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-2 flex-wrap mb-8"
          >
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-2 rounded-full text-sm font-sans font-medium transition-all duration-200"
                style={
                  selectedCategory === cat
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
                        color: "oklch(0.08 0.01 280)",
                        boxShadow: "0 0 15px oklch(0.78 0.18 75 / 0.4)",
                      }
                    : {
                        background: "oklch(0.15 0.025 278)",
                        border: "1px solid oklch(0.30 0.05 278)",
                        color: "oklch(0.65 0.04 78)",
                      }
                }
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-20">
            <p className="text-destructive">
              Failed to load products. Please refresh.
            </p>
          </div>
        )}

        {/* Products grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <SkeletonCard key={`sk-${i}`} index={i} />
              ))}
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "oklch(0.15 0.03 278)",
                  border: "1px solid oklch(0.78 0.18 75 / 0.2)",
                }}
              >
                <Package
                  className="w-10 h-10"
                  style={{ color: "oklch(0.78 0.18 75)" }}
                />
              </div>
              <p className="text-muted-foreground font-sans text-lg">
                No products found
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className="text-sm font-sans"
                style={{ color: "oklch(0.78 0.18 75)" }}
              >
                Clear filter
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
