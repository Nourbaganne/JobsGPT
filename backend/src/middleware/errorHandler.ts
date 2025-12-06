import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors.js';
import { env } from '../config/env.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error in development
  if (env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Handle known API errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: 'Token expired',
    });
    return;
  }

  // Handle unknown errors
  res.status(500).json({
    success: false,
    error: env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
  });
}

// 404 handler for unknown routes
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  });
}

