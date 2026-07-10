// Central API client — all backend communication goes through here.
// Using native fetch so no extra dependencies are needed.

// In production: VITE_API_BASE_URL points to the deployed Vercel backend
// Fallback: hardcoded backend URL so the app works even without env var
// In local dev: Vite proxy forwards '/api' to localhost:5000
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? '/api' : 'https://flow-backend-psi.vercel.app/api');

async function request(method, path, body) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) options.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.error || `Request failed: ${response.status}`;
    throw new Error(message);
  }
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────────────────────────────────────
export const api = {
  // Products
  getProducts: () => request('GET', '/products'),
  getProduct: (id) => request('GET', `/products/${id}`),
  createProduct: (data) => request('POST', '/products', data),
  updateProduct: (id, data) => request('PUT', `/products/${id}`, data),
  deleteProduct: (id) => request('DELETE', `/products/${id}`),

  // Inventory
  getInventory: () => request('GET', '/inventory'),
  addStock: (product_id, quantity_added) => request('POST', '/inventory', { product_id, quantity_added }),
  setStock: (productId, stock) => request('PATCH', `/inventory/${productId}`, { stock }),

  // Categories
  getCategories: () => request('GET', '/categories'),
  createCategory: (data) => request('POST', '/categories', data),
  updateCategory: (id, data) => request('PUT', `/categories/${id}`, data),
  deleteCategory: (id) => request('DELETE', `/categories/${id}`),

  // Orders (unified online + pos)
  getOrders: () => request('GET', '/orders'),
  getOrder: (id) => request('GET', `/orders/${id}`),
  createOrder: (data) => request('POST', '/orders', data),
  updateOrderStatus: (id, status) => request('PATCH', `/orders/${id}/status`, { status }),
  updateTracking: (id, tracking_no, delivery_provider) => request('PATCH', `/orders/${id}/tracking`, { tracking_no, delivery_provider }),
  deleteOrder: (id) => request('DELETE', `/orders/${id}`),
  trackOrder: (orderId) => request('GET', `/orders/track/${orderId}`),

  // POS
  getPOSTransactions: () => request('GET', '/pos'),
  posCheckout: (data) => request('POST', '/pos/checkout', data),
  refundPOS: (id) => request('PATCH', `/pos/${id}/refund`),

  // Staff
  getStaff: () => request('GET', '/staff'),
  createStaff: (data) => request('POST', '/staff', data),
  deleteStaff: (id) => request('DELETE', `/staff/${id}`),
  loginStaff: (email, pin) => request('POST', '/staff/login', { email, pin }),

  // Customers
  getCustomers: () => request('GET', '/customers'),
  getCustomer: (email) => request('GET', `/customers/${email}`),
  getCustomerOrders: (email) => request('GET', `/customers/${email}/orders`),
  registerCustomer: (data) => request('POST', '/customers/register', data),

  // Discounts
  getDiscounts: () => request('GET', '/discounts'),
  createDiscount: (data) => request('POST', '/discounts', data),
  deleteDiscount: (id) => request('DELETE', `/discounts/${id}`),

  // Coupons
  getCoupons: () => request('GET', '/coupons'),
  createCoupon: (data) => request('POST', '/coupons', data),
  deleteCoupon: (id) => request('DELETE', `/coupons/${id}`),
  validateCoupon: (code) => request('POST', '/coupons/validate', { code }),

  // Posts
  getPosts: () => request('GET', '/posts'),
  createPost: (data) => request('POST', '/posts', data),
};

export default api;
