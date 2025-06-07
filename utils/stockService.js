
// import yahooFinance from 'yahoo-finance2';
// import Stock from '../models/Stock.js';

// export const getAndSaveStockPrices = async (req, res) => {
//     const stockSymbols =  [
//         'AAPL', 'GOOGL', 'AMZN', 'TSLA', 'MSFT', 'META', 'NVDA', 'NFLX', 'ADBE', 'INTC', 
//         'SPOT', 'TWTR', 'BRK.B', 'WMT', 'KO', 'NKE', 'JNJ', 'PFE', 'XOM', 'V', 'MA', 
//         'MCD', 'DIS', 'AMD', 'ZM', 'SNAP', 'PYPL', 'PG', 'HD', 'VZ', 'SHOP'
//       ]; // Include MSFT here

//   try {
//     const stockPromises = stockSymbols.map(async (symbol) => {
//       // Fetch stock data from Yahoo Finance 2
//       const data = await yahooFinance.quote(symbol);

//       // Log only the stock's name and price
//       console.log(`Stock: ${data.shortName}, Price: $${data.regularMarketPrice}`);

//       // Check if stock already exists in the database
//       const existingStock = await Stock.findOne({ symbol: symbol });
//       if (existingStock) {
//         console.log(`${data.shortName} updated to $${data.regularMarketPrice}`);
//         // Update price for existing stock
//         existingStock.currentPrice = data.regularMarketPrice;
//         await existingStock.save();
//         return existingStock;
//       }

//       // Create and save a new stock if it doesn't exist
//       const newStock = new Stock({
//         symbol: symbol,
//         currentPrice: data.regularMarketPrice,
//         name: data.shortName,
//       });

//       // Save new stock to database
//       await newStock.save();
//       console.log(`${data.shortName} added to DB with price $${data.regularMarketPrice}`);
//       return newStock;
//     });

//     // Wait for all promises to resolve
//     const addedStocks = await Promise.all(stockPromises);

//     res.status(201).json({
//       message: 'Stocks added/updated successfully',
//       stocks: addedStocks,
//     });
//   } catch (error) {
//     console.error('Error adding/updating stocks:', error);
//     res.status(500).json({ message: 'Error adding/updating stocks' });
//   }
// };


// import yahooFinance from 'yahoo-finance2';
// import Stock from '../models/Stock.js';

// export const getAndSaveStockPrices = async (req, res) => {
//   const stockSymbols = [
//     'AAPL', 'GOOGL', 'AMZN', 'TSLA', 'MSFT', 'META', 'NVDA', 'NFLX',
//     'ADBE', 'INTC', 'SPOT','CRM','NKE', 'BRK-B', 
//     'WMT', 'KO', 'NKE', 'JNJ', 'PFE', 'XOM', 'V', 'MA',
//     'MCD', 'DIS', 'AMD', 'ZM', 'SNAP', 'PYPL', 'PG', 'HD', 'VZ', 'SHOP','PEP'
//   ];

//   try {
//     const newStocks = [];
//     const updatedStocks = [];
//     const skippedSymbols = [];

//     for (const symbol of stockSymbols) {
//       try {
//         const data = await yahooFinance.quote(symbol);

//         const stockData = {
//           symbol: symbol,
//           name: data.shortName,
//           currentPrice: data.regularMarketPrice,
//         };

//         const existingStock = await Stock.findOne({ symbol });
//         if (existingStock) {
//           existingStock.currentPrice = stockData.currentPrice;
//           await existingStock.save();
//           updatedStocks.push(stockData);
//           console.log(`✅ Updated: ${stockData.name} - $${stockData.currentPrice}`);
//         } else {
//           const newStock = new Stock(stockData);
//           await newStock.save();
//           newStocks.push(stockData);
//           console.log(`🆕 Added: ${stockData.name} - $${stockData.currentPrice}`);
//         }
//       } catch (err) {
//         console.warn(`⚠️ Skipping ${symbol}: ${err.message}`);
//         skippedSymbols.push(symbol);
//       }
//     }

//     res.status(201).json({
//       message: 'Stock processing completed',
//       newStocks,
//       updatedStocks,
//       skippedSymbols,
//     });
//   } catch (error) {
//     console.error('❌ Error adding/updating stocks:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
import yahooFinance from 'yahoo-finance2';
import Stock from '../models/Stock.js';

const stockSymbols = [
  'AAPL', 'GOOGL', 'AMZN', 'TSLA', 'MSFT', 'META', 'NVDA', 'NFLX',
  'ADBE', 'INTC', 'SPOT', 'WMT', 'KO', 'NKE', 'JNJ', 'PFE', 'XOM',
  'V', 'MA', 'MCD', 'DIS', 'AMD', 'ZM', 'SNAP', 'PYPL', 'PG',
  'HD', 'VZ', 'SHOP',
];

export const getAndSaveStockPrices = async () => {
  console.log('Fetching and updating stock prices...');

  const stockPromises = stockSymbols.map(async (symbol) => {
    try {
      const result = await yahooFinance.quote(symbol);

      if (!result || !result.regularMarketPrice) {
        console.warn(`⚠️ Skipping ${symbol}: Incomplete data`);
        return null;
      }

      const stockData = {
        symbol: result.symbol,
        date: new Date(), // current timestamp
        open: result.regularMarketOpen,
        high: result.regularMarketDayHigh,
        low: result.regularMarketDayLow,
        close: result.regularMarketPrice,
        volume: result.regularMarketVolume,
      };

      // Upsert stock data (update if exists, insert if not)
      await Stock.updateOne(
        { symbol: result.symbol },
        { $set: stockData },
        { upsert: true }
      );

      // console.log(`✅ Upserted: ${result.symbol} - $${result.regularMarketPrice}`);
    } catch (err) {
      console.error(`❌ Error updating ${symbol}: ${err.message}`);
    }
  });

  await Promise.all(stockPromises);
  console.log('✔️ Stock data update completed');
};
