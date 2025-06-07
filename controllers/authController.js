// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// import generateToken from '../utils/generateToken.js';

// export const registerUser = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ message: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Registration failed', error: err.message });
//   }
// };

// export const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ message: 'Invalid credentials' });

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Login failed', error: err.message });
//   }
// };
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import Transaction from '../models/Transaction.js';

// Register new user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);  // Hash password with 10 rounds
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Send response with token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),  // Generate token after successful registration
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);  // Compare password
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Send response with token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),  // Generate token after successful login
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};



export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = await User.findById(req.user._id).select('name email image balance');

    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10) // latest 10 transactions
      .select('stock type quantity price createdAt');

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        balance: user.balance,
        transactions: transactions.map(tx => ({
          stock: tx.stock,
          type: tx.type,
          quantity: tx.quantity,
          price: tx.price,
          date: tx.createdAt,
        })),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// controllers/authController.js

export const updateBalance = async (req, res) => {
  try {
    const { type, amount } = req.body;

    if (!['deposit', 'withdrawal'].includes(type) || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const user = await User.findById(req.user);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (type === 'withdrawal' && user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.balance = type === 'deposit' 
      ? user.balance + amount 
      : user.balance - amount;

    // Optional: log as a transaction
    const transaction = new Transaction({
      user: user._id,
      stock: 'N/A',
      type,
      quantity: 1,
      price: amount,
    });
    await transaction.save();

    await user.save();

    res.status(200).json({ message: `Balance ${type} successful`, balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: 'Balance update failed', error: error.message });
  }
};


// Get all transactions for the logged-in user
export const getAllTransactions = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is stored in the request after authentication

    // Fetch all transactions for the user, sorted by date
    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });

    res.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { name, address, phone } = req.body;

    const user = await User.findById(req.user); // Fixed from req.userId
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.address = address || user.address;
    user.phone = phone || user.phone;

    if (req.file) {
      user.image = req.file.filename;
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};
export const uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user); // Fixed from req.userId
    if (!user) return res.status(404).json({ message: "User not found" });

    user.image = req.file.filename;
    await user.save();

    res.status(200).json({ message: "Image uploaded successfully", image: user.image });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
