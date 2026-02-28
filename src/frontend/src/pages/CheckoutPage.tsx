import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  CreditCard,
  Loader2,
  ShoppingBag,
  Smartphone,
  Wallet,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart, usePlaceOrder, useProducts } from "../hooks/useQueries";

function formatPrice(paise: bigint): string {
  const rupees = Number(paise) / 100;
  return `₹${rupees.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

const QR_CELLS = Array.from({ length: 64 }, (_, i) => ({
  id: `qr-cell-${i}`,
  dark: (i * 37 + i * 7) % 10 > 4,
}));

/* ---- Confetti ---- */
interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
  size: number;
  shape: "circle" | "square" | "triangle";
}

function generateConfetti(): ConfettiPiece[] {
  const colors = [
    "oklch(0.88 0.22 78)",
    "oklch(0.78 0.18 75)",
    "oklch(0.65 0.20 290)",
    "oklch(0.70 0.20 50)",
    "oklch(0.75 0.18 160)",
    "oklch(0.80 0.20 30)",
  ];
  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 50,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.8,
    size: Math.random() * 12 + 4,
    shape: (["circle", "square", "triangle"] as const)[
      Math.floor(Math.random() * 3)
    ],
  }));
}

/* ---- Payment tabs ---- */
type PaymentTab = "upi" | "card" | "netbanking" | "googlepay";

const tabs: { id: PaymentTab; label: string; icon: React.ElementType }[] = [
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
  { id: "googlepay", label: "Google Pay", icon: Wallet },
];

/* ---- Credit Card Preview ---- */
function CardPreview({
  number,
  name,
  expiry,
  flipped,
  cvv,
}: {
  number: string;
  name: string;
  expiry: string;
  flipped: boolean;
  cvv: string;
}) {
  const formatted = `${number}________________`
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

  return (
    <div
      className="relative mx-auto"
      style={{ width: "280px", height: "170px", perspective: "1000px" }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", height: "100%", transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl p-5 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            background:
              "linear-gradient(135deg, oklch(0.20 0.06 280), oklch(0.28 0.08 260))",
            border: "1px solid oklch(0.78 0.18 75 / 0.4)",
            boxShadow:
              "0 10px 40px oklch(0 0 0 / 0.5), 0 0 20px oklch(0.78 0.18 75 / 0.2)",
          }}
        >
          <div className="flex justify-between items-start">
            <div
              className="w-10 h-7 rounded"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.18 75), oklch(0.88 0.22 78))",
              }}
            />
            <span
              className="text-xs font-sans"
              style={{ color: "oklch(0.78 0.18 75)" }}
            >
              VISA
            </span>
          </div>
          <div>
            <p
              className="font-mono text-base tracking-widest"
              style={{ color: "oklch(0.90 0.02 80)" }}
            >
              {formatted}
            </p>
            <div className="flex justify-between mt-2">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Card Holder
                </p>
                <p className="text-xs font-sans text-foreground uppercase tracking-wide">
                  {name || "YOUR NAME"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Expires
                </p>
                <p className="text-xs font-sans text-foreground">
                  {expiry || "MM/YY"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background:
              "linear-gradient(135deg, oklch(0.18 0.05 280), oklch(0.25 0.07 260))",
            border: "1px solid oklch(0.78 0.18 75 / 0.4)",
            boxShadow: "0 10px 40px oklch(0 0 0 / 0.5)",
          }}
        >
          <div
            className="mt-8 h-10 w-full"
            style={{ background: "oklch(0.08 0.01 280)" }}
          />
          <div className="px-5 mt-4">
            <p className="text-xs text-muted-foreground mb-1">CVV</p>
            <div
              className="rounded px-3 py-1.5 font-mono text-sm text-right"
              style={{
                background: "oklch(0.90 0.02 80)",
                color: "oklch(0.10 0.01 280)",
              }}
            >
              {cvv || "•••"}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---- Success screen ---- */
function SuccessScreen({ orderId }: { orderId: string }) {
  const navigate = useNavigate();
  const [confetti] = useState(generateConfetti);

  return (
    <div className="relative flex flex-col items-center justify-center py-16 gap-6 overflow-hidden">
      {/* Confetti */}
      {confetti.map((p) => (
        <div
          key={p.id}
          className="confetti-piece pointer-events-none"
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              borderRadius:
                p.shape === "circle"
                  ? "50%"
                  : p.shape === "square"
                    ? "2px"
                    : "0",
              "--delay": `${p.delay}s`,
              boxShadow: `0 0 ${p.size}px ${p.color}`,
            } as React.CSSProperties
          }
        />
      ))}

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.18 150), oklch(0.65 0.20 140))",
            boxShadow:
              "0 0 40px oklch(0.55 0.18 150 / 0.5), 0 0 80px oklch(0.55 0.18 150 / 0.25)",
          }}
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center"
      >
        <h2
          className="font-display font-black text-4xl text-shimmer"
          style={{ letterSpacing: "0.06em" }}
        >
          ORDER PLACED!
        </h2>
        <p className="text-muted-foreground font-sans mt-2">
          Your luxury items are on their way ✨
        </p>
        <div
          className="mt-4 px-6 py-3 rounded-xl glass-card"
          style={{ border: "1px solid oklch(0.78 0.18 75 / 0.2)" }}
        >
          <p className="text-xs text-muted-foreground font-sans">Order ID</p>
          <p
            className="font-mono text-sm font-bold mt-1"
            style={{ color: "oklch(0.78 0.18 75)" }}
          >
            {orderId}
          </p>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate({ to: "/store" })}
        className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-sans font-bold"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
          color: "oklch(0.08 0.01 280)",
          boxShadow: "0 0 20px oklch(0.78 0.18 75 / 0.4)",
        }}
      >
        <ShoppingBag className="w-4 h-4" />
        Back to Store
      </motion.button>
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cartItems } = useCart();
  const { data: products } = useProducts();
  const placeOrder = usePlaceOrder();

  const [activeTab, setActiveTab] = useState<PaymentTab>("upi");
  const [orderId, setOrderId] = useState<string | null>(null);

  // UPI
  const [upiId, setUpiId] = useState("");
  // Card
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardFlipped, setCardFlipped] = useState(false);
  // Net banking
  const [bank, setBank] = useState("");

  const cartWithProducts = (cartItems ?? []).map((item) => ({
    ...item,
    product: products?.find((p) => p.id === item.productId),
  }));

  const total = cartWithProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + item.product.price * item.quantity;
  }, 0n);

  const handlePlaceOrder = async () => {
    let paymentMethod = "";
    if (activeTab === "upi") {
      if (!upiId.trim()) {
        toast.error("Please enter your UPI ID");
        return;
      }
      paymentMethod = `UPI: ${upiId}`;
    } else if (activeTab === "card") {
      if (!cardNum || !cardName || !cardExpiry || !cardCvv) {
        toast.error("Please fill all card details");
        return;
      }
      paymentMethod = `Card: ****${cardNum.slice(-4)}`;
    } else if (activeTab === "netbanking") {
      if (!bank) {
        toast.error("Please select a bank");
        return;
      }
      paymentMethod = `Net Banking: ${bank}`;
    } else if (activeTab === "googlepay") {
      paymentMethod = "Google Pay";
    }

    try {
      const id = await placeOrder.mutateAsync(paymentMethod);
      setOrderId(id);
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (orderId) {
    return (
      <div
        className="min-h-screen"
        style={{ background: "oklch(0.08 0.015 280)" }}
      >
        <div className="max-w-2xl mx-auto px-4 py-16">
          <SuccessScreen orderId={orderId} />
        </div>
      </div>
    );
  }

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
            CHECKOUT
          </h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">
            Secure · Encrypted · Instant
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Payment section */}
          <div className="flex-1">
            {/* Back button */}
            <button
              type="button"
              onClick={() => navigate({ to: "/cart" })}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-sans transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </button>

            {/* Payment method tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-6"
              style={{ border: "1px solid oklch(0.78 0.18 75 / 0.15)" }}
            >
              <h2 className="font-heading font-bold text-xl text-foreground mb-5">
                Select Payment Method
              </h2>

              {/* Tab buttons */}
              <div className="flex gap-2 flex-wrap mb-6">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition-all duration-200"
                    style={
                      activeTab === id
                        ? {
                            background:
                              "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
                            color: "oklch(0.08 0.01 280)",
                            boxShadow: "0 0 15px oklch(0.78 0.18 75 / 0.4)",
                          }
                        : {
                            background: "oklch(0.18 0.03 278)",
                            border: "1px solid oklch(0.30 0.05 278)",
                            color: "oklch(0.65 0.04 78)",
                          }
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                {activeTab === "upi" && (
                  <motion.div
                    key="upi"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div>
                      <Label className="text-sm text-muted-foreground font-sans mb-2 block">
                        UPI ID
                      </Label>
                      <Input
                        placeholder="yourname@bank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="font-sans"
                        style={{
                          background: "oklch(0.14 0.025 278)",
                          border: "1px solid oklch(0.30 0.05 278)",
                          color: "oklch(0.90 0.02 80)",
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-sans mb-3">
                        Supported UPI Apps:
                      </p>
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          {
                            name: "Google Pay",
                            emoji: "💳",
                            color: "oklch(0.55 0.20 240)",
                          },
                          {
                            name: "PhonePe",
                            emoji: "📱",
                            color: "oklch(0.50 0.20 280)",
                          },
                          {
                            name: "Paytm",
                            emoji: "💰",
                            color: "oklch(0.55 0.20 200)",
                          },
                          {
                            name: "BHIM",
                            emoji: "🏦",
                            color: "oklch(0.50 0.18 25)",
                          },
                        ].map((app) => (
                          <button
                            type="button"
                            key={app.name}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all hover:opacity-80"
                            style={{
                              background: "oklch(0.16 0.03 278)",
                              border: `1px solid ${app.color} / 0.3`,
                              borderColor: `${app.color}`,
                            }}
                            onClick={() =>
                              setUpiId(
                                `yourname@${app.name.toLowerCase().replace(" ", "")}`,
                              )
                            }
                          >
                            <span className="text-2xl">{app.emoji}</span>
                            <span className="text-[10px] text-muted-foreground font-sans text-center">
                              {app.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "card" && (
                  <motion.div
                    key="card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <CardPreview
                      number={cardNum}
                      name={cardName}
                      expiry={cardExpiry}
                      flipped={cardFlipped}
                      cvv={cardCvv}
                    />
                    <div className="grid grid-cols-1 gap-4 mt-4">
                      <div>
                        <Label className="text-xs text-muted-foreground font-sans mb-1.5 block">
                          Card Number
                        </Label>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          value={cardNum}
                          maxLength={16}
                          onChange={(e) =>
                            setCardNum(e.target.value.replace(/\D/g, ""))
                          }
                          className="font-mono"
                          style={{
                            background: "oklch(0.14 0.025 278)",
                            border: "1px solid oklch(0.30 0.05 278)",
                            color: "oklch(0.90 0.02 80)",
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground font-sans mb-1.5 block">
                          Cardholder Name
                        </Label>
                        <Input
                          placeholder="JOHN DOE"
                          value={cardName}
                          onChange={(e) =>
                            setCardName(e.target.value.toUpperCase())
                          }
                          className="font-sans"
                          style={{
                            background: "oklch(0.14 0.025 278)",
                            border: "1px solid oklch(0.30 0.05 278)",
                            color: "oklch(0.90 0.02 80)",
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground font-sans mb-1.5 block">
                            Expiry Date
                          </Label>
                          <Input
                            placeholder="MM/YY"
                            value={cardExpiry}
                            maxLength={5}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, "");
                              if (val.length >= 3)
                                val = `${val.slice(0, 2)}/${val.slice(2)}`;
                              setCardExpiry(val);
                            }}
                            className="font-mono"
                            style={{
                              background: "oklch(0.14 0.025 278)",
                              border: "1px solid oklch(0.30 0.05 278)",
                              color: "oklch(0.90 0.02 80)",
                            }}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground font-sans mb-1.5 block">
                            CVV
                          </Label>
                          <Input
                            placeholder="•••"
                            type="password"
                            value={cardCvv}
                            maxLength={4}
                            onFocus={() => setCardFlipped(true)}
                            onBlur={() => setCardFlipped(false)}
                            onChange={(e) =>
                              setCardCvv(e.target.value.replace(/\D/g, ""))
                            }
                            className="font-mono"
                            style={{
                              background: "oklch(0.14 0.025 278)",
                              border: "1px solid oklch(0.30 0.05 278)",
                              color: "oklch(0.90 0.02 80)",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "netbanking" && (
                  <motion.div
                    key="netbanking"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div>
                      <Label className="text-sm text-muted-foreground font-sans mb-2 block">
                        Select Your Bank
                      </Label>
                      <Select value={bank} onValueChange={setBank}>
                        <SelectTrigger
                          style={{
                            background: "oklch(0.14 0.025 278)",
                            border: "1px solid oklch(0.30 0.05 278)",
                            color: "oklch(0.90 0.02 80)",
                          }}
                        >
                          <SelectValue placeholder="Choose bank..." />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "State Bank of India (SBI)",
                            "HDFC Bank",
                            "ICICI Bank",
                            "Axis Bank",
                            "Kotak Mahindra Bank",
                            "Punjab National Bank",
                            "Bank of Baroda",
                            "Canara Bank",
                            "Yes Bank",
                            "IndusInd Bank",
                          ].map((b) => (
                            <SelectItem key={b} value={b}>
                              {b}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {bank && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl"
                        style={{
                          background: "oklch(0.16 0.03 278)",
                          border: "1px solid oklch(0.78 0.18 75 / 0.2)",
                        }}
                      >
                        <p className="text-sm font-sans text-muted-foreground">
                          You will be redirected to{" "}
                          <span style={{ color: "oklch(0.78 0.18 75)" }}>
                            {bank}
                          </span>
                          's secure portal to complete payment.
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {activeTab === "googlepay" && (
                  <motion.div
                    key="googlepay"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center gap-5 py-4"
                  >
                    {/* QR Code placeholder */}
                    <div
                      className="w-48 h-48 rounded-2xl flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: "oklch(0.95 0.01 80)",
                        border: "3px solid oklch(0.78 0.18 75 / 0.5)",
                        boxShadow: "0 0 25px oklch(0.78 0.18 75 / 0.2)",
                      }}
                    >
                      {/* Simulated QR pattern */}
                      <div
                        className="grid gap-1"
                        style={{
                          gridTemplateColumns: "repeat(8, 1fr)",
                          width: "120px",
                          height: "120px",
                        }}
                      >
                        {QR_CELLS.map(({ id, dark }) => (
                          <div
                            key={id}
                            style={{
                              background: dark
                                ? "oklch(0.08 0.01 280)"
                                : "transparent",
                              borderRadius: "1px",
                            }}
                          />
                        ))}
                      </div>
                      {/* Corner patterns */}
                      {[
                        { top: 8, left: 8, id: "tl" },
                        { top: 8, right: 8, id: "tr" },
                        { bottom: 8, left: 8, id: "bl" },
                      ].map(({ id, ...pos }) => (
                        <div
                          key={id}
                          className="absolute w-10 h-10 border-4 rounded-sm"
                          style={{
                            ...pos,
                            borderColor: "oklch(0.08 0.01 280)",
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-center">
                      <p className="font-sans font-semibold text-foreground">
                        Scan with Google Pay
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 font-sans">
                        Open Google Pay and scan this QR code to pay{" "}
                        <span style={{ color: "oklch(0.78 0.18 75)" }}>
                          {formatPrice(total)}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {["GPay", "PhonePe", "Paytm"].map((app) => (
                        <span
                          key={app}
                          className="text-xs font-sans px-3 py-1.5 rounded-full"
                          style={{
                            background: "oklch(0.16 0.03 278)",
                            border: "1px solid oklch(0.78 0.18 75 / 0.2)",
                            color: "oklch(0.70 0.04 78)",
                          }}
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Place order button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                disabled={placeOrder.isPending}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-sans font-bold text-base mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
                  color: "oklch(0.08 0.01 280)",
                  boxShadow: placeOrder.isPending
                    ? "none"
                    : "0 0 25px oklch(0.78 0.18 75 / 0.5), 0 8px 24px oklch(0 0 0 / 0.3)",
                }}
              >
                {placeOrder.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                {placeOrder.isPending
                  ? "Processing..."
                  : `Place Order · ${formatPrice(total)}`}
              </motion.button>

              {/* Security badges */}
              <div className="flex items-center justify-center gap-4 mt-4">
                {["🔐 256-bit SSL", "🛡️ Secure Checkout", "✅ PCI DSS"].map(
                  (b) => (
                    <span
                      key={b}
                      className="text-xs text-muted-foreground font-sans"
                    >
                      {b}
                    </span>
                  ),
                )}
              </div>
            </motion.div>
          </div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:w-72 flex-shrink-0"
          >
            <div
              className="glass-card rounded-2xl p-5 sticky top-24"
              style={{ border: "1px solid oklch(0.78 0.18 75 / 0.2)" }}
            >
              <h2 className="font-heading font-bold text-lg text-foreground mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartWithProducts.map((item) => (
                  <div key={item.productId} className="flex gap-3 items-center">
                    <div
                      className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ border: "1px solid oklch(0.78 0.18 75 / 0.15)" }}
                    >
                      {item.product && (
                        <img
                          src={
                            item.product.imageUrl?.startsWith("http")
                              ? item.product.imageUrl
                              : "/assets/generated/rz-store-hero.dim_600x600.png"
                          }
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-sans text-foreground truncate">
                        {item.product?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        × {String(item.quantity)}
                      </p>
                    </div>
                    <p
                      className="text-xs font-display font-bold flex-shrink-0"
                      style={{ color: "oklch(0.78 0.18 75)" }}
                    >
                      {item.product
                        ? formatPrice(item.product.price * item.quantity)
                        : "—"}
                    </p>
                  </div>
                ))}
              </div>
              <div
                className="border-t pt-4"
                style={{ borderColor: "oklch(0.78 0.18 75 / 0.2)" }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-heading font-bold text-foreground">
                    Total
                  </span>
                  <span
                    className="font-display font-black text-xl"
                    style={{
                      color: "oklch(0.88 0.22 78)",
                      textShadow: "0 0 12px oklch(0.78 0.18 75 / 0.4)",
                    }}
                  >
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
