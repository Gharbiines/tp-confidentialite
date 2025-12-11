const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["medcin", "patient", "admin"] },
  mfaEnabled: { type: Boolean, default: false },
  mfaSecret: { type: String },
  
  // Médecin uniquement (validation dans pre-save)
  specialite: { type: String },
  isChef: { type: Boolean, default: false },
  service: { type: String }
});

// Hash password et validations avant sauvegarde
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  // Validation pour medcin uniquement
  if (this.role === "medcin") {
    if (!this.specialite) {
      throw new Error("Un médecin doit avoir une spécialité.");
    }
    if (this.isChef && !this.service) {
      throw new Error("Un chef de service doit avoir un service attribué.");
    }
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer mot de passe
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
