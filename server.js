const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config");
const authRoutes = require("./routes/auth.routes");
const cors = require("cors"); 

const app = express();

// JSON middleware
app.use(express.json());

// CORS middleware
app.use(cors({
  origin: "http://127.0.0.1:5500", // autorise ton frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // si tu utilises cookies ou sessions
}));

// Routes auth
app.use("/api/auth", authRoutes);

// Connexion MongoDB
mongoose.connect(config.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Démarrage serveur
app.listen(config.PORT, () => console.log(`Server running on port ${config.PORT}`));
