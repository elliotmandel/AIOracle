const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { initializeDatabase } = require('./database/init');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Configure CORS for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL,
        /\.vercel\.app$/,
        /\.railway\.app$/,
        'https://mydailydelphi.com',
        'https://www.mydailydelphi.com'
      ]
    : [
        'http://localhost:3000',
        'http://localhost:3001'
      ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

initializeDatabase();

const oracleRoutes = require('./routes/oracle');
app.use('/api', oracleRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Oracle server is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🔮 AI Oracle server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});