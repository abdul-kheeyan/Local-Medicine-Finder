// ============================
// 🌍 Required Modules
// ============================
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// ============================
// 🔐 Load Environment Variables
// ============================
dotenv.config();

// ============================
// 🚀 Initialize Express App
// ============================
const app = express();

// ============================
// 🔧 Middleware
// ============================
app.use(express.urlencoded({ extended: true })); // form data
app.use(express.static(path.join(__dirname, 'public'))); // static files (CSS, JS, etc.)

// ============================
// 🖥️ View Engine Setup
// ============================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================
// 💾 Session Setup
// ============================
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// ============================
// 📦 Routes
// ============================

// Admin Routes (Login, Dashboard, Add Medicines, etc.)
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

// Public Shop Routes (Homepage, Register, Login, Search, etc.)
const shopRoutes = require('./routes/shopRoutes');
app.use('/', shopRoutes);

// Search Logic Route (Optional, if separated)
const searchRoutes = require('./routes/searchRoutes');
app.use('/', searchRoutes);

// (Optional) User Routes (if you have a user system)
// const userRoutes = require('./routes/userRoutes');
// app.use('/', userRoutes);

// ============================
// 🌐 MongoDB Connection + Start Server
// ============================
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("✅ Connected to MongoDB");

    app.listen(3000, () => {
      console.log("🚀 Server running at http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
