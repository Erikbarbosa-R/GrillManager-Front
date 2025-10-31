import { Router } from 'express';
import { getOrInitRestaurant, setRestaurant } from '../db.js';
import { z } from 'zod';

export const restaurantRouter = Router();

restaurantRouter.get('/', (req, res) => {
  try {
    const info = getOrInitRestaurant();
    res.json({ success: true, data: info });
  } catch (error: any) {
    console.error('[Restaurant GET] Erro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

const updateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  logo: z.string().optional(),
  theme: z.record(z.any()).optional(),
});

restaurantRouter.put('/', (req, res) => {
  try {
    const parse = updateSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, message: 'Dados inválidos', error: parse.error.flatten() });
    }
    const updated = setRestaurant(parse.data);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('[Restaurant PUT] Erro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


