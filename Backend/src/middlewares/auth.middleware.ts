import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { config } from '../config/config.js';

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
      const user = await User.findById(decoded.id).select('-password -otp -otpExpires');
      
      if (!user) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }
      
      (req as any).user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
