import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import FeedbackPage from "./pages/FeedbackPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import StorePage from "./pages/StorePage";
import WelcomePage from "./pages/WelcomePage";

/* ---- Root layout ---- */
function RootLayout() {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "oklch(0.08 0.015 280)" }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.14 0.025 275)",
            border: "1px solid oklch(0.78 0.18 75 / 0.3)",
            color: "oklch(0.90 0.02 80)",
            fontFamily: "Cabinet Grotesk, system-ui, sans-serif",
          },
        }}
      />
      <Outlet />
    </div>
  );
}

/* ---- Store layout (with navbar + footer) ---- */
function StoreLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/* ---- Routes ---- */
const rootRoute = createRootRoute({ component: RootLayout });

const welcomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: WelcomePage,
});

const storeLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "store-layout",
  component: StoreLayout,
});

const storeRoute = createRoute({
  getParentRoute: () => storeLayoutRoute,
  path: "/store",
  component: StorePage,
});

const cartRoute = createRoute({
  getParentRoute: () => storeLayoutRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => storeLayoutRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const feedbackRoute = createRoute({
  getParentRoute: () => storeLayoutRoute,
  path: "/feedback",
  component: FeedbackPage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => storeLayoutRoute,
  path: "/product/$productId",
  component: ProductDetailPage,
});

const adminRoute = createRoute({
  getParentRoute: () => storeLayoutRoute,
  path: "/admin",
  component: AdminPage,
});

/* ---- Router ---- */
const routeTree = rootRoute.addChildren([
  welcomeRoute,
  storeLayoutRoute.addChildren([
    storeRoute,
    cartRoute,
    checkoutRoute,
    feedbackRoute,
    productDetailRoute,
    adminRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
