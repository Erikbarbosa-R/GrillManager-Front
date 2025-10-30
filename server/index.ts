import express from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health.js';
import { restaurantRouter } from './routes/restaurant.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Base prefix
const api = express.Router();
app.use('/api', api);

// Routes
api.use('/health', healthRouter);
api.use('/restaurant', restaurantRouter);

// CORS preflight catch-all under /api
api.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[GrillManager-Back] API rodando em http://localhost:${PORT}/api`);
});


