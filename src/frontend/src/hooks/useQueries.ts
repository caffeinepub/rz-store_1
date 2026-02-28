import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CartItem, Feedback, Order, Product } from "../backend.d";
import { useActor } from "./useActor";

/* ---- Products ---- */
export function useProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

/* ---- Single Product ---- */
export function useProduct(productId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product | null>({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProduct(productId);
    },
    enabled: !!actor && !isFetching && !!productId,
  });
}

/* ---- Cart ---- */
export function useCart() {
  const { actor, isFetching } = useActor();
  return useQuery<CartItem[]>({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
    },
    enabled: !!actor && !isFetching,
  });
}

/* ---- Add to Cart ---- */
export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: CartItem) => {
      if (!actor) throw new Error("Not connected");
      await actor.addToCart(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

/* ---- Remove from Cart ---- */
export function useRemoveFromCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.removeFromCart(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

/* ---- Update Cart Quantity ---- */
export function useUpdateCartQuantity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: { productId: string; quantity: bigint }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateCartQuantity(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

/* ---- Clear Cart ---- */
export function useClearCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

/* ---- Place Order ---- */
export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (paymentMethod: string) => {
      if (!actor) throw new Error("Not connected");
      const orderId = await actor.placeOrder(paymentMethod);
      return orderId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

/* ---- Feedback ---- */
export function useFeedback() {
  const { actor, isFetching } = useActor();
  return useQuery<Feedback[]>({
    queryKey: ["feedback"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFeedback();
    },
    enabled: !!actor && !isFetching,
  });
}

/* ---- Submit Feedback ---- */
export function useSubmitFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      rating,
      comment,
      productId,
    }: {
      name: string;
      rating: bigint;
      comment: string;
      productId: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.submitFeedback(name, rating, comment, productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
    },
  });
}

/* ---- All Orders (Admin) ---- */
export function useAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

/* ---- Add Product (Admin) ---- */
export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("Not connected");
      await actor.addProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
