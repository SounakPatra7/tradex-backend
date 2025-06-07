// import mongoose from 'mongoose';

// const stockSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     symbol: { type: String, required: true, unique: true },
//     currentPrice: { type: Number, required: true },
//   },
//   { timestamps: true }
// );

// const Stock = mongoose.model('Stock', stockSchema);
// export default Stock;

import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true },
    date: { type: Date, required: true },
    open: { type: Number },
    high: { type: Number },
    low: { type: Number },
    close: { type: Number },
    volume: { type: Number },
  },
  { timestamps: true }
);

// Index to optimize queries for symbol
stockSchema.index({ symbol: 1 });

const Stock = mongoose.model('Stock', stockSchema);
export default Stock;

