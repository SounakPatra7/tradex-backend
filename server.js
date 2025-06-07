import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';
import './utils/cornJob.js';


dotenv.config();
connectDB();




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
