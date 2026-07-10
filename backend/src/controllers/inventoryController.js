// File: backend/src/controllers/inventoryController.js
const db = require('../config/db');

// GET /api/inventory - full flat inventory view (joined with products)
const getAllInventory = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT i.id, i.product_id, i.stock_quantity AS stock, i.low_stock_threshold, i.last_updated,
                   p.sku, p.name, p.price, p.attributes, p.thumbnail_url,
                   c.name AS category
            FROM Inventory i
            JOIN Products p ON i.product_id = p.id
            LEFT JOIN Product_Categories c ON p.category_id = c.id
            ORDER BY p.name ASC;
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// POST /api/inventory - add or update stock for a product
const updateInventory = async (req, res) => {
    const { product_id, quantity_added } = req.body;
    if (!product_id || quantity_added === undefined) {
        return res.status(400).json({ error: 'product_id and quantity_added are required.' });
    }
    try {
        const checkResult = await db.query('SELECT * FROM Inventory WHERE product_id = $1', [product_id]);
        let newStockLevel;

        if (checkResult.rows.length > 0) {
            const currentStock = checkResult.rows[0].stock_quantity;
            newStockLevel = Math.max(0, currentStock + parseInt(quantity_added));
            await db.query(
                'UPDATE Inventory SET stock_quantity=$1, last_updated=CURRENT_TIMESTAMP WHERE product_id=$2 RETURNING *;',
                [newStockLevel, product_id]
            );
        } else {
            newStockLevel = Math.max(0, parseInt(quantity_added));
            await db.query(
                'INSERT INTO Inventory (product_id, stock_quantity) VALUES ($1, $2) RETURNING *;',
                [product_id, newStockLevel]
            );
        }

        // Note: real-time WebSocket broadcasts removed for Vercel serverless compatibility

        res.status(200).json({ status: 'success', data: { product_id, new_stock: newStockLevel } });
    } catch (error) {
        console.error('Error updating inventory:', error);
        res.status(500).json({ error: 'Internal server error while updating inventory.' });
    }
};

// PATCH /api/inventory/:productId - directly set stock level
const setStock = async (req, res) => {
    const { stock } = req.body;
    const { productId } = req.params;
    if (stock === undefined) return res.status(400).json({ error: 'stock is required.' });
    try {
        const result = await db.query(
            'UPDATE Inventory SET stock_quantity=$1, last_updated=CURRENT_TIMESTAMP WHERE product_id=$2 RETURNING *;',
            [Math.max(0, parseInt(stock)), productId]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Inventory record not found.' });

        // Note: real-time WebSocket broadcasts removed for Vercel serverless compatibility

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error setting stock:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllInventory, updateInventory, setStock };