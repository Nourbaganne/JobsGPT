import mysql from 'mysql2/promise';

// Create a connection pool
export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST!,
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE!,
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
