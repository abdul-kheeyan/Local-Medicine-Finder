const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Shopkeeper = require('../models/shopkeeper');
const Medicine = require('../models/medicine');

// =================== REGISTER ===================
router.post('/register', async (req, res) => {
  const { name, email, password, address, lat, lng } = req.body;

  try {
    const newShop = new Shopkeeper({
      name,
      email,
      password, // hashed via pre-save hook
      address,
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)]
      }
    });

    await newShop.save();
    console.log("✅ Shopkeeper registered successfully");
    res.redirect('/admin/login');
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.send("❌ Error while registering.");
  }
});

// =================== LOGIN ===================
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const shop = await Shopkeeper.findOne({ email });
    if (!shop) return res.send("❌ Invalid credentials (email not found)");

    const match = await bcrypt.compare(password, shop.password);
    if (!match) return res.send("❌ Wrong password");

    req.session.shopId = shop._id;
    console.log("✅ Login success:", shop.name);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error("❌ Login error:", err);
    res.send("❌ Error while logging in.");
  }
});

// =================== DASHBOARD ===================
router.get('/dashboard', async (req, res) => {
  if (!req.session.shopId) return res.redirect('/admin/login');

  try {
    const shop = await Shopkeeper.findById(req.session.shopId);
    const medicines = await Medicine.find({ shop: req.session.shopId });
    res.render('dashboard', { shop, medicines });
  } catch (err) {
    console.error("❌ Dashboard error:", err);
    res.send("❌ Failed to load dashboard.");
  }
});

// =================== ADD MEDICINE ===================
router.post('/add-medicine', async (req, res) => {
  if (!req.session.shopId) return res.redirect('/admin/login');
  const { name, quantity } = req.body;

  try {
    const shop = await Shopkeeper.findById(req.session.shopId);
    if (!shop) return res.send("❌ Shop not found");

    const newMedicine = new Medicine({
      name,
      quantity,
      shop: shop._id,
      location: shop.location
    });

    await newMedicine.save();
    console.log("✅ Medicine added");
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error("❌ Error adding medicine:", err);
    res.send("❌ Error while adding medicine.");
  }
});

// =================== DELETE MEDICINE ===================
router.post('/delete-medicine/:id', async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.send("❌ Failed to delete medicine.");
  }
});

// =================== UPDATE MEDICINE ===================
router.post('/update-medicine/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    await Medicine.findByIdAndUpdate(req.params.id, { quantity });
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error("❌ Update error:", err);
    res.send("❌ Failed to update medicine.");
  }
});

// =================== EDIT PROFILE ===================
router.get('/edit-profile', async (req, res) => {
  if (!req.session.shopId) return res.redirect('/admin/login');

  try {
    const shop = await Shopkeeper.findById(req.session.shopId);
    res.render('editProfile', { shop });
  } catch (err) {
    console.error("❌ Error loading profile:", err);
    res.send("Failed to load profile.");
  }
});

router.post('/edit-profile', async (req, res) => {
  if (!req.session.shopId) return res.redirect('/admin/login');

  const { name, email, address } = req.body;

  try {
    await Shopkeeper.findByIdAndUpdate(req.session.shopId, {
      name, email, address
    });

    console.log("✅ Profile updated");
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error("❌ Update error:", err);
    res.send("Error updating profile.");
  }
});

// =================== LOGOUT ===================
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Logout error:", err);
      return res.send("❌ Error during logout.");
    }
    res.redirect('/admin/login');
  });
});

// =================== SEARCH MEDICINE ===================

// ✅ Text-based search without location filter
router.get('/search', async (req, res) => {
  const { medicine } = req.query;

  try {
    const results = await Medicine.find({
      name: { $regex: new RegExp(medicine, 'i') }
    }).populate('shop'); // fetch shopkeeper info

    res.render('search', { results, medicine });
  } catch (err) {
    console.error("❌ Search Error:", err);
    res.send("❌ Error occurred during search");
  }
});

// router.get('/search', async (req, res) => {
//   const { medicine, lat, lng } = req.query;

//   if (!medicine || !lat || !lng) {
//     return res.send("❌ Missing search query or location");
//   }

//   try {
//     const results = await Medicine.aggregate([
//       {
//         $geoNear: {
//           near: {
//             type: "Point",
//             coordinates: [parseFloat(lng), parseFloat(lat)]
//           },
//           distanceField: "dist.calculated",
//           maxDistance: 5000,
//           spherical: true,
//           query: { name: { $regex: new RegExp(medicine, 'i') } }
//         }
//       },
//       {
//         $lookup: {
//           from: "shopkeepers",
//           localField: "shop",
//           foreignField: "_id",
//           as: "shopDetails"
//         }
//       },
//       { $unwind: "$shopDetails" },
//       {
//         $project: {
//           name: "$shopDetails.name",
//           address: "$shopDetails.address",
//           quantity: "$quantity",
//           location: "$shopDetails.location",
//           distance: "$dist.calculated"
//         }
//       }
//     ]);

//     console.log("✅ Search Results Found:", results.length);
//     res.render('search', { results, medicine });

//   } catch (err) {
//     console.error("❌ Search Error:", err);
//     res.send("❌ Error occurred while searching");
//   }
// });


module.exports = router;
