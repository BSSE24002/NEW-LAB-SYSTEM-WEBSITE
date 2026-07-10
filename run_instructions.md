# ✅ Full-Stack Migration — Run Instructions & Verification Checklist

## 1. Install Dependencies

No new packages needed on the frontend (uses native `fetch`). Backend already has all required packages. Just run:

```bash
# Terminal 1 — Backend
cd c:\Users\mwar9\Documents\DB_project\backend
npm install
```

```bash
# Terminal 2 — Frontend
cd c:\Users\mwar9\Documents\DB_project\FINAL
npm install
```

---

## 2. Initialize the PostgreSQL Database

> [!IMPORTANT]
> Ensure PostgreSQL is running and a database named `flow_db` exists.

```bash
# Create the database if it doesn't exist yet
psql -U postgres -c "CREATE DATABASE flow_db;"

# Run the unified schema (creates all tables and seeds default admin + categories)
psql -U postgres -d flow_db -f "c:\Users\mwar9\Documents\DB_project\database\init.sql"
```

The schema will create these tables: `Users`, `Customers`, `Product_Categories`, `Products`, `Inventory`, `Online_Orders`, `POS_Transactions`, `Order_Items`, `Payments`, `Deliveries`, `Discounts`, `Coupons`.

It will seed:
- **Default admin:** email `admin@flow.com`, pin `1234`, role `admin`
- **Default categories:** Tops, Bottoms, Knitwear, Outerwear

---

## 3. Verify Backend `.env`

Confirm `backend/.env` has the correct values:

```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=danyman250
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flow_db
FRONTEND_URL=http://localhost:5173
```

---

## 4. Start Both Servers

```bash
# Terminal 1 — Backend (must start first)
cd c:\Users\mwar9\Documents\DB_project\backend
npm run dev
```
You should see:
```
✅ Connected to the FLOW Unified PostgreSQL database.
🚀 FLOW Backend Engine (with WebSockets) ignited on http://localhost:5000
```

```bash
# Terminal 2 — Frontend
cd c:\Users\mwar9\Documents\DB_project\FINAL
npm run dev
```
Frontend will be available at `http://localhost:5173`.

---

## 5. Manual Verification Plan

### ✅ Test 1 — Admin Dashboard
1. Navigate to `http://localhost:5173/admin`
2. Dashboard should show **0 revenue / 0 orders** (no data yet)
3. Open browser DevTools → Network tab — confirm calls to `/api/orders` return `200 OK`

### ✅ Test 2 — Create a Product
1. Go to Admin → Products → "Add Product"
2. Fill in name, SKU, price, category, image URL
3. Click "Save Product"
4. Confirm it appears in the table
5. Verify in DB: `SELECT * FROM Products;`

### ✅ Test 3 — Inventory Stock
1. Go to Admin → Inventory
2. The product you created should appear with stock `0`
3. Click the stock number → edit it → Save
4. Verify: `SELECT * FROM Inventory;`

### ✅ Test 4 — POS Transaction (The Core Test)
1. Go to Admin → POS Register
2. Select a product from the grid (must have stock > 0)
3. Click "Card" or "Cash" to checkout
4. Confirm green success screen appears
5. Verify in DB:
   ```sql
   SELECT * FROM POS_Transactions ORDER BY created_at DESC LIMIT 1;
   SELECT * FROM Order_Items WHERE pos_transaction_id = <id>;
   SELECT stock_quantity FROM Inventory WHERE product_id = <id>;
   ```
6. Go to Admin → Orders and confirm the POS transaction appears in the list

### ✅ Test 5 — Online Order (E2E)
1. Go to `http://localhost:5173/catalog`
2. Add a product to cart
3. Proceed to checkout → fill details → choose **Bank Transfer** → enter TID
4. Click "Confirm Order"
5. You should be redirected to the confirmation page
6. Verify in DB: `SELECT * FROM Online_Orders ORDER BY created_at DESC LIMIT 1;`
7. Go to Admin → Orders → confirm the order appears with status `pending_verification`
8. Go to Track Order → enter the order ID → status should display

### ✅ Test 6 — Category & Discount Management
1. Create a new category → verify in DB
2. Create a discount rule → verify in `Discounts` table
3. Create a coupon code → use it at checkout → verify discount applied

---

## 6. Architecture Summary

```
Frontend (port 5173)          Backend (port 5000)         Database
──────────────────────    ─────────────────────────    ──────────────
FINAL/src/services/api.js ──► /api/* routes          ──► PostgreSQL
  (native fetch)          ──► controllers/*           ──► flow_db
Vite proxy (/api → 5000)      Socket.io (real-time)

Files changed:
  backend/src/app.js                  (CORS + 9 route groups)
  backend/src/controllers/*.js        (9 new controllers)
  backend/src/routes/*.js             (9 new route files)
  FINAL/vite.config.js                (Vite proxy added)
  FINAL/src/services/api.js           (NEW: central API client)
  FINAL/src/pages/admin/*.jsx         (6 files refactored)
  FINAL/src/pages/shop/*.jsx          (4 files refactored)
  database/init.sql                   (consolidated unified schema)
  database/schema.sql                 (moved from FINAL/)
```
