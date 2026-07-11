import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

const DATABASE_URL = "postgresql://neondb_owner:npg_wUa8C6kAMGBr@ep-ancient-forest-aozxpu5j-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const client = new Client({
  connectionString: DATABASE_URL,
});

async function runMigration() {
  try {
    await client.connect();
    console.log('Connected to database.');

    const sqlPath = path.join(__dirname, '../database/alter_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Running migration...');
    await client.query(sql);
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Error running migration:', err);
  } finally {
    await client.end();
  }
}

runMigration();
