# 💊 Local Medicine Finder

A modern web application that helps users find **nearby medical shops** stocking the medicines they need. Shopkeepers can register and manage their inventory, while users can search for medicine availability based on their **geolocation or keyword**.


---

## 📌 Features

### 👥 For Users
- 🔍 Search for any medicine by name
- 📍 Detect current location or enter manually
- 🗺️ View nearby shops that have the medicine
- 📦 See quantity and address of available shops

### 🧑‍💼 For Shopkeepers
- 📝 Register and login securely
- 📋 Add, update, or delete medicine stock
- 🛠️ Edit shop profile
- 📊 Dashboard with all current stock

---

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| **Node.js** | Backend runtime |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **EJS** | Templating engine |
| **HTML/CSS** | Frontend UI |
| **JavaScript** | Client-side scripting |
| **Express-Session** | Session management |
| **GeoJSON / 2dsphere** | For geo-based search |

---

## 🧩 Folder Structure

📦 Local-Medicine-Finder
├── 📁 models # Mongoose schemas (Shopkeeper, Medicine)
├── 📁 routes # Express route handlers
├── 📁 views # EJS templates (login, register, dashboard, search)
├── 📁 public # Static assets (CSS, JS, images)
├── 📄 app.js # Main server setup
├── 📄 .env # MongoDB URL and secret keys
└── 📄 README.md # Project documentation

---

## 🧪 Setup Instructions

### ⚙️ Prerequisites

- Node.js & npm installed
- MongoDB running locally or cloud (MongoDB Atlas)

### 📥 Installation

```bash
git clone https://github.com/your-username/local-medicine-finder.git
cd local-medicine-finder
npm install

