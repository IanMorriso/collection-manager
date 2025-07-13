import express from 'express';

import { connectDB } from '../utils/db';

import cors from 'cors';
import dotenv from 'dotenv';
import { cardRouter } from '../routes/card';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

// Routes
app.use('/api/card', cardRouter);

