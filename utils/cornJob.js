// cronJob.js
import cron from 'node-cron';  // Import node-cron to schedule tasks
import { getAndSaveStockPrices } from './stockService.js';
 // Import the function to update stock prices

// Schedule the task to update stock prices every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Fetching and updating stock prices...');
  const symbols = ['AAPL', 'GOOG', 'AMZN', 'MSFT', 'TSLA'];  // Add the stock symbols you want to track
  await getAndSaveStockPrices(symbols);  // Fetch and save stock prices automatically
});
