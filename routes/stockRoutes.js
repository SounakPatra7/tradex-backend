import express from 'express';
import { getAllStocks, addStock, updateStockPrices } from '../controllers/stockController.js';
import {protect}  from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllStocks);
router.post('/add', protect, addStock);
router.post('/update', updateStockPrices); // Optional: Admin feature

export default router;
