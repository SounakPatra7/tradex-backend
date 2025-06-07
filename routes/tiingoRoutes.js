import express from 'express';
import {  getMultipleStocks, getSingleStock } from '../controllers/tiingoController.js';
import {getStockSymbols} from '../controllers/stockController.js'

const router = express.Router();

// Route for multiple stocks
router.post('/stocks', getMultipleStocks);
// Route for a single stock
router.get('/stock/:symbol', getSingleStock);
// 
router.get('/stocks/symbols', getStockSymbols);

export default router;