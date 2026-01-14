/**
 * PostgreSQL Database Connection Pool
 */

const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'iskolarhub',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: 20, // Maximum number of connections in pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.on('connect', () => {
    console.log('📦 Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
    process.exit(-1);
});

/**
 * Execute a query with parameters
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
const query = async (text, params) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    if (process.env.NODE_ENV === 'development') {
        console.log('Query executed:', { text: text.substring(0, 80), duration: `${duration}ms`, rows: res.rowCount });
    }

    return res;
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise} Pool client
 */
const getClient = async () => {
    const client = await pool.connect();
    const query = client.query.bind(client);
    const release = () => {
        client.release();
    };

    // Timeout to auto-release client
    const timeout = setTimeout(() => {
        console.error('Client has been checked out for too long!');
        release();
    }, 30000);

    client.release = () => {
        clearTimeout(timeout);
        client.release();
    };

    return { query, release, client };
};

module.exports = {
    query,
    getClient,
    pool
};
