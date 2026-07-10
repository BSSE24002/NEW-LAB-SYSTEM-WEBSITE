// File: backend/src/controllers/posController.js
const db = require('../config/db');

// GET /api/pos - list all POS transactions
const getAllTransactions = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.*, 'pos' AS type
            FROM POS_Transactions p
            ORDER BY p.created_at DESC;
        `);
        const transactions = [];
        for (const tx of result.rows) {
            const itemsResult = await db.query(
                `SELECT product_name AS name, product_sku AS sku, quantity AS qty, price_at_time AS price
                 FROM Order_Items WHERE pos_transaction_id = $1;`,
                [tx.id]
            );
            transactions.push({ ...tx, items: itemsResult.rows });
        }
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching POS transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// POST /api/pos/checkout - process a POS sale
const processCheckout = async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const { cashier_name, staff_id, payment_method, items, tax_amount, total_amount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Cannot checkout with an empty cart.' });
        }

        // Insert transaction record
        const txResult = await client.query(
            `INSERT INTO POS_Transactions (staff_id, cashier_name, payment_method, tax_amount, total_amount, status)
             VALUES ($1, $2, $3, $4, $5, 'completed') RETURNING *;`,
            [staff_id || null, cashier_name || 'Staff', payment_method || 'cash', tax_amount || 0, total_amount]
        );
        const transaction = txResult.rows[0];

        // Insert order items & decrement inventory
        for (const item of items) {
            await client.query(
                `INSERT INTO Order_Items (pos_transaction_id, product_id, product_name, product_sku, size, quantity, price_at_time)
                 VALUES ($1, $2, $3, $4, $5, $6, $7);`,
                [transaction.id, item.product_id || null, item.name, item.sku || item.id, item.size || null, item.quantity, item.price]
            );

            // Decrement stock
            if (item.product_id) {
                await client.query(
                    `UPDATE Inventory SET stock_quantity = GREATEST(0, stock_quantity - $1), last_updated = NOW()
                     WHERE product_id = $2;`,
                    [item.quantity, item.product_id]
                );
            }
        }

        await client.query('COMMIT');

        // Note: real-time WebSocket broadcasts removed for Vercel serverless compatibility

        res.status(201).json({ ...transaction, items });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error processing POS checkout:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
};

// PATCH /api/pos/:id/refund
const refundTransaction = async (req, res) => {
    try {
        const result = await db.query(
            `UPDATE POS_Transactions SET status='refunded' WHERE id=$1 RETURNING *;`,
            [req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Transaction not found.' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error refunding POS transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllTransactions, processCheckout, refundTransaction };
