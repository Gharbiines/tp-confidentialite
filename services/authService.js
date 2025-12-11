const User = require("../models/user.model");
const { generateMfaSecret, generateQRCode, verifyTOTP } = require("../utils/mfa");

// Signup
async function signup({ username, email, password, type, specialite, isChef, service, mfaEnabled }) {
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) throw new Error("Email ou username déjà utilisé");

  const user = new User({ username, email, password, type, specialite, isChef, service, mfaEnabled });

  let qrCodeUrl = null;
  if (mfaEnabled) {
    const secret = generateMfaSecret(username);
    user.mfaSecret = secret.base32;
    qrCodeUrl = await generateQRCode(secret.otpauth_url);
  }

  await user.save();
  return { user, qrCodeUrl };
}

// Login
async function login({ email, password, code }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Utilisateur non trouvé");

  const valid = await user.comparePassword(password);
  if (!valid) throw new Error("Mot de passe incorrect");

  if (user.mfaEnabled) {
    if (!code) throw new Error("Code MFA requis");
    const mfaValid = verifyTOTP(code, user.mfaSecret);
    if (!mfaValid) throw new Error("Code MFA invalide");
  }

  return { user };
}

module.exports = { signup, login };
