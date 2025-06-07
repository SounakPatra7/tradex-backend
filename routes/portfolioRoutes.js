import express from 'express';
import {
  buyStock,
  sellStock,
  getPortfolio,
  getStockQuantity,

} from '../controllers/portfolioController.js';

import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getPortfolio);
router.post('/buy', protect, buyStock);
router.post('/sell', protect, sellStock);
router.get('/:symbol', protect, getStockQuantity); 

export default router;
