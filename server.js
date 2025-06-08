import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';
import './utils/cornJob.js';


dotenv.config();
connectDB();




const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
