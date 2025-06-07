// import axios from 'axios';
// import Stock from '../models/Stock.js';

// // Define the URL and API Key
// const ALPHA_VANTAGE_API_KEY = 'your-alpha-vantage-api-key';  // Replace with your actual API key
// const ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query';  // This is the correct URL

// // This function fetches real-time stock data
// export const getAllStocks = async (req, res) => {
//   try {
//     // Example stock symbols; you can modify this list or get it from your database
//     const stockSymbols = ['AAPL', 'GOOGL', 'AMZN'];

//     // Array of promises to fetch stock data for each symbol
//     const stockPromises = stockSymbols.map(async (symbol) => {
//       const response = await axios.get(ALPHA_VANTAGE_URL, {
//         params: {
//           function: 'TIME_SERIES_INTRADAY', // Type of data we're requesting
//           symbol: symbol,
//           interval: '5min',  // Set your preferred interval
//           apikey: ALPHA_VANTAGE_API_KEY,
//         },
//       });

//       // Parse the response
//       const stockData = response.data['Time Series (5min)']; // Adjust based on your interval
//       const latestPrice = stockData ? stockData[Object.keys(stockData)[0]]['1. open'] : null;

//       // Check if the stock already exists in your database, else create it
//       let stock = await Stock.findOne({ symbol });
//       if (!stock) {
//         stock = new Stock({
//           name: symbol, // Can be fetched from the API or set manually
//           symbol,
//           currentPrice: latestPrice,
//         });
//         await stock.save();
//       } else {
//         stock.currentPrice = latestPrice;
//         await stock.save();
//       }

//       return {
//         symbol,
//         latestPrice,
//       };
//     });

//     // Wait for all the stock data to be fetched
//     const stocks = await Promise.all(stockPromises);
//     res.json(stocks);
//   } catch (error) {
//     console.error('Error fetching stock data:', error);
//     res.status(500).json({ message: 'Failed to fetch stock data', error: error.message });
//   }
// };



import Stock from '../models/Stock.js';
import { getAndSaveStockPrices } from '../utils/stockService.js';

export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stocks', error: error.message });
  }
};

export const updateStockPrices = async (req, res) => {
  try {
    const { symbols } = req.body;
    await getAndSaveStockPrices(symbols); // Calls the service function to fetch and save stock prices
    res.json({ message: 'Stock prices updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock prices', error: error.message });
  }
};

export const addStock = async (req, res) => {
  try {
    const { name, symbol, currentPrice } = req.body;
    const stock = new Stock({ name, symbol, currentPrice });
    await stock.save();
    res.status(201).json(stock);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add stock', error: error.message });
  }
};


export const getStockSymbols = async (req, res) => {
  try {
    const stocks = await Stock.find({}, 'symbol name'); // only fetch symbol and name
    res.json({ stocks }); // returns [{ symbol: "AAPL", name: "Apple Inc." }, ...]
  } catch (err) {
    console.error('Error fetching stock symbols and names:', err);
    res.status(500).json({ error: 'Failed to fetch stock symbols and names' });
  }
};


