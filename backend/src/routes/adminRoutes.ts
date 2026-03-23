import express, { Request, Response } from 'express';
import { protect, adminOnly } from '../middleware/auth';
import User from '../models/User';
import LoginLog from '../models/LoginLog';

const router = express.Router();

// Route: GET /api/admin/metrics
router.get('/metrics', protect, adminOnly, async (req: Request, res: Response) => {
  try {
    const totalLogins = await LoginLog.countDocuments();
    const failedLogins = await LoginLog.countDocuments({ status: 'FAILED' });
    const blockedAttacks = await LoginLog.countDocuments({ status: 'BLOCKED' });
    const successfulLogins = await LoginLog.countDocuments({ status: 'SUCCESS' });

    res.json({
      totalLogins,
      failedLogins,
      blockedAttacks,
      successfulLogins,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route: GET /api/admin/logs
router.get('/logs', protect, adminOnly, async (req: Request, res: Response) => {
  try {
    const logs = await LoginLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route: GET /api/admin/employees
router.get('/employees', protect, adminOnly, async (req: Request, res: Response) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-passwordHash');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
