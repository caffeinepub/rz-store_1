import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Loader2,
  Package,
  PackagePlus,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useAddProduct, useAllOrders, useProducts } from "../hooks/useQueries";

function formatPrice(paise: bigint): string {
  const rupees = Number(paise) / 100;
  return `₹${rupees.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

function formatDate(timestamp: bigint): string {
  // Motoko timestamps are in nanoseconds
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const STATUS_COLORS: Record<string, string> = {
  pending: "oklch(0.75 0.20 75)",
  completed: "oklch(0.65 0.18 150)",
  failed: "oklch(0.60 0.22 25)",
  processing: "oklch(0.60 0.18 260)",
};

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  imageUrl: string;
}

const INITIAL_FORM: ProductFormData = {
  name: "",
  description: "",
  price: "",
  category: "Accessories",
  stock: "",
  imageUrl: "",
};

function AddProductForm() {
  const [form, setForm] = useState<ProductFormData>(INITIAL_FORM);
  const addProduct = useAddProduct();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.stock) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const priceNum = Number.parseFloat(form.price);
    const stockNum = Number.parseInt(form.stock);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }
    if (Number.isNaN(stockNum) || stockNum < 0) {
      toast.error("Please enter a valid stock quantity.");
      return;
    }

    const product = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      description: form.description.trim(),
      price: BigInt(Math.round(priceNum * 100)),
      category: form.category.trim(),
      stock: BigInt(stockNum),
      imageUrl: form.imageUrl.trim(),
    };

    try {
      await addProduct.mutateAsync(product);
      toast.success(`"${product.name}" added successfully!`, {
        icon: "✅",
      });
      setForm(INITIAL_FORM);
    } catch {
      toast.error("Failed to add product. Please try again.");
    }
  };

  const inputStyle = {
    background: "oklch(0.12 0.025 278)",
    border: "1px solid oklch(0.28 0.05 278)",
    color: "oklch(0.88 0.02 80)",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name */}
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="font-sans text-sm font-medium"
            style={{ color: "oklch(0.72 0.08 78)" }}
          >
            Product Name *
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. RZ Rings Combo for Men"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
            className="placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label
            htmlFor="category"
            className="font-sans text-sm font-medium"
            style={{ color: "oklch(0.72 0.08 78)" }}
          >
            Category *
          </Label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full h-10 rounded-md px-3 text-sm font-sans focus:outline-none focus:ring-2"
            style={inputStyle}
          >
            {[
              "Accessories",
              "Electronics",
              "Fashion",
              "Jewelry",
              "Lifestyle",
              "Other",
            ].map((cat) => (
              <option
                key={cat}
                value={cat}
                style={{ background: "oklch(0.12 0.025 278)" }}
              >
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label
            htmlFor="price"
            className="font-sans text-sm font-medium"
            style={{ color: "oklch(0.72 0.08 78)" }}
          >
            Price (₹ Rupees) *
          </Label>
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 font-sans font-medium text-sm"
              style={{ color: "oklch(0.65 0.08 78)" }}
            >
              ₹
            </span>
            <Input
              id="price"
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="370"
              value={form.price}
              onChange={handleChange}
              required
              className="pl-7 placeholder:text-muted-foreground/50"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Stock */}
        <div className="space-y-2">
          <Label
            htmlFor="stock"
            className="font-sans text-sm font-medium"
            style={{ color: "oklch(0.72 0.08 78)" }}
          >
            Stock Quantity *
          </Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            placeholder="100"
            value={form.stock}
            onChange={handleChange}
            required
            className="placeholder:text-muted-foreground/50"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label
          htmlFor="description"
          className="font-sans text-sm font-medium"
          style={{ color: "oklch(0.72 0.08 78)" }}
        >
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Product description..."
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="resize-none placeholder:text-muted-foreground/50"
          style={inputStyle}
        />
      </div>

      {/* Image URL */}
      <div className="space-y-2">
        <Label
          htmlFor="imageUrl"
          className="font-sans text-sm font-medium"
          style={{ color: "oklch(0.72 0.08 78)" }}
        >
          Image URL
          <span className="text-muted-foreground font-normal ml-1">
            (optional)
          </span>
        </Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://example.com/product.jpg"
          value={form.imageUrl}
          onChange={handleChange}
          className="placeholder:text-muted-foreground/50"
          style={inputStyle}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={addProduct.isPending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-sans font-semibold"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
            color: "oklch(0.08 0.01 280)",
            boxShadow: addProduct.isPending
              ? "none"
              : "0 0 20px oklch(0.78 0.18 75 / 0.4)",
          }}
        >
          {addProduct.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <PackagePlus className="w-4 h-4" />
          )}
          {addProduct.isPending ? "Adding…" : "Add Product"}
        </Button>
        <button
          type="button"
          onClick={() => setForm(INITIAL_FORM)}
          className="px-4 py-2.5 rounded-xl font-sans font-medium text-sm transition-all hover:opacity-80"
          style={{
            background: "oklch(0.16 0.03 278)",
            border: "1px solid oklch(0.30 0.05 278)",
            color: "oklch(0.65 0.04 78)",
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
}

function ProductsTable() {
  const { data: products, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: "oklch(0.78 0.18 75)" }}
        />
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground font-sans">No products found.</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid oklch(0.25 0.04 278)" }}
    >
      <Table>
        <TableHeader>
          <TableRow
            style={{
              background: "oklch(0.12 0.025 278)",
              borderBottom: "1px solid oklch(0.25 0.04 278)",
            }}
          >
            <TableHead
              className="font-heading font-semibold"
              style={{ color: "oklch(0.72 0.08 78)" }}
            >
              Name
            </TableHead>
            <TableHead
              className="font-heading font-semibold"
              style={{ color: "oklch(0.72 0.08 78)" }}
            >
              Category
            </TableHead>
            <TableHead
              className="font-heading font-semibold"
              style={{ color: "oklch(0.72 0.08 78)" }}
            >
              Price
            </TableHead>
            <TableHead
              className="font-heading font-semibold"
              style={{ color: "oklch(0.72 0.08 78)" }}
            >
              Stock
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, i) => (
            <TableRow
              key={product.id}
              style={{
                background:
                  i % 2 === 0
                    ? "oklch(0.10 0.018 280)"
                    : "oklch(0.11 0.020 278)",
                borderBottom: "1px solid oklch(0.20 0.03 278)",
              }}
            >
              <TableCell
                className="font-sans text-sm"
                style={{ color: "oklch(0.85 0.02 80)" }}
              >
                <div className="font-medium">{product.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5 max-w-xs truncate">
                  {product.description}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className="font-sans text-xs"
                  style={{
                    background: "oklch(0.78 0.18 75 / 0.15)",
                    border: "1px solid oklch(0.78 0.18 75 / 0.4)",
                    color: "oklch(0.78 0.18 75)",
                  }}
                >
                  {product.category}
                </Badge>
              </TableCell>
              <TableCell
                className="font-display font-bold text-sm"
                style={{ color: "oklch(0.88 0.22 78)" }}
              >
                {formatPrice(product.price)}
              </TableCell>
              <TableCell>
                <span
                  className="font-sans text-sm px-2 py-1 rounded-md"
                  style={
                    Number(product.stock) > 0
                      ? {
                          background: "oklch(0.55 0.18 150 / 0.15)",
                          border: "1px solid oklch(0.55 0.18 150 / 0.3)",
                          color: "oklch(0.70 0.18 150)",
                        }
                      : {
                          background: "oklch(0.50 0.20 25 / 0.15)",
                          border: "1px solid oklch(0.50 0.20 25 / 0.3)",
                          color: "oklch(0.65 0.18 30)",
                        }
                  }
                >
                  {String(product.stock)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function OrdersTable() {
  const { data: orders, isLoading } = useAllOrders();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: "oklch(0.78 0.18 75)" }}
        />
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground font-sans">No orders yet.</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid oklch(0.25 0.04 278)" }}
    >
      <Table>
        <TableHeader>
          <TableRow
            style={{
              background: "oklch(0.12 0.025 278)",
              borderBottom: "1px solid oklch(0.25 0.04 278)",
            }}
          >
            <TableHead
              className="font-heading font-semibold"
              style={{ color: "oklch(0.72 0.08 78)" }}
            >
              Order ID
            </TableHead>
            <TableHead
              className="font-heading font-semibold"
              style={{ color: "oklch(0.72 0.08 78)" }}
            >
              Status
            </TableHead>
            <TableHead
              className="font-heading font-semibold"
              style={{ color: "oklch(0.72 0.08 78)" }}
            >
              Total
            </TableHead>
            <TableHead
              className="font-heading font-semibold"
              style={{ color: "oklch(0.72 0.08 78)" }}
            >
              Payment
            </TableHead>
            <TableHead
              className="font-heading font-semibold"
              style={{ color: "oklch(0.72 0.08 78)" }}
            >
              Items
            </TableHead>
            <TableHead
              className="font-heading font-semibold"
              style={{ color: "oklch(0.72 0.08 78)" }}
            >
              Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, i) => {
            const statusColor =
              STATUS_COLORS[order.status.toLowerCase()] ??
              STATUS_COLORS.pending;
            return (
              <TableRow
                key={order.id}
                style={{
                  background:
                    i % 2 === 0
                      ? "oklch(0.10 0.018 280)"
                      : "oklch(0.11 0.020 278)",
                  borderBottom: "1px solid oklch(0.20 0.03 278)",
                }}
              >
                <TableCell
                  className="font-mono text-xs"
                  style={{ color: "oklch(0.65 0.04 78)" }}
                >
                  {order.id.slice(0, 8)}…
                </TableCell>
                <TableCell>
                  <span
                    className="text-xs font-sans font-semibold px-2 py-1 rounded-full capitalize"
                    style={{
                      background: `oklch(from ${statusColor} l c h / 0.15)`,
                      border: `1px solid ${statusColor}`,
                      color: statusColor,
                    }}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell
                  className="font-display font-bold text-sm"
                  style={{ color: "oklch(0.88 0.22 78)" }}
                >
                  {formatPrice(order.totalAmount)}
                </TableCell>
                <TableCell
                  className="font-sans text-sm"
                  style={{ color: "oklch(0.75 0.04 78)" }}
                >
                  {order.paymentMethod}
                </TableCell>
                <TableCell
                  className="font-sans text-sm text-center"
                  style={{ color: "oklch(0.75 0.04 78)" }}
                >
                  {order.items.length}
                </TableCell>
                <TableCell
                  className="font-sans text-xs"
                  style={{ color: "oklch(0.60 0.04 78)" }}
                >
                  {formatDate(order.timestamp)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    if (isFetching || !actor) return;
    let cancelled = false;
    actor
      .isCallerAdmin()
      .then((result) => {
        if (!cancelled) {
          setIsAdmin(result);
          setCheckingAdmin(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsAdmin(false);
          setCheckingAdmin(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [actor, isFetching]);

  if (isFetching || checkingAdmin) {
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
          <p className="text-muted-foreground font-sans">
            Verifying admin access…
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.08 0.015 280)" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-6 text-center px-4 max-w-md"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: "oklch(0.50 0.20 25 / 0.15)",
              border: "2px solid oklch(0.50 0.20 25 / 0.4)",
            }}
          >
            <ShieldAlert
              className="w-12 h-12"
              style={{ color: "oklch(0.65 0.18 30)" }}
            />
          </div>
          <div>
            <h2
              className="font-display font-black text-3xl mb-2"
              style={{ color: "oklch(0.80 0.05 80)" }}
            >
              Access Denied
            </h2>
            <p className="text-muted-foreground font-sans text-sm leading-relaxed">
              You don't have admin permissions to access this panel. Please
              contact the store administrator.
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
        </motion.div>
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
        className="relative overflow-hidden py-10 px-4"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, oklch(0.20 0.06 278 / 0.5) 0%, transparent 70%)",
          borderBottom: "1px solid oklch(0.78 0.18 75 / 0.15)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
              }}
            >
              <ShieldCheck
                className="w-5 h-5"
                style={{ color: "oklch(0.08 0.01 280)" }}
              />
            </div>
            <div>
              <h1
                className="font-display font-black text-3xl text-shimmer"
                style={{ letterSpacing: "0.05em" }}
              >
                ADMIN PANEL
              </h1>
              <p className="text-muted-foreground font-sans text-xs tracking-widest uppercase">
                RZ Store Management
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Tabs defaultValue="add-product">
          <TabsList
            className="mb-8 p-1 rounded-xl"
            style={{
              background: "oklch(0.13 0.025 278)",
              border: "1px solid oklch(0.25 0.04 278)",
            }}
          >
            {[
              { value: "add-product", icon: PackagePlus, label: "Add Product" },
              { value: "products", icon: Package, label: "All Products" },
              { value: "orders", icon: ShoppingBag, label: "All Orders" },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-2 font-sans font-medium text-sm rounded-lg px-4 py-2 data-[state=active]:text-foreground"
                style={
                  {
                    "--tw-ring-color": "oklch(0.78 0.18 75 / 0.3)",
                  } as React.CSSProperties
                }
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Add Product Tab */}
          <TabsContent value="add-product">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl p-6"
              style={{ border: "1px solid oklch(0.78 0.18 75 / 0.15)" }}
            >
              <div className="mb-6">
                <h2 className="font-heading font-bold text-xl text-foreground mb-1">
                  Add New Product
                </h2>
                <p className="text-muted-foreground font-sans text-sm">
                  Fill in the product details below to add it to the store
                  catalog.
                </p>
              </div>
              <AddProductForm />
            </motion.div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl p-6"
              style={{ border: "1px solid oklch(0.78 0.18 75 / 0.15)" }}
            >
              <div className="mb-6">
                <h2 className="font-heading font-bold text-xl text-foreground mb-1">
                  Product Catalog
                </h2>
                <p className="text-muted-foreground font-sans text-sm">
                  All products currently in the store.
                </p>
              </div>
              <ProductsTable />
            </motion.div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl p-6"
              style={{ border: "1px solid oklch(0.78 0.18 75 / 0.15)" }}
            >
              <div className="mb-6">
                <h2 className="font-heading font-bold text-xl text-foreground mb-1">
                  Order History
                </h2>
                <p className="text-muted-foreground font-sans text-sm">
                  All customer orders placed through the store.
                </p>
              </div>
              <OrdersTable />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
