import express from 'express';
import { predictStockPrice } from '../controllers/predictionController.js';
import { protect } from '../middlewares/authMiddleware.js'


const router = express.Router();

router.post('/', protect, predictStockPrice);

export default router;
