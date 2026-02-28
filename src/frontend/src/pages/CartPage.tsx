import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import {
  useCart,
  useProducts,
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "../hooks/useQueries";

function formatPrice(paise: bigint): string {
  const rupees = Number(paise) / 100;
  return `₹${rupees.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

function EmptyCart() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 gap-6"
    >
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center"
          style={{
            background: "oklch(0.15 0.03 278)",
            border: "2px solid oklch(0.78 0.18 75 / 0.2)",
            boxShadow: "0 0 40px oklch(0.78 0.18 75 / 0.1)",
          }}
        >
          <ShoppingBag
            className="w-14 h-14"
            style={{ color: "oklch(0.78 0.18 75 / 0.5)" }}
          />
        </div>
        <div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full"
          style={{
            background: "oklch(0.78 0.18 75 / 0.2)",
            border: "1px solid oklch(0.78 0.18 75 / 0.3)",
          }}
        />
        <div
          className="absolute bottom-2 -left-2 w-3 h-3 rounded-full"
          style={{
            background: "oklch(0.78 0.18 75 / 0.15)",
            border: "1px solid oklch(0.78 0.18 75 / 0.25)",
          }}
        />
      </motion.div>
      <div className="text-center">
        <h2 className="font-display font-bold text-2xl text-foreground mb-2">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground font-sans text-sm">
          Discover our luxury collection and add items to your cart.
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate({ to: "/store" })}
        className="flex items-center gap-2 px-8 py-3 rounded-xl font-sans font-semibold"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
          color: "oklch(0.08 0.01 280)",
          boxShadow: "0 0 20px oklch(0.78 0.18 75 / 0.3)",
        }}
      >
        <ShoppingBag className="w-4 h-4" />
        Continue Shopping
      </motion.button>
    </motion.div>
  );
}

interface CartItemRowProps {
  productId: string;
  quantity: bigint;
  product: Product | undefined;
  index: number;
}

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

function getProductImage(product: Product): string {
  if (product.imageUrl?.startsWith("http")) return product.imageUrl;
  const nameKey = Object.keys(PRODUCT_IMAGES).find(
    (k) =>
      product.name.toLowerCase().includes(k) ||
      product.category.toLowerCase().includes(k),
  );
  return nameKey
    ? PRODUCT_IMAGES[nameKey]
    : "/assets/generated/rz-store-hero.dim_600x600.png";
}

function CartItemRow({
  productId,
  quantity,
  product,
  index,
}: CartItemRowProps) {
  const removeFromCart = useRemoveFromCart();
  const updateQty = useUpdateCartQuantity();

  const handleRemove = async () => {
    try {
      await removeFromCart.mutateAsync(productId);
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleQty = async (delta: number) => {
    const newQty = Number(quantity) + delta;
    if (newQty <= 0) {
      await handleRemove();
      return;
    }
    try {
      await updateQty.mutateAsync({ productId, quantity: BigInt(newQty) });
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const subtotal = product ? product.price * quantity : 0n;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="glass-card rounded-2xl p-4 flex items-center gap-4"
    >
      {/* Image */}
      <div
        className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden"
        style={{ border: "1px solid oklch(0.78 0.18 75 / 0.2)" }}
      >
        {product ? (
          <img
            src={getProductImage(product)}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: "oklch(0.15 0.02 278)" }}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-semibold text-foreground text-sm truncate">
          {product?.name ?? productId}
        </h3>
        {product && (
          <p className="text-muted-foreground text-xs font-sans mt-0.5">
            {product.category}
          </p>
        )}
        {product && (
          <p
            className="font-display font-bold text-base mt-1"
            style={{ color: "oklch(0.88 0.22 78)" }}
          >
            {formatPrice(product.price)}
          </p>
        )}
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleQty(-1)}
          disabled={updateQty.isPending || removeFromCart.isPending}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-50"
          style={{
            background: "oklch(0.18 0.03 278)",
            border: "1px solid oklch(0.35 0.05 278)",
            color: "oklch(0.80 0.02 78)",
          }}
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="font-display font-bold text-foreground w-6 text-center">
          {updateQty.isPending ? "…" : String(quantity)}
        </span>
        <button
          type="button"
          onClick={() => handleQty(1)}
          disabled={updateQty.isPending}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-50"
          style={{
            background: "oklch(0.18 0.03 278)",
            border: "1px solid oklch(0.35 0.05 278)",
            color: "oklch(0.80 0.02 78)",
          }}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right hidden sm:block w-24">
        <p
          className="font-display font-bold text-sm"
          style={{ color: "oklch(0.78 0.18 75)" }}
        >
          {product ? formatPrice(subtotal) : "—"}
        </p>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={handleRemove}
        disabled={removeFromCart.isPending}
        className="text-destructive/60 hover:text-destructive transition-colors disabled:opacity-50 flex-shrink-0"
        aria-label="Remove item"
      >
        {removeFromCart.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
    </motion.div>
  );
}

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cartItems, isLoading: cartLoading } = useCart();
  const { data: products, isLoading: productsLoading } = useProducts();

  const isLoading = cartLoading || productsLoading;

  const cartWithProducts = (cartItems ?? []).map((item) => ({
    ...item,
    product: products?.find((p) => p.id === item.productId),
  }));

  const total = cartWithProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + item.product.price * item.quantity;
  }, 0n);

  const itemCount = cartWithProducts.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.08 0.015 280)" }}
    >
      {/* Header */}
      <div
        className="py-10 px-4 text-center"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, oklch(0.18 0.06 278 / 0.5) 0%, transparent 70%)",
          borderBottom: "1px solid oklch(0.78 0.18 75 / 0.12)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="font-display font-black text-4xl text-shimmer"
            style={{ letterSpacing: "0.08em" }}
          >
            YOUR CART
          </h1>
          {itemCount > 0 && (
            <p className="text-muted-foreground font-sans text-sm mt-1">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          )}
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2
              className="w-10 h-10 animate-spin"
              style={{ color: "oklch(0.78 0.18 75)" }}
            />
          </div>
        ) : cartItems?.length === 0 || !cartItems ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            {/* Items list */}
            <div className="flex-1 flex flex-col gap-3">
              <AnimatePresence>
                {cartWithProducts.map((item, i) => (
                  <CartItemRow
                    key={item.productId}
                    productId={item.productId}
                    quantity={item.quantity}
                    product={item.product}
                    index={i}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Order summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="lg:w-80 flex-shrink-0"
            >
              <div
                className="glass-card rounded-2xl p-6 sticky top-24"
                style={{ border: "1px solid oklch(0.78 0.18 75 / 0.2)" }}
              >
                <h2 className="font-heading font-bold text-xl text-foreground mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4">
                  {cartWithProducts.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm font-sans"
                    >
                      <span className="text-muted-foreground truncate max-w-[60%]">
                        {item.product?.name ?? item.productId} ×{" "}
                        {String(item.quantity)}
                      </span>
                      <span className="text-foreground font-medium">
                        {item.product
                          ? formatPrice(item.product.price * item.quantity)
                          : "—"}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="border-t pt-4 mb-6"
                  style={{ borderColor: "oklch(0.78 0.18 75 / 0.2)" }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-heading font-bold text-lg text-foreground">
                      Total
                    </span>
                    <span
                      className="font-display font-black text-2xl"
                      style={{
                        color: "oklch(0.88 0.22 78)",
                        textShadow: "0 0 15px oklch(0.78 0.18 75 / 0.4)",
                      }}
                    >
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate({ to: "/checkout" })}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-sans font-bold"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
                      color: "oklch(0.08 0.01 280)",
                      boxShadow: "0 0 20px oklch(0.78 0.18 75 / 0.4)",
                    }}
                  >
                    <CreditCard className="w-4 h-4" />
                    Proceed to Checkout
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/store" })}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-sans font-medium transition-all hover:opacity-80"
                    style={{
                      background: "oklch(0.18 0.03 278)",
                      border: "1px solid oklch(0.35 0.05 278)",
                      color: "oklch(0.70 0.04 78)",
                    }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Continue Shopping
                  </button>
                </div>

                {/* Trust badges */}
                <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
                  {["🔒 Secure", "🚀 Fast", "💎 Premium"].map((badge) => (
                    <span
                      key={badge}
                      className="text-xs text-muted-foreground font-sans"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
