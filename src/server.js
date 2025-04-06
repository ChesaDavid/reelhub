import express from 'express';
import connectDB from './database.js';
import authRoutes from './src/api/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect to MongoDB
connectDB();

// Auth Routes
app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));