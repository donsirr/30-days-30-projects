const fs = require('fs');
const path = require('path');
// Load environment variables immediately
require('dotenv').config();
const db = require('./db');

(async () => {
    try {
        console.log('Running database migrations...');

        // Read the schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Execute the schema SQL
        await db.query(schemaSql);

        console.log('Migrations completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
})();
