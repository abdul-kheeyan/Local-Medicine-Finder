const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const Medicine = require('../models/medicine');
const Shopkeeper = require('../models/shopkeeper');

// ==========================
// 🌐 Homepage
// ==========================
router.get('/', (req, res) => {
  res.render('index'); // views/index.ejs
});

// ==========================
// 🔍 Search Route
// ==========================
router.get('/search', async (req, res) => {
  const { medicine, lat, lng } = req.query;

  try {
    const results = await Medicine.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: "dist.calculated",
          maxDistance: 5000,
          spherical: true,
          query: { name: { $regex: new RegExp(medicine, 'i') } }
        }
      },
      {
        $lookup: {
          from: "shopkeepers",
          localField: "shop",
          foreignField: "_id",
          as: "shopDetails"
        }
      },
      { $unwind: "$shopDetails" },
      {
        $project: {
          name: "$shopDetails.name",
          address: "$shopDetails.address",
          quantity: "$quantity",
          location: "$shopDetails.location"
        }
      }
    ]);

    res.render('search', { results, medicine });
  } catch (err) {
    console.error("❌ Search Error:", err);
    res.send("Error occurred");
  }
});

// ==========================
// 📍 Nearby Shops (for map)
// ==========================
router.get('/nearby-shops', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) return res.json([]);

  try {
    const results = await Medicine.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: "dist.calculated",
          maxDistance: 5000,
          spherical: true
        }
      },
      {
        $lookup: {
          from: "shopkeepers",
          localField: "shop",
          foreignField: "_id",
          as: "shopDetails"
        }
      },
      { $unwind: "$shopDetails" },
      {
        $group: {
          _id: "$shopDetails._id",
          name: { $first: "$shopDetails.name" },
          address: { $first: "$shopDetails.address" },
          location: { $first: "$shopDetails.location" },
          distance: { $first: "$dist.calculated" }
        }
      },
      { $limit: 5 }
    ]);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// ==========================
// 📝 Register Page + Handler
// ==========================
router.get('/register', (req, res) => {
  res.render('register'); // views/register.ejs
});

router.post('/register', async (req, res) => {
  const { name, email, password, address, lat, lng } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newShop = new Shopkeeper({
      name,
      email,
      password: hashedPassword,
      address,
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)]
      }
    });

    await newShop.save();
    console.log("✅ Shopkeeper registered successfully");
    res.redirect('/login');
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.send("❌ Registration failed");
  }
});

// ==========================
// 🔐 Login Page + Handler
// ==========================
router.get('/login', (req, res) => {
  res.render('login'); // views/login.ejs
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const shop = await Shopkeeper.findOne({ email });

    if (!shop) {
      return res.send("❌ Invalid credentials (email not found)");
    }

    const isMatch = await bcrypt.compare(password, shop.password);
    if (!isMatch) {
      return res.send("❌ Invalid credentials (wrong password)");
    }

    req.session.shopId = shop._id;
    console.log("✅ Login success:", shop.name);
    res.redirect('/dashboard');
  } catch (err) {
    console.error("❌ Login error:", err);
    res.send("❌ Error while logging in.");
  }
});

// ==========================
// 📋 Dashboard Route (optional)
// ==========================
router.get('/dashboard', async (req, res) => {
  if (!req.session.shopId) return res.redirect('/login');

  try {
    const medicines = await Medicine.find({ shop: req.session.shopId });
    res.render('dashboard', { medicines });
  } catch (err) {
    console.error("❌ Dashboard error:", err);
    res.send("❌ Failed to load dashboard.");
  }
});


module.exports = router;
