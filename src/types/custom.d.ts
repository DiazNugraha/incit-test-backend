import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Define the type of `user` as needed, e.g., UserPayload
    }
  }
}
