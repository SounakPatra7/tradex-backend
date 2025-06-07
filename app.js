import express from 'express';
import cors from 'cors';
import tiingoRoutes from './routes/tiingoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/tiingo', tiingoRoutes);
app.use('/api/predict', predictionRoutes);

export default app;
