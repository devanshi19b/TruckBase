import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import truckRoutes from './routes/truckRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import biltyRoutes from './routes/biltyRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dashboardAnalyticsRoutes from './routes/dashboardAnalyticsRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB
connectDB();

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/bilties', biltyRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardAnalyticsRoutes)

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
