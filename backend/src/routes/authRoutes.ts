import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User';
import LoginLog from '../models/LoginLog';

const router = express.Router();

// Brute Force Protection (5 attempts per 15 minutes)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: { message: 'Too many login attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'supersecretkey', {
    expiresIn: '1d',
  });
};

// Route: POST /api/auth/login
router.post('/login', loginLimiter, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const ip = req.ip || req.socket.remoteAddress || 'Unknown';

  try {
    const user = await User.findOne({ email });

    if (!user) {
      await LoginLog.create({ username: email, ip, status: 'FAILED' });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (isMatch) {
      await LoginLog.create({ username: email, ip, status: 'SUCCESS' });
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken((user._id as any).toString(), user.role),
      });
    } else {
      await LoginLog.create({ username: email, ip, status: 'FAILED' });
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed Initial Admin Route (For testing purposes)
router.post('/seed', async (req: Request, res: Response) => {
  try {
    const adminExists = await User.findOne({ email: 'admin@securecorp.com' });
    if (adminExists) return res.status(400).json({ message: 'Admin already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin@123', salt);

    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@securecorp.com',
      passwordHash,
      role: 'admin',
    });

    const employee = await User.create({
        name: 'John Employee',
        email: 'employee@securecorp.com',
        passwordHash,
        role: 'employee',
      });

    res.status(201).json({ message: 'Admin and Employee seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding data' });
  }
});

export default router;
