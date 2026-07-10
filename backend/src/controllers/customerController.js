// File: backend/src/controllers/customerController.js
const db = require('../config/db');

const getAllCustomers = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Customers ORDER BY created_at DESC;');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getCustomerByEmail = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Customers WHERE email=$1;', [req.params.email]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found.' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// GET /api/customers/:email/orders - customer's own orders
const getCustomerOrders = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, status, total_amount AS total, created_at AS date
             FROM Online_Orders WHERE customer_email=$1 ORDER BY created_at DESC;`,
            [req.params.email]
        );
        const orders = [];
        for (const order of result.rows) {
            const itemsResult = await db.query(
                `SELECT product_name AS name, quantity AS qty, price_at_time AS price FROM Order_Items WHERE online_order_id=$1;`,
                [order.id]
            );
            orders.push({ ...order, items: itemsResult.rows });
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// POST /api/customers/register - register or return existing customer
const registerCustomer = async (req, res) => {
    try {
        const { email, first_name, last_name, phone, address } = req.body;
        if (!email) return res.status(400).json({ error: 'email is required.' });
        const result = await db.query(
            `INSERT INTO Customers (email, first_name, last_name, phone, address)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (email) DO UPDATE SET phone=EXCLUDED.phone RETURNING *;`,
            [email, first_name, last_name, phone, address]
        );
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error registering customer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllCustomers, getCustomerByEmail, getCustomerOrders, registerCustomer };
