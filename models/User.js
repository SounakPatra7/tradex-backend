import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  stock: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    balance: { type: Number, default: 100000 }, // starting balance
    portfolio: [portfolioSchema],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
