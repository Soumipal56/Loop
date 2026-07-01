import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { config } from '../config/config.js';
import { generateOTP, sendOTPEmail } from '../services/otp.service.js';

const generateToken = (id: string) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: '30d',
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    const user = await User.create({ username, email, password });
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
      
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      try {
        await sendOTPEmail(email, otp);
      } catch (err) {
        console.error('Email failed to send: ', err);
      }

      res.status(200).json({ 
        message: 'OTP sent to email',
        // Returning OTP to frontend to help development
        otp: otp
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (user) {
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
      
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      try {
        await sendOTPEmail(email, otp);
      } catch (err) {
        console.error('Email failed to send: ', err);
      }

      res.status(200).json({ 
        message: 'A new OTP has been sent to your email',
        otp: otp // Returning for dev purposes
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || user.otp !== otp) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }
    if (user.otpExpires && user.otpExpires < new Date()) {
      res.status(400).json({ message: 'OTP has expired' });
      return;
    }
    
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user.id);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: config.nodeEnv === 'production' ? 'none' : 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      _id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user;
  if (user) {
    res.status(200).json({
      _id: user.id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
