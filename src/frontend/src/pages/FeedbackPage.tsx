import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Loader2, MessageSquare, Send, Star, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Feedback } from "../backend.d";
import {
  useFeedback,
  useProducts,
  useSubmitFeedback,
} from "../hooks/useQueries";

function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [hovered, setHovered] = useState(0);
  const sz = size === "lg" ? "w-8 h-8" : size === "sm" ? "w-4 h-4" : "w-6 h-6";

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rating: ${value} stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = readonly ? star <= value : star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            className={`star-btn ${filled ? "active" : ""} ${readonly ? "cursor-default" : "cursor-pointer"}`}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            onClick={() => !readonly && onChange?.(star)}
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          >
            <Star
              className={sz}
              fill={filled ? "oklch(0.88 0.22 78)" : "none"}
              stroke={filled ? "oklch(0.88 0.22 78)" : "oklch(0.40 0.04 78)"}
            />
          </button>
        );
      })}
    </div>
  );
}

function FeedbackCard({
  feedback,
  index,
}: { feedback: Feedback; index: number }) {
  const formatDate = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="glass-card rounded-2xl p-5"
      style={{ border: "1px solid oklch(0.78 0.18 75 / 0.12)" }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.28 0.06 280), oklch(0.35 0.08 265))",
              border: "1px solid oklch(0.78 0.18 75 / 0.25)",
            }}
          >
            <User
              className="w-5 h-5"
              style={{ color: "oklch(0.78 0.18 75)" }}
            />
          </div>
          <div>
            <p className="font-sans font-semibold text-foreground text-sm">
              {feedback.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating value={Number(feedback.rating)} readonly size="sm" />
              <span className="text-xs text-muted-foreground font-sans">
                {Number(feedback.rating)}/5
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-sans flex-shrink-0">
          <Clock className="w-3 h-3" />
          {formatDate(feedback.timestamp)}
        </div>
      </div>
      <p className="text-sm text-foreground/80 font-sans leading-relaxed">
        {feedback.comment}
      </p>
      {feedback.productId && (
        <div className="mt-3">
          <span
            className="text-xs px-2.5 py-1 rounded-full font-sans"
            style={{
              background: "oklch(0.78 0.18 75 / 0.1)",
              border: "1px solid oklch(0.78 0.18 75 / 0.25)",
              color: "oklch(0.78 0.18 75)",
            }}
          >
            Product Review
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default function FeedbackPage() {
  const { data: allFeedback, isLoading: feedbackLoading } = useFeedback();
  const { data: products } = useProducts();
  const submitFeedback = useSubmitFeedback();

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [productId, setProductId] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      await submitFeedback.mutateAsync({
        name: name.trim(),
        rating: BigInt(rating),
        comment: comment.trim(),
        productId: productId && productId !== "none" ? productId : null,
      });
      setSubmitted(true);
      setName("");
      setRating(0);
      setComment("");
      setProductId("");
      toast.success("Thank you for your feedback! ✨");
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      toast.error("Failed to submit feedback");
    }
  };

  const avgRating =
    allFeedback && allFeedback.length > 0
      ? allFeedback.reduce((sum, f) => sum + Number(f.rating), 0) /
        allFeedback.length
      : 0;

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
            FEEDBACK
          </h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">
            Share your experience with RZ STORE.IN
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Submit form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-96 flex-shrink-0"
          >
            <div
              className="glass-card rounded-2xl p-6 sticky top-24"
              style={{ border: "1px solid oklch(0.78 0.18 75 / 0.2)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
                  }}
                >
                  <MessageSquare
                    className="w-4 h-4"
                    style={{ color: "oklch(0.08 0.01 280)" }}
                  />
                </div>
                <h2 className="font-heading font-bold text-xl text-foreground">
                  Write a Review
                </h2>
              </div>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-3 p-4 rounded-xl mb-4"
                    style={{
                      background: "oklch(0.55 0.18 150 / 0.15)",
                      border: "1px solid oklch(0.55 0.18 150 / 0.4)",
                    }}
                  >
                    <span className="text-xl">✅</span>
                    <p
                      className="text-sm font-sans"
                      style={{ color: "oklch(0.70 0.18 150)" }}
                    >
                      Thank you for your feedback!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground font-sans mb-1.5 block uppercase tracking-wider">
                    Your Name
                  </Label>
                  <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="font-sans"
                    style={{
                      background: "oklch(0.14 0.025 278)",
                      border: "1px solid oklch(0.30 0.05 278)",
                      color: "oklch(0.90 0.02 80)",
                    }}
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground font-sans mb-1.5 block uppercase tracking-wider">
                    Rating
                  </Label>
                  <div
                    className="p-3 rounded-xl flex items-center gap-4"
                    style={{
                      background: "oklch(0.14 0.025 278)",
                      border: "1px solid oklch(0.30 0.05 278)",
                    }}
                  >
                    <StarRating value={rating} onChange={setRating} size="lg" />
                    {rating > 0 && (
                      <span className="text-sm font-sans text-muted-foreground">
                        {
                          ["", "Poor", "Fair", "Good", "Great", "Excellent!"][
                            rating
                          ]
                        }
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground font-sans mb-1.5 block uppercase tracking-wider">
                    Product (Optional)
                  </Label>
                  <Select value={productId} onValueChange={setProductId}>
                    <SelectTrigger
                      style={{
                        background: "oklch(0.14 0.025 278)",
                        border: "1px solid oklch(0.30 0.05 278)",
                        color: "oklch(0.90 0.02 80)",
                      }}
                    >
                      <SelectValue placeholder="Select a product..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">General Review</SelectItem>
                      {products?.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground font-sans mb-1.5 block uppercase tracking-wider">
                    Your Review
                  </Label>
                  <Textarea
                    placeholder="Share your experience with us..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="font-sans resize-none"
                    style={{
                      background: "oklch(0.14 0.025 278)",
                      border: "1px solid oklch(0.30 0.05 278)",
                      color: "oklch(0.90 0.02 80)",
                    }}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={submitFeedback.isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-sans font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
                    color: "oklch(0.08 0.01 280)",
                    boxShadow: submitFeedback.isPending
                      ? "none"
                      : "0 0 20px oklch(0.78 0.18 75 / 0.4)",
                  }}
                >
                  {submitFeedback.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {submitFeedback.isPending ? "Submitting..." : "Submit Review"}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Reviews list */}
          <div className="flex-1">
            {/* Stats */}
            {allFeedback && allFeedback.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card rounded-2xl p-5 mb-6 flex items-center gap-6"
                style={{ border: "1px solid oklch(0.78 0.18 75 / 0.2)" }}
              >
                <div className="text-center">
                  <p
                    className="font-display font-black text-4xl"
                    style={{
                      color: "oklch(0.88 0.22 78)",
                      textShadow: "0 0 15px oklch(0.78 0.18 75 / 0.4)",
                    }}
                  >
                    {avgRating.toFixed(1)}
                  </p>
                  <StarRating
                    value={Math.round(avgRating)}
                    readonly
                    size="sm"
                  />
                  <p className="text-xs text-muted-foreground font-sans mt-1">
                    {allFeedback.length} review
                    {allFeedback.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = allFeedback.filter(
                      (f) => Number(f.rating) === star,
                    ).length;
                    const pct =
                      allFeedback.length > 0
                        ? (count / allFeedback.length) * 100
                        : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground w-3 font-sans">
                          {star}
                        </span>
                        <Star
                          className="w-3 h-3 fill-current"
                          style={{ color: "oklch(0.78 0.18 75)" }}
                        />
                        <div
                          className="flex-1 h-1.5 rounded-full overflow-hidden"
                          style={{ background: "oklch(0.18 0.03 278)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              background:
                                "linear-gradient(90deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-6 text-right font-sans">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            <h2 className="font-heading font-bold text-xl text-foreground mb-4">
              Customer Reviews
            </h2>

            {feedbackLoading ? (
              <div className="flex justify-center py-10">
                <Loader2
                  className="w-8 h-8 animate-spin"
                  style={{ color: "oklch(0.78 0.18 75)" }}
                />
              </div>
            ) : !allFeedback || allFeedback.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 gap-4"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: "oklch(0.15 0.03 278)",
                    border: "1px solid oklch(0.78 0.18 75 / 0.2)",
                  }}
                >
                  <MessageSquare
                    className="w-8 h-8"
                    style={{ color: "oklch(0.78 0.18 75 / 0.5)" }}
                  />
                </div>
                <p className="text-muted-foreground font-sans text-center">
                  No reviews yet. Be the first to share your experience!
                </p>
              </motion.div>
            ) : (
              <div className="grid gap-4">
                {[...allFeedback]
                  .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
                  .map((feedback, i) => (
                    <FeedbackCard
                      key={String(feedback.id)}
                      feedback={feedback}
                      index={i}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
