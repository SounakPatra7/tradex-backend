import Stock from '../models/Stock.js'; // Assuming the Stock model is in the 'models' folder

// Controller to fetch multiple stock prices from the database
// export const getMultipleStocks = async (req, res) => {
//   const { symbols } = req.body;
//   console.log('Received symbols:', symbols);

//   // Ensure the symbols are valid (array and not empty)
//   if (!Array.isArray(symbols) || symbols.length === 0) {
//     return res.status(400).json({ error: 'Please provide an array of stock symbols' });
//   }

//   try {
//     // Query the database for stocks matching the symbols
//     const stocks = await Stock.find({ symbol: { $in: symbols } });

//     // If no stocks found for the given symbols
//     if (stocks.length === 0) {
//       return res.status(404).json({ error: 'No stocks found for the provided symbols' });
//     }

//     // Return the fetched stock data with success flag
//     res.json({
//       success: true,
//       count: stocks.length,
//       data: stocks,
//     });
//   } catch (error) {
//     console.error('Error fetching stock data:', error.message);
//     res.status(500).json({ error: 'Failed to fetch stock data from the database' });
//   }
// };

// // Controller to fetch a single stock price from the database
// export const getSingleStock = async (req, res) => {
//   const { symbol } = req.params;
//   console.log('Received symbol:', symbol);

//   // Validate the symbol
//   if (!symbol) {
//     return res.status(400).json({ error: 'Symbol parameter is required' });
//   }

//   try {
//     // Query the database for the stock by symbol
//     const stock = await Stock.findOne({ symbol });

//     // If no stock found for the provided symbol
//     if (!stock) {
//       return res.status(404).json({ error: `No stock found for symbol: ${symbol}` });
//     }

//     // Return the fetched stock data with success flag
//     res.json({
//       success: true,
//       data: stock,
//     });
//   } catch (error) {
//     console.error('Error fetching stock data:', error.message);
//     res.status(500).json({ error: 'Failed to fetch stock data from the database' });
//   }
// };
// // Controller to fetch all stock prices from the database dynamically
// export const getAllStocks = async (req, res) => {
//   try {
//     // Query the database for all stocks
//     const stocks = await Stock.find({});

//     // If no stocks are found
//     if (stocks.length === 0) {
//       return res.status(404).json({ error: 'No stocks found in the database' });
//     }

//     // Return the fetched stock data
//     res.json(stocks);
//   } catch (error) {
//     console.error('Error fetching stock data:', error.message);
//     res.status(500).json({ error: 'Failed to fetch stock data from database' });
//   }
// };

// // Controller to fetch all stock symbols
// export const getAllStockSymbols = async (req, res) => {
//   try {
//     // Query the database to get all unique stock symbols
//     const stocks = await Stock.distinct('symbol'); // Use distinct to get unique symbols

//     // If no symbols found
//     if (stocks.length === 0) {
//       return res.status(404).json({ error: 'No stocks found in the database' });
//     }

//     // Return the fetched symbols
//     res.json({
//       success: true,
//       data: stocks,
//     });
//   } catch (error) {
//     console.error('Error fetching stock symbols:', error.message);
//     res.status(500).json({ error: 'Failed to fetch stock symbols from the database' });
//   }
// };



// Controller to fetch multiple stocks (with autofill from database if no symbols provided)
export const getMultipleStocks = async (req, res) => {
  let { symbols } = req.body;

  if (!symbols || symbols.length === 0) {
    try {
      const stockSymbols = await Stock.distinct('symbol');
      if (stockSymbols.length === 0) {
        return res.status(404).json({ error: 'No stock symbols found in the database' });
      }
      symbols = stockSymbols; 
    } catch (error) {
      console.error('Error fetching stock symbols:', error.message);
      return res.status(500).json({ error: 'Failed to fetch stock symbols from the database' });
    }
  }

  if (!Array.isArray(symbols) || symbols.length === 0) {
    return res.status(400).json({ error: 'Please provide an array of stock symbols' });
  }

  try {

    const stocks = await Stock.find({ symbol: { $in: symbols } });
    if (stocks.length === 0) {
      return res.status(404).json({ error: 'No stocks found for the provided symbols' });
    }
    res.json({
      success: true,
      count: stocks.length,
      data: stocks,
    });
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    res.status(500).json({ error: 'Failed to fetch stock data from the database' });
  }
};

// Controller to fetch a single stock price from the database
export const getSingleStock = async (req, res) => {
  const { symbol } = req.params;


  if (!symbol) {
    return res.status(400).json({ error: 'Symbol parameter is required' });
  }

  try {
    const stock = await Stock.findOne({ symbol });

    if (!stock) {
      return res.status(404).json({ error: `No stock found for symbol: ${symbol}` });
    }

    res.json({
      success: true,
      data: stock,
    });
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    res.status(500).json({ error: 'Failed to fetch stock data from the database' });
  }
};

// Controller to fetch all stock prices from the database dynamically
export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({});

    if (stocks.length === 0) {
      return res.status(404).json({ error: 'No stocks found in the database' });
    }

    res.json(stocks);
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    res.status(500).json({ error: 'Failed to fetch stock data from database' });
  }
};

