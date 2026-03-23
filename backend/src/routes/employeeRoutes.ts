import express, { Request, Response } from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import Schedule from '../models/Schedule';

const router = express.Router();

// Route: GET /api/employee/profile
router.get('/profile', protect, async (req: AuthRequest, res: Response) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Route: GET /api/employee/schedules
router.get('/schedules', protect, async (req: AuthRequest, res: Response) => {
  try {
    const schedules = await Schedule.find({ employeeId: req.user?._id });
    // Add default schedules if none exist to match the specification UI
    if (schedules.length === 0) {
      return res.json([
        { day: 'Monday', task: '9:00 AM – Team Standup', time: '09:00' },
        { day: 'Monday', task: '11:00 AM – Development', time: '11:00' },
        { day: 'Tuesday', task: '10:00 AM – Client Meeting', time: '10:00' },
        { day: 'Wednesday', task: 'Project Development', time: 'All Day' }
      ]);
    }
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
