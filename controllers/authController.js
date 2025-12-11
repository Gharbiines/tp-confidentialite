const authService = require("../services/authService");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

// -------------------- SIGNUP --------------------
const signup = async (req, res) => {
  try {
    const { username, email, password, type, specialite, isChef, service, mfaEnabled } = req.body;

    const { user, qrCodeUrl } = await authService.signup({
      username,
      email,
      password,
      type,
      specialite,
      isChef,
      service,
      mfaEnabled
    });

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        type: user.type
      },
      mfaQR: qrCodeUrl || null // QR code pour Google Authenticator
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// -------------------- LOGIN --------------------
const login = async (req, res) => {
  try {
    const { email, password, code } = req.body;

    const { user } = await authService.login({ email, password, code });

    // JWT généré seulement après validation MFA
    const token = jwt.sign(
      { id: user._id, type: user.type },
      config.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login réussi",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        type: user.type
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// -------------------- GENERER MFA (pour un user existant) --------------------
const generateMfa = async (req, res) => {
  try {
    const { userId } = req.params;

    // Appel service qui génère secret, chiffre et retourne QR
    const { qrCodeUrl } = await authService.generateMfa(userId);

    res.status(200).json({
      message: "MFA généré avec succès",
      mfaQR: qrCodeUrl
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// -------------------- VERIFIER MFA (login étape 2) --------------------
const verifyMfa = async (req, res) => {
  try {
    const { userId, token } = req.body;

    // Appel service pour déchiffrer et vérifier le code
    const user = await authService.verifyMfa(userId, token);

    // JWT généré après MFA validé
    const jwtToken = jwt.sign(
      { id: user._id, type: user.type },
      config.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "MFA validé, login réussi",
      token: jwtToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        type: user.type
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { signup, login, generateMfa, verifyMfa };
