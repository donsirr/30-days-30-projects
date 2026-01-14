const fs = require('fs');
const path = require('path');
const db = require('./db');

(async () => {
    try {
        console.log('Seeding database...');

        // Read the seed file
        const seedPath = path.join(__dirname, 'seed.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        // Execute the seed SQL
        await db.query(seedSql);

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
})();
