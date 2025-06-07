import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

// export const buyStock = async (req, res) => {
//   try {
//     // console.log('BUY REQ BODY:', req.body);
//     // console.log('USER ID:', req.user); 
//     let { symbol, quantity, price } = req.body;

//     // Ensure correct types
//     quantity = parseFloat(quantity);
//     price = parseFloat(price);

//     if (!symbol || isNaN(quantity) || isNaN(price) || quantity <= 0 || price <= 0) {
//       return res.status(400).json({ message: 'Invalid trade data' });
//     }

//     const user = await User.findById(req.user);
//     const totalCost = quantity * price;

//     if (user.balance < totalCost) {
//       return res.status(400).json({ message: 'Insufficient balance' });
//     }

//     const existing = user.portfolio.find(item => item.stock === symbol);
//     if (existing) {
//       existing.quantity += quantity;
//     } else {
//       user.portfolio.push({ stock: symbol, quantity });
//     }

//     user.balance -= totalCost;
//     await user.save();

//     const transaction = new Transaction({ user: req.user, stock: symbol, type: 'buy', quantity, price });
//     await transaction.save();

//     res.json({ message: 'Stock purchased successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Buy operation failed', error: error.message });
//   }
// };

export const buyStock = async (req, res) => {
  try {
    let { symbol, quantity, price, amount } = req.body;

    // If it's a deposit, we don't care about symbol, quantity, or price
    if (amount) {
      const user = await User.findById(req.user);
      user.balance += parseFloat(amount);
      await user.save();

      const transaction = new Transaction({
        user: req.user,
        type: 'deposit',
        amount,
        date: new Date(),
      });
      await transaction.save();

      return res.json({ message: 'Deposit successful' });
    }

    // Stock purchase logic here if symbol, quantity, and price exist
    if (!symbol || isNaN(quantity) || isNaN(price) || quantity <= 0 || price <= 0) {
      return res.status(400).json({ message: 'Invalid trade data' });
    }

    const user = await User.findById(req.user);
    const totalCost = quantity * price;

    if (user.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const existing = user.portfolio.find(item => item.stock === symbol);
    if (existing) {
      existing.quantity += quantity;
    } else {
      user.portfolio.push({ stock: symbol, quantity });
    }

    user.balance -= totalCost;
    await user.save();

    const transaction = new Transaction({
      user: req.user,
      stock: symbol,
      type: 'buy',
      quantity,
      price,
    });
    await transaction.save();

    res.json({ message: 'Stock purchased successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Buy operation failed', error: error.message });
  }
};


// export const sellStock = async (req, res) => {
//   try {
//     const { symbol, quantity, price } = req.body;
//     const user = await User.findById(req.user);

//     const owned = user.portfolio.find(item => item.stock === symbol);
//     if (!owned || owned.quantity < quantity) {
//       return res.status(400).json({ message: 'Not enough stock to sell' });
//     }

//     owned.quantity -= quantity;
//     if (owned.quantity === 0) {
//       user.portfolio = user.portfolio.filter(item => item.stock !== symbol);
//     }

//     user.balance += quantity * price;
//     await user.save();

//     const transaction = new Transaction({
//       user: req.user,
//       stock: symbol,
//       type: 'sell',
//       quantity,
//       price
//     });
//     await transaction.save();

//     res.json({ message: 'Stock sold successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Sell operation failed', error: error.message });
//   }
// };


export const getPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    res.json({
      balance: user.balance,
      portfolio: user.portfolio
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch portfolio', error: error.message });
  }
};


export const sellStock = async (req, res) => {
  try {
    let { symbol, quantity, price, amount } = req.body;

    // If it's a withdrawal, we just adjust the balance
    if (amount) {
      const user = await User.findById(req.user);
      if (user.balance < parseFloat(amount)) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      user.balance -= parseFloat(amount);
      await user.save();

      const transaction = new Transaction({
        user: req.user,
        type: 'withdrawal',
        amount,
        date: new Date(),
      });
      await transaction.save();

      return res.json({ message: 'Withdrawal successful' });
    }

    // Stock sell logic (you already have it)
    const user = await User.findById(req.user);
    const owned = user.portfolio.find(item => item.stock === symbol);

    if (!owned || owned.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough stock to sell' });
    }

    owned.quantity -= quantity;
    if (owned.quantity === 0) {
      user.portfolio = user.portfolio.filter(item => item.stock !== symbol);
    }

    user.balance += quantity * price;
    await user.save();

    const transaction = new Transaction({
      user: req.user,
      stock: symbol,
      type: 'sell',
      quantity,
      price,
    });
    await transaction.save();

    res.json({ message: 'Stock sold successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Sell operation failed', error: error.message });
  }
};


export const getStockQuantity = async (req, res) => {
  try {
    const { symbol } = req.params;
    const userId = req.user._id;  // Comes from the `protect` middleware
    console.log('User ID:', userId);
    console.log('Stock Symbol:', symbol);

    // Find all transactions for the user related to the stock symbol
    const transactions = await Transaction.find({ user: userId, stock: symbol.toUpperCase() });
    console.log('Transactions:', transactions);

    // Calculate the total quantity by summing the buy/sell transactions
    let totalQuantity = 0;

    transactions.forEach(transaction => {
      if (transaction.type === 'buy') {
        totalQuantity += transaction.quantity;
      } else if (transaction.type === 'sell') {
        totalQuantity -= transaction.quantity;
      }
    });

    console.log('Total Quantity:', totalQuantity);
    res.status(200).json({ quantity: totalQuantity });
  } catch (err) {
    console.error('Error fetching stock quantity:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
