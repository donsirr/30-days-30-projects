/**
 * Iskolar-Hub Backend Server
 * Scholarship Matching Engine for the 2026 Philippine Academic Cycle
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const scholarshipRoutes = require('./routes/scholarships');
const matchRoutes = require('./routes/match');
const deadlineRoutes = require('./routes/deadlines');
const studentRoutes = require('./routes/students');
const documentRoutes = require('./routes/documents');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API Routes
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/deadlines', deadlineRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/documents', documentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎓 ISKOLAR-HUB Backend Server                          ║
║   Scholarship Matching Engine v1.0.0                      ║
║                                                           ║
║   Server running on port ${PORT}                            ║
║   Environment: ${process.env.NODE_ENV || 'development'}                            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
