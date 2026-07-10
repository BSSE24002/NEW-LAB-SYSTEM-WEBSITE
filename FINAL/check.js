import pg from 'pg';

const client = new pg.Client('postgresql://neondb_owner:npg_wUa8C6kAMGBr@ep-ancient-forest-aozxpu5j-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

async function check() {
  await client.connect();
  const res = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'inventory'`);
  console.log(res.rows);
  await client.end();
}

check();
