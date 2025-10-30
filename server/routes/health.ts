import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  const uptimeSec = process.uptime();
  res.json({
    success: true,
    data: {
      status: 'ok',
      uptime: uptimeSec,
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
    },
  });
});


