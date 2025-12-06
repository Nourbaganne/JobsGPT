import { Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: string;
}

export function sendSuccess<T>(res: Response, data: T, statusCode: number = 200): Response {
  const response: SuccessResponse<T> = {
    success: true,
    data,
  };
  return res.status(statusCode).json(response);
}

export function sendError(res: Response, message: string, statusCode: number = 500): Response {
  const response: ErrorResponse = {
    success: false,
    error: message,
  };
  return res.status(statusCode).json(response);
}

export function sendCreated<T>(res: Response, data: T): Response {
  return sendSuccess(res, data, 201);
}

export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}

