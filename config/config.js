
module.exports = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tp-confidentialite",
  JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
  HE_KEY_SIZE: 2048, // taille clé Homomorphic Encryption si utilisée
};
