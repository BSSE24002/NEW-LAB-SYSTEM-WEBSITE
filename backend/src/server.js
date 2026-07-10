// File: backend/src/server.js
// Serverless-compatible entry point for Vercel + local dev
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

// In local dev, start the HTTP server normally.
// On Vercel, this file is imported as a module and `app` is exported below.
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 FLOW Backend running on http://localhost:${PORT}`);
    });
}

module.exports = app;