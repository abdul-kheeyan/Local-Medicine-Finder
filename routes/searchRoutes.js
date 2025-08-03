const express = require('express');
const router = express.Router();  // ✅ router define
const Medicine = require('../models/medicine'); // ✅ Import model

// ==========================
// 🔍 Search Route (Geo + Name)
// ==========================
router.get('/search', async (req, res) => {
  const { medicine, lat, lng } = req.query;

  try {
    // ✅ Aggregation Pipeline
    const results = await Medicine.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: "distance",
          maxDistance: 5000, // meters (5km)
          spherical: true,
          query: {
            name: { $regex: new RegExp(medicine, 'i') }
          }
        }
      },
      {
        $lookup: {
          from: "shopkeepers", // ✅ MUST match collection name (lowercase plural of model)
          localField: "shop",
          foreignField: "_id",
          as: "shop"
        }
      },
      { $unwind: "$shop" }
    ]);

    console.log("✅ Search Results:", results.length);
    res.render('search', { results, medicine });
  } catch (err) {
    console.error("❌ Search Error:", err);
    res.send("❌ Error occurred during search");
  }
});

module.exports = router;  // ✅ Don't forget to export
