// File: backend/src/controllers/orderController.js
const db = require('../config/db');

// Generates a random 8-character uppercase alphanumeric order code e.g. "A3XK9T2B"
function generateOrderCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

// GET /api/orders - unified list (online + pos wrapped as orders)
const getAllOrders = async (req, res) => {
    try {
        const ordersResult = await db.query(`
            SELECT 
                o.id,
                o.order_code,
                'online' AS type,
                o.customer_email,
                o.customer_phone,
                o.shipping_address,
                o.status,
                o.payment_method,
                o.payment_details,
                o.subtotal,
                o.shipping,
                o.discount,
                o.total_amount AS total,
                o.tracking_no,
                o.delivery_provider,
                o.created_at AS date
            FROM Online_Orders o
            ORDER BY o.created_at DESC;
        `);

        const posResult = await db.query(`
            SELECT 
                p.id,
                'pos' AS type,
                p.cashier_name AS cashier,
                p.status,
                p.total_amount AS total,
                p.payment_method,
                p.created_at AS date
            FROM POS_Transactions p
            ORDER BY p.created_at DESC;
        `);

        // Fetch items for online orders
        const allOrders = [];
        for (const order of ordersResult.rows) {
            const itemsResult = await db.query(
                `SELECT product_name AS name, product_sku AS sku, quantity AS qty, price_at_time AS price
                 FROM Order_Items WHERE online_order_id = $1;`,
                [order.id]
            );
            allOrders.push({ ...order, items: itemsResult.rows });
        }

        // Fetch items for POS transactions
        for (const tx of posResult.rows) {
            const itemsResult = await db.query(
                `SELECT product_name AS name, product_sku AS sku, quantity AS qty, price_at_time AS price
                 FROM Order_Items WHERE pos_transaction_id = $1;`,
                [tx.id]
            );
            allOrders.push({ ...tx, items: itemsResult.rows });
        }

        // Sort by date descending
        allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json(allOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// GET /api/orders/:id  - single online order by ID string (e.g. ORD-123456)
const getOrderById = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM Online_Orders WHERE id = $1',
            [req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found.' });
        const order = result.rows[0];
        const itemsResult = await db.query(
            `SELECT product_name AS name, product_sku AS sku, quantity AS qty, price_at_time AS price
             FROM Order_Items WHERE online_order_id = $1;`,
            [order.id]
        );
        res.status(200).json({ ...order, items: itemsResult.rows });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// POST /api/orders - create a new online order
const createOrder = async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const {
            customer_email, customer_phone, shipping_address,
            payment_method, payment_details,
            subtotal, shipping, discount, total_amount,
            items
        } = req.body;

        // Upsert customer
        let customer_id = null;
        if (customer_email) {
            const custResult = await client.query(
                `INSERT INTO Customers (email, phone, address)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (email) DO UPDATE SET phone=EXCLUDED.phone, address=EXCLUDED.address
                 RETURNING id;`,
                [customer_email, customer_phone, shipping_address]
            );
            customer_id = custResult.rows[0].id;
        }

        // Generate unique 8-char order code (retry if collision)
        let order_code;
        for (let attempt = 0; attempt < 10; attempt++) {
            const candidate = generateOrderCode();
            const existing = await client.query('SELECT 1 FROM Online_Orders WHERE order_code=$1', [candidate]);
            if (existing.rows.length === 0) { order_code = candidate; break; }
        }
        if (!order_code) throw new Error('Could not generate unique order code');

        // Create order
        const orderResult = await client.query(
            `INSERT INTO Online_Orders
             (customer_id, customer_email, customer_phone, shipping_address, payment_method, payment_details, subtotal, shipping, discount, total_amount, status, order_code, tracking_no)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *;`,
            [
                customer_id, customer_email, customer_phone, shipping_address,
                payment_method, payment_details || {},
                subtotal || 0, shipping || 0, discount || 0, total_amount,
                payment_method === 'bank_transfer' ? 'pending_verification' : 'confirmed',
                order_code,
                order_code // Auto-set tracking_no to the same order_code
            ]
        );
        const newOrder = orderResult.rows[0];

        // Insert order items & decrement inventory
        if (items && items.length > 0) {
            for (const item of items) {
                await client.query(
                    `INSERT INTO Order_Items (online_order_id, product_id, product_name, product_sku, size, quantity, price_at_time)
                     VALUES ($1, $2, $3, $4, $5, $6, $7);`,
                    [newOrder.id, item.product_id || null, item.name, item.sku, item.size || null, item.qty, item.price]
                );
                // Decrement inventory if product_id known
                if (item.product_id) {
                    await client.query(
                        `UPDATE Inventory SET stock_quantity = GREATEST(0, stock_quantity - $1), last_updated = NOW()
                         WHERE product_id = $2;`,
                        [item.qty, item.product_id]
                    );
                }
            }
        }

        await client.query('COMMIT');

        // Note: real-time WebSocket broadcasts removed for Vercel serverless compatibility

        res.status(201).json({ ...newOrder, items: items || [] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
};

// PATCH /api/orders/:id/status - update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const result = await db.query(
            'UPDATE Online_Orders SET status=$1 WHERE id=$2 RETURNING *;',
            [status, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found.' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// PATCH /api/orders/:id/tracking
const updateTracking = async (req, res) => {
    try {
        const { tracking_no, delivery_provider } = req.body;
        const result = await db.query(
            'UPDATE Online_Orders SET tracking_no=$1, delivery_provider=$2 WHERE id=$3 RETURNING *;',
            [tracking_no, delivery_provider, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found.' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating tracking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
    try {
        const result = await db.query('DELETE FROM Online_Orders WHERE id=$1 RETURNING id;', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found.' });
        res.status(200).json({ message: 'Order deleted.' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// GET /api/orders/track/:orderId - public tracking by order_code
const trackOrder = async (req, res) => {
    try {
        const code = req.params.orderId.trim().toUpperCase();
        const result = await db.query(
            'SELECT * FROM Online_Orders WHERE order_code = $1',
            [code]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found.' });
        const order = result.rows[0];
        const itemsResult = await db.query(
            `SELECT product_name AS name, product_sku AS sku, quantity AS qty, price_at_time AS price
             FROM Order_Items WHERE online_order_id = $1;`,
            [order.id]
        );
        res.status(200).json({ ...order, items: itemsResult.rows });
    } catch (error) {
        console.error('Error tracking order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllOrders, getOrderById, createOrder, updateOrderStatus, updateTracking, deleteOrder, trackOrder };
