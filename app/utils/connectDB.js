import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

export default pool;
