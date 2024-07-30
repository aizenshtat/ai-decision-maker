// /src/utils/errorHandling.ts

import { NextResponse } from 'next/server';

export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const handleApiError = (error: unknown) => {
  console.error('API Error:', error);
  
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }
  
  return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
};

export const handleClientError = (error: unknown): string => {
  console.error('Client Error:', error);
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export const createApiErrorResponse = (message: string, statusCode: number) => {
  return NextResponse.json({ error: message }, { status: statusCode });
};