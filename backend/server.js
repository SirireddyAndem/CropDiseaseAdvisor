const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agriassist')
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ API routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/crop', require('./routes/crop.routes'));

// ✅ Serve Angular frontend build for Render
app.use(express.static(path.join(__dirname, '../frontend/dist/frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/frontend/index.html'));
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ msg: 'Internal server error' });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
