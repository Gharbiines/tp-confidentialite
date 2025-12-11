const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

// SIGNUP
const signup = async (req, res) => {
  try {
    const { username, email, password, role, specialite, isChef, service } = req.body;

    // Vérification existance user
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Créer user
    const user = new User({ username, email, password, role });

    // Si medcin, ajouter specialite et éventuellement chef/service
    if (role === "medcin") {
      if (!specialite) return res.status(400).json({ message: "Medecin doit avoir une specialite" });
      user.specialite = specialite;

      if (isChef) {
        if (!service) return res.status(400).json({ message: "Chef de service doit avoir un service" });
        user.isChef = true;
        user.service = service;
      }
    }

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN étape 1
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "user note found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "mots de passe Invalide" });

    // MFA activé ?
    if (user.mfaEnabled) {
      return res.status(200).json({ mfaRequired: true, userId: user._id });
    }

    // JWT normal
    const token = jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GENERER MFA secret
const generateMfa = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const secret = speakeasy.generateSecret({ length: 20 });
    user.mfaSecret = encrypt(secret.base32);
    user.mfaEnabled = true;
    await user.save();

    const qr = await qrcode.toDataURL(secret.otpauth_url);
    res.json({ qr, secret: secret.base32 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN MFA étape 2
const verifyMfa = async (req, res) => {
  try {
    const { userId, token } = req.body;
    const user = await User.findById(userId);
    if (!user || !user.mfaSecret) return res.status(400).json({ message: "Invalid user" });

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: "base32",
      token
    });

    if (!verified) return res.status(400).json({ message: "Invalid MFA token" });

    const jwtToken = jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token: jwtToken, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { signup, login, generateMfa, verifyMfa };
