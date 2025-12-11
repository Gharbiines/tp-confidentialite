const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

// Génère un secret TOTP pour un utilisateur
function generateMfaSecret(username) {
  return speakeasy.generateSecret({ name: `TPConfidentialite (${username})` });
}

// Vérifie un code TOTP avec le secret (secret déjà déchiffré)
function verifyTOTP(token, secret) {
  return speakeasy.totp.verify({
    secret,          // ✅ secret passé depuis le service
    encoding: "base32",
    token,
    window: 1 // tolérance d’un intervalle avant/après
  });
}

// Génère un QR code Data URL pour Google Authenticator
async function generateQRCode(otpauth_url) {
  return qrcode.toDataURL(otpauth_url);
}

module.exports = { generateMfaSecret, verifyTOTP, generateQRCode };
