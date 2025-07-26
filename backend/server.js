import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// DB Connection
connectDB();

// Routes
app.use('/api/auth', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello From Node API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});