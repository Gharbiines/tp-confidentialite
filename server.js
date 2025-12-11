const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config");
const authRoutes = require("./routes/auth.routes");

const app = express();

// JSON middleware
app.use(express.json());

// Routes auth
app.use("/api/auth", authRoutes);

// Connexion MongoDB
mongoose.connect(config.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Démarrage serveur
app.listen(config.PORT, () => console.log(`Server running on port ${config.PORT}`));
