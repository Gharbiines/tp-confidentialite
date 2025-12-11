// server.js
const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const bodyParser = require("body-parser");

// Création de l'application Express
const app = express();

// Middleware pour parser le JSON
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,//Utilise le nouveau moteur de gestion des connexions de MongoDB. 
                           // Rend la connexion plus stable et performante, surtout pour les clusters ou Big Data.
})
.then(() => console.log(" MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Route test
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API TP Confidentialité !");
});

// Lancement du serveur
app.listen(config.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${config.PORT}`);
});
