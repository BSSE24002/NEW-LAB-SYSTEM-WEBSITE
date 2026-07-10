const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all posts
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Posts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching posts' });
    }
});

// Create a post
router.post('/', async (req, res) => {
    const { title, content } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO Posts (title, content) VALUES ($1, $2) RETURNING *',
            [title, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error creating post' });
    }
});

module.exports = router;
