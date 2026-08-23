import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import CartDrawer from "./components/cart/CartDrawer";
import PageLoader from "./components/common/PageLoader";

// Lazy-loaded Storefront Pages
const Home = lazy(() => import("./pages/Home/Home"));
const Shop = lazy(() => import("./pages/Shop/Shop"));
const ProductDetails = lazy(() => import("./pages/ProductDetails/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist/Wishlist"));
const AboutPage = lazy(() => import("./pages/About/AboutPage"));

// Lazy-loaded Auth Pages
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const VerifyEmail = lazy(() => import("./pages/Auth/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));
const Account = lazy(() => import("./pages/Account/Account"));
const CheckoutPage = lazy(() => import("./pages/Checkout/CheckoutPage"));
const OrderDetails = lazy(() => import("./pages/Account/OrderDetails"));
const OrderTrackingPage = lazy(() => import("./pages/Account/OrderTrackingPage"));

// Lazy-loaded Payment Pages
const PaymentPage = lazy(() => import("./pages/Payment/PaymentPage"));
const PaymentSuccess = lazy(() => import("./pages/Payment/PaymentSuccess"));
const PaymentFailed = lazy(() => import("./pages/Payment/PaymentFailed"));

// Lazy-loaded Admin Pages (Isolated from Customer Bundle)
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminAddProduct = lazy(() => import("./pages/admin/AddProduct"));
const AdminEditProduct = lazy(() => import("./pages/admin/EditProduct"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory"));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons"));
const AdminShipments = lazy(() => import("./pages/admin/AdminShipments"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminAnalyticsPage = lazy(() => import("./pages/admin/AdminAnalyticsPage"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

// Protected Route Wrappers
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

const LayoutContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300">
      {/* Hide Navbar and Cart Drawer on Admin Pages for clean dashboard UX */}
      {!isAdminRoute && (
        <>
          <Navbar />
          <CartDrawer />
        </>
      )}

      <main className="w-full">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Storefront Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Account & Payment Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/account" element={<Account />} />
              <Route path="/account/orders/:orderNumber" element={<OrderDetails />} />
              <Route path="/account/orders/:orderNumber/tracking" element={<OrderTrackingPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment/:orderNumber" element={<PaymentPage />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/failed" element={<PaymentFailed />} />
            </Route>

            {/* Protected Admin Management Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/add"
              element={
                <AdminRoute>
                  <AdminAddProduct />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/edit/:id"
              element={
                <AdminRoute>
                  <AdminEditProduct />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/inventory"
              element={
                <AdminRoute>
                  <AdminInventory />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/coupons"
              element={
                <AdminRoute>
                  <AdminCoupons />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/shipments"
              element={
                <AdminRoute>
                  <AdminShipments />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <AdminRoute>
                  <AdminCustomers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AdminRoute>
                  <AdminCategories />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <AdminAnalyticsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <AdminSettings />
                </AdminRoute>
              }
            />

            {/* Catch-all Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <LayoutContent />
    </Router>
  );
}

export default App;
