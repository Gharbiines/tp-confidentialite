const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {  // rôle pour ABAC
    type: String,
    enum: ["patient", "medecin", "admin", "chef_service"],
    required: true,
  },
  service: { // pour médecin et chef de service
    type: String,
  },
  assignedPatients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // pour médecin liste des patients
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: String, // pour MFA SMS
  mfaEnabled: true,
  mfaSecret: String, // secret TOTP pour MFA
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//  Hash automatique du mot de passe avant sauvegarde
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//  Vérification du mot de passe
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//  Vérifie si l’utilisateur est médecin
userSchema.methods.isMedecin = function () {
  return this.type === "medecin";
};

//  Vérifie si l’utilisateur est patient
userSchema.methods.isPatient = function () {
  return this.type === "patient";
};

//  Vérifie si l’utilisateur est admin
userSchema.methods.isAdmin = function () {
  return this.type === "admin";
};

//  Vérifie si l’utilisateur est chef de service
userSchema.methods.isChefService = function () {
  return this.type === "chef_service";
};

module.exports = mongoose.model("User", userSchema);
