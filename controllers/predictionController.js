import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const predictStockPrice = async (req, res) => {
  const { symbol } = req.body;

  try {
    const python = spawn('python', [path.join(__dirname, '../ml/predict.py'), symbol]);

    let data = '';
    python.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    python.stderr.on('data', (err) => {
      console.error(`stderr: ${err}`);
    });

    python.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ message: 'Prediction failed' });
      }
      res.json({ symbol, predictedPrice: parseFloat(data.trim()) });
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal error', error: error.message });
  }
};
