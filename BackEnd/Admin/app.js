require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const adminRoutes = require('./Router/Admin');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ THIS IS THE ONLY IMAGE CONFIG YOU NEED

app.use('/images', express.static(path.join(__dirname,'../../public/images')));

// Middleware
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001','http://localhost:3002'],
  credentials: true
}));

// JWT
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) {
    try {
      const token = auth.split(" ")[1];
      req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    } catch (err) {}
  }
  next();
});

// Routes
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Backend Running" });
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("✔ MongoDB connected");
  app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
});
