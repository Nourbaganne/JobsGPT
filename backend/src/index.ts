import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { testConnection } from './config/db.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Validate required environment variables
const requiredEnvVars = [
  'JWT_ACCESS_SECRET',
  'MYSQL_HOST',
  'MYSQL_USER',
  'MYSQL_DATABASE',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();

// Security middleware
app.use(helmet());

// General rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150,
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Name'],
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Apply stricter rate limits to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// API routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function start(): Promise<void> {
  await testConnection();

  const port = parseInt(process.env.PORT || '4000');
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
