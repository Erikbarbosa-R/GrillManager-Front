import express from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health.js';
import { restaurantRouter } from './routes/restaurant.js';

const app = express();

// Configuração CORS mais permissiva
app.use(cors({
  origin: true, // Permite todas as origens dinamicamente
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  credentials: false // Desabilitado para permitir origin: true
}));

// Headers CORS adicionais para garantir compatibilidade
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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

// Middleware para rotas não encontradas
api.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada' });
});

// Middleware global de tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Erro Global]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[GrillManager-Back] API rodando em http://localhost:${PORT}/api`);
});


