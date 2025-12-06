import mysql from 'mysql2/promise';
import { env } from './env.js';

// Create a connection pool
export const pool = mysql.createPool({
  host: env.MYSQL_HOST,
  port: parseInt(env.MYSQL_PORT),
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection
export async function testConnection(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

