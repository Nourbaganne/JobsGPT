import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Expected 4xx outcomes — a wrong password, an absent session cookie, a
  // missing row — are the API working, not failing. Printing them with a full
  // stack trace makes ordinary use look like a crash, which buries the 5xx
  // errors that actually need reading. One line for those, traces for the rest.
  const isExpected = err instanceof ApiError && err.statusCode < 500;

  if (isExpected) {
    if (process.env.NODE_ENV === 'development') {
      const { statusCode, message } = err as ApiError;
      console.warn(`↩︎  ${statusCode} ${req.method} ${req.originalUrl} — ${message}`);
    }
  } else {
    console.error(`✖  ${req.method} ${req.originalUrl}`, err);
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
    error: process.env.NODE_ENV === 'production' 
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
