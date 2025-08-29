import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}


export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
    return
  }
};

export const verifyAdmin = (req: Request, res: Response, next: NextFunction):void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Admin only' });
    return
  }
  next();
};
