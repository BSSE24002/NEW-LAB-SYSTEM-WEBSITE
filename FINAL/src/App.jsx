import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ShopLayout } from "./components/shop/ShopLayout";
import { Home } from "./pages/shop/Home";
import { Catalog } from "./pages/shop/Catalog";
import { ProductDetail } from "./pages/shop/ProductDetail";
import { About } from "./pages/shop/About";
import { Profile } from "./pages/shop/Profile";
import { AdminLayout } from "./components/admin/AdminLayout";
import { POSRegister } from "./pages/admin/POSRegister";
import { InventoryGrid } from "./pages/admin/InventoryGrid";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { OrdersManagement } from "./pages/admin/OrdersManagement";
import { StaffManagement } from "./pages/admin/StaffManagement";
import { ProductsManagement } from "./pages/admin/ProductsManagement";
import { CategoriesManagement } from "./pages/admin/CategoriesManagement";
import { DiscountsManagement } from "./pages/admin/DiscountsManagement";

import { Checkout } from "./pages/shop/Checkout";
import { CardPayment } from "./pages/shop/CardPayment";
import { OrderConfirmation } from "./pages/shop/OrderConfirmation";
import { TrackOrder } from "./pages/shop/TrackOrder";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Shop/Customer Facing routes */}
        <Route path="/" element={<ShopLayout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="about" element={<About />} />
          <Route path="profile" element={<Profile />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="checkout/card" element={<CardPayment />} />
          <Route path="checkout/confirmation" element={<OrderConfirmation />} />
          <Route path="track-order" element={<TrackOrder />} />
        </Route>

        {/* Admin/Staff Facing routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="discounts" element={<DiscountsManagement />} />
          <Route path="pos" element={<POSRegister />} />
          <Route path="inventory" element={<InventoryGrid />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="staffs" element={<StaffManagement />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
