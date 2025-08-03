const express = require('express');
const router = express.Router();
const Medicine = require('../models/medicine');
const Shopkeeper = require('../models/shopkeeper');

// ==============================
// 🔍 Search Nearby Medicines
// ==============================


// router.get('/search', async (req, res) => {
//   const { medicine, lat, lng } = req.query;

//   try {
//     if (!medicine || !lat || !lng) {
//       return res.send("❌ Please provide medicine name and location.");
//     }

//     // Step 1: Find medicine matching the name (case-insensitive)
//     const results = await Medicine.find({
//       name: { $regex: new RegExp(medicine, 'i') }
//     }).populate('shop'); // get shopkeeper details

//     // Step 2: Filter shops within 5 km
//     const filtered = results.filter(item => {
//       if (!item.shop || !item.shop.location) return false;

//       const [shopLng, shopLat] = item.shop.location.coordinates;
//       const distance = getDistance(
//         parseFloat(lat),
//         parseFloat(lng),
//         shopLat,
//         shopLng
//       );
//       return distance <= 5;
//     });

//     // Step 3: Render results
//     res.render('search', {
//       results: filtered.map(item => ({
//         name: item.shop.name,
//         address: item.shop.address,
//         quantity: item.quantity,
//         location: item.shop.location
//       })),
//       medicine
//     });

//   } catch (err) {
//     console.error("❌ Search Error:", err);
//     res.send("❌ Error occurred during search.");
//   }
// });

// // ==============================
// // 📏 Haversine Formula (distance in km)
// // ==============================
// function getDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371; // Earth's radius in km
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//     Math.sin(dLon / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

// function toRad(deg) {
//   return deg * (Math.PI / 180);
// }

// ✅ Search Route without location
router.get('/search', async (req, res) => {
  const { medicine } = req.query;

  try {
    const results = await Medicine.find({
      name: { $regex: new RegExp(medicine, 'i') }
    }).populate('shop');

    console.log("🟢 Search Results Found:", results.length);
    res.render('search', { results, medicine });
  } catch (err) {
    console.error("❌ Search Error:", err);
    res.send("❌ Error occurred during search");
  }
});

// ✅ Homepage
router.get('/', (req, res) => {
  res.render('index'); // views/index.ejs hona chahiye
});

// ✅ Login Page
router.get('/login', (req, res) => {
  res.render('login'); // views/login.ejs hona chahiye
});

// ✅ Register Page
router.get('/register', (req, res) => {
  res.render('register'); // views/register.ejs hona chahiye
});

// Dashboard
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
