import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Package,
  ShoppingCart,
  Tag,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAddToCart, useProduct } from "../hooks/useQueries";

const RING_IMAGES = [
  "/assets/uploads/71zxD1jyn8L._AC_UL1500_-1.jpg",
  "/assets/uploads/41M5g7nvyoL._AC_UL1500_-2.jpg",
  "/assets/uploads/714-E8ZPX2L._AC_UL1500_-3.jpg",
  "/assets/uploads/41GYW9xLlwL._AC_UL1500_-4.jpg",
  "/assets/uploads/81uHl-d8k8L._AC_UL1500_-5.jpg",
  "/assets/uploads/51HvMWdXAKL._AC_UL1500_-6.jpg",
];

const RING_IMAGE_LABELS = [
  "Silver Ring on Hand",
  "Black Dragon Ring",
  "Grooved Design Ring",
  "Dark Ring on Hand",
  "4-Ring Combo",
  "Red Dragon Tungsten",
];

const PRODUCT_IMAGES: Record<string, string> = {
  watch: "/assets/generated/product-watch.dim_400x400.png",
  bag: "/assets/generated/product-bag.dim_400x400.png",
  handbag: "/assets/generated/product-bag.dim_400x400.png",
  headphone: "/assets/generated/product-headphones.dim_400x400.png",
  necklace: "/assets/generated/product-necklace.dim_400x400.png",
  jewel: "/assets/generated/product-necklace.dim_400x400.png",
  wallet: "/assets/generated/product-wallet.dim_400x400.png",
  perfume: "/assets/generated/product-perfume.dim_400x400.png",
  fragrance: "/assets/generated/product-perfume.dim_400x400.png",
};

const RING_SIZES = [17, 18, 19, 20, 21];

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "oklch(0.60 0.18 260)",
  Fashion: "oklch(0.65 0.18 320)",
  Accessories: "oklch(0.78 0.18 75)",
  Jewelry: "oklch(0.72 0.20 50)",
  Lifestyle: "oklch(0.60 0.16 200)",
  default: "oklch(0.55 0.12 290)",
};

function formatPrice(paise: bigint): string {
  const rupees = Number(paise) / 100;
  return `₹${rupees.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

interface CarouselProps {
  images: string[];
  labels?: string[];
}

function ImageCarousel({ images, labels }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStart(e.clientX);
    setDragDelta(0);
    setIsDragging(false);
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStart === null) return;
    const delta = e.clientX - dragStart;
    setDragDelta(delta);
    if (Math.abs(delta) > 5) setIsDragging(true);
  };

  const handlePointerUp = () => {
    if (dragStart !== null && Math.abs(dragDelta) > 50) {
      if (dragDelta < 0) next();
      else prev();
    }
    setDragStart(null);
    setDragDelta(0);
    setTimeout(() => setIsDragging(false), 50);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl select-none"
        style={{
          background: "oklch(0.12 0.02 278)",
          border: "1px solid oklch(0.78 0.18 75 / 0.2)",
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "pan-y",
          aspectRatio: "1 / 1",
          maxHeight: "480px",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt={labels?.[current] ?? `Image ${current + 1}`}
            initial={{ opacity: 0, x: dragDelta > 0 ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </AnimatePresence>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 60%, oklch(0.08 0.015 280 / 0.6) 100%)",
          }}
        />

        {/* Arrow buttons */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{
                background: "oklch(0.10 0.02 280 / 0.8)",
                border: "1px solid oklch(0.78 0.18 75 / 0.3)",
                color: "oklch(0.88 0.22 78)",
                backdropFilter: "blur(8px)",
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{
                background: "oklch(0.10 0.02 280 / 0.8)",
                border: "1px solid oklch(0.78 0.18 75 / 0.3)",
                color: "oklch(0.88 0.22 78)",
                backdropFilter: "blur(8px)",
              }}
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter badge */}
        <div
          className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-sans font-medium"
          style={{
            background: "oklch(0.10 0.02 280 / 0.8)",
            border: "1px solid oklch(0.78 0.18 75 / 0.3)",
            color: "oklch(0.80 0.10 78)",
            backdropFilter: "blur(8px)",
          }}
        >
          {current + 1} / {images.length}
        </div>
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {images.map((img, i) => (
            <button
              key={`dot-${img}`}
              type="button"
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? "20px" : "8px",
                height: "8px",
                background:
                  i === current
                    ? "linear-gradient(90deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))"
                    : "oklch(0.35 0.05 278)",
                boxShadow:
                  i === current ? "0 0 8px oklch(0.78 0.18 75 / 0.5)" : "none",
              }}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((img, i) => (
            <button
              key={`thumb-${img}`}
              type="button"
              onClick={() => setCurrent(i)}
              className="flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200"
              style={{
                width: "72px",
                height: "72px",
                border:
                  i === current
                    ? "2px solid oklch(0.78 0.18 75)"
                    : "2px solid oklch(0.25 0.04 278)",
                boxShadow:
                  i === current ? "0 0 10px oklch(0.78 0.18 75 / 0.4)" : "none",
                opacity: i === current ? 1 : 0.6,
              }}
              aria-label={labels?.[i] ?? `Thumbnail ${i + 1}`}
            >
              <img
                src={img}
                alt={labels?.[i] ?? `Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams({ from: "/store-layout/product/$productId" });
  const productId = params.productId;
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const { data: product, isLoading, error } = useProduct(productId);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  const isRingProduct = product?.name?.toLowerCase().includes("ring") ?? false;

  const isAccessory =
    product?.category?.toLowerCase() === "accessories" || isRingProduct;

  const images = isRingProduct
    ? RING_IMAGES
    : product?.imageUrl
      ? (() => {
          if (product.imageUrl.startsWith("http")) return [product.imageUrl];
          const nameKey = Object.keys(PRODUCT_IMAGES).find(
            (k) =>
              product.name.toLowerCase().includes(k) ||
              product.category.toLowerCase().includes(k),
          );
          return [
            nameKey
              ? PRODUCT_IMAGES[nameKey]
              : "/assets/generated/rz-store-hero.dim_600x600.png",
          ];
        })()
      : ["/assets/generated/rz-store-hero.dim_600x600.png"];

  const imageLabels = isRingProduct ? RING_IMAGE_LABELS : undefined;

  const catColor =
    CATEGORY_COLORS[product?.category ?? ""] ?? CATEGORY_COLORS.default;

  const handleAddToCart = async () => {
    try {
      await addToCart.mutateAsync({ productId, quantity: 1n });
      toast.success(`${product?.name} added to cart!`, {
        description: "View your cart to checkout",
        icon: "🛒",
      });
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
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

  // Auto-select first size
  useEffect(() => {
    if (isAccessory && selectedSize === null) {
      setSelectedSize(RING_SIZES[0]);
    }
  }, [isAccessory, selectedSize]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.08 0.015 280)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2
            className="w-12 h-12 animate-spin"
            style={{ color: "oklch(0.78 0.18 75)" }}
          />
          <p className="text-muted-foreground font-sans">Loading product…</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.08 0.015 280)" }}
      >
        <div className="flex flex-col items-center gap-6 text-center px-4">
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
          <div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">
              Product Not Found
            </h2>
            <p className="text-muted-foreground font-sans text-sm">
              This product doesn't exist or may have been removed.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/store" })}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-sans font-semibold transition-all hover:opacity-90"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
              color: "oklch(0.08 0.01 280)",
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.08 0.015 280)" }}
    >
      {/* Back button bar */}
      <div
        className="px-4 py-4"
        style={{ borderBottom: "1px solid oklch(0.78 0.18 75 / 0.1)" }}
      >
        <div className="max-w-7xl mx-auto">
          <button
            type="button"
            onClick={() => navigate({ to: "/store" })}
            className="flex items-center gap-2 text-sm font-sans font-medium transition-all hover:opacity-80 group"
            style={{ color: "oklch(0.65 0.08 78)" }}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Store
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Image carousel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <ImageCarousel images={images} labels={imageLabels} />
          </motion.div>

          {/* Right: Product info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Category + stock */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-xs font-sans font-semibold px-3 py-1.5 rounded-full flex items-center gap-1"
                style={{
                  backgroundColor: `oklch(from ${catColor} l c h / 0.15)`,
                  border: `1px solid ${catColor}`,
                  color: catColor,
                }}
              >
                <Tag className="w-3 h-3" />
                {product.category}
              </span>
              {Number(product.stock) > 0 ? (
                <span
                  className="text-xs font-sans px-3 py-1.5 rounded-full"
                  style={{
                    background: "oklch(0.55 0.18 150 / 0.15)",
                    border: "1px solid oklch(0.55 0.18 150 / 0.4)",
                    color: "oklch(0.70 0.18 150)",
                  }}
                >
                  ✓ In Stock ({String(product.stock)} available)
                </span>
              ) : (
                <span
                  className="text-xs font-sans px-3 py-1.5 rounded-full"
                  style={{
                    background: "oklch(0.50 0.20 25 / 0.15)",
                    border: "1px solid oklch(0.50 0.20 25 / 0.4)",
                    color: "oklch(0.65 0.18 30)",
                  }}
                >
                  Out of Stock
                </span>
              )}
            </div>

            {/* Name */}
            <div>
              <h1
                className="font-display font-black text-3xl md:text-4xl leading-tight"
                style={{
                  color: "oklch(0.92 0.05 80)",
                  textShadow: "0 0 30px oklch(0.78 0.18 75 / 0.2)",
                }}
              >
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span
                className="font-display font-black text-4xl"
                style={{
                  color: "oklch(0.88 0.22 78)",
                  textShadow: "0 0 20px oklch(0.78 0.18 75 / 0.5)",
                }}
              >
                {formatPrice(product.price)}
              </span>
              <span className="text-muted-foreground font-sans text-sm mb-1">
                incl. taxes
              </span>
            </div>

            {/* Description */}
            <div
              className="rounded-xl p-4"
              style={{
                background: "oklch(0.12 0.025 278)",
                border: "1px solid oklch(0.25 0.04 278)",
              }}
            >
              <h3
                className="font-heading font-semibold text-sm uppercase tracking-widest mb-2"
                style={{ color: "oklch(0.65 0.10 78)" }}
              >
                Description
              </h3>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size selector */}
            {isAccessory && (
              <div>
                <h3
                  className="font-heading font-semibold text-sm uppercase tracking-widest mb-3"
                  style={{ color: "oklch(0.65 0.10 78)" }}
                >
                  Ring Size (mm)
                  {selectedSize && (
                    <span
                      className="ml-2 normal-case font-normal"
                      style={{ color: "oklch(0.88 0.22 78)" }}
                    >
                      — Selected: {selectedSize}
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {RING_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className="w-12 h-12 rounded-xl font-sans font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                      style={
                        selectedSize === size
                          ? {
                              background:
                                "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
                              color: "oklch(0.08 0.01 280)",
                              boxShadow: "0 0 15px oklch(0.78 0.18 75 / 0.5)",
                              border: "2px solid oklch(0.88 0.22 78)",
                            }
                          : {
                              background: "oklch(0.15 0.025 278)",
                              border: "1.5px solid oklch(0.35 0.06 278)",
                              color: "oklch(0.70 0.04 78)",
                            }
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground font-sans mt-2">
                  Size in millimeters (inner diameter). Most adults wear 17–20.
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={addToCart.isPending || Number(product.stock) === 0}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-sans font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "oklch(0.18 0.04 278)",
                  border: "1.5px solid oklch(0.78 0.18 75 / 0.5)",
                  color: "oklch(0.88 0.22 78)",
                }}
              >
                {addToCart.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ShoppingCart className="w-5 h-5" />
                )}
                Add to Cart
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleBuyNow}
                disabled={addToCart.isPending || Number(product.stock) === 0}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-sans font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
                  color: "oklch(0.08 0.01 280)",
                  boxShadow: "0 0 25px oklch(0.78 0.18 75 / 0.4)",
                }}
              >
                <Zap className="w-5 h-5" />
                Buy Now
              </motion.button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-4 flex-wrap pt-2">
              {[
                { icon: "🔒", label: "Secure Checkout" },
                { icon: "🚀", label: "Fast Delivery" },
                { icon: "💎", label: "Premium Quality" },
                { icon: "🔄", label: "Easy Returns" },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground font-sans"
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
