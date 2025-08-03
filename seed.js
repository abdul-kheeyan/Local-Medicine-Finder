require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Medicine = require('./models/medicine');
const Shopkeeper = require('./models/shopkeeper');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/medicineFinder';

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");
    return seedData();
  })
  .catch(err => console.log("❌ Mongo Error", err));

async function seedData() {
  try {
    await Medicine.deleteMany({});
    await Shopkeeper.deleteMany({});

    // 🔐 Hash passwords before inserting
    const hashedPassword1 = await bcrypt.hash("1234", 10);
    const hashedPassword2 = await bcrypt.hash("1234", 10);

    const shopkeepers = await Shopkeeper.insertMany([
      {
        name: "HealthPlus Pharmacy",
        email: "health@plus.com",
        password: hashedPassword1,
        address: "123 MG Road, Delhi",
        location: {
          type: "Point",
          coordinates: [77.2195, 28.6139]
        }
      },
      {
        name: "CityMed Store",
        email: "city@med.com",
        password: hashedPassword2,
        address: "456 JP Nagar, Bangalore",
        location: {
          type: "Point",
          coordinates: [77.5946, 12.9716]
        }
      }
    ]);

    const medicines = [
      {
        name: "Paracetamol",
        quantity: 20,
        shop: shopkeepers[0]._id
      },
      {
        name: "Dolo 650",
        quantity: 15,
        shop: shopkeepers[0]._id
      },
      {
        name: "Cough Syrup",
        quantity: 10,
        shop: shopkeepers[1]._id
      },
      {
        name: "Azithromycin",
        quantity: 5,
        shop: shopkeepers[1]._id
      }
    ];

    await Medicine.insertMany(medicines);

    console.log("✅ Sample shopkeepers & medicines added");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}
