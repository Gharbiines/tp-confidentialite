// const speakeasy = require("speakeasy");
// const qrcode = require("qrcode");

// /**
//  * Génère un secret TOTP pour un utilisateur
//  * @param {string} username
//  * @returns {object} { ascii, hex, base32, otpauth_url }
//  */
// function generateMfaSecret(username) {
//   return speakeasy.generateSecret({
//     name: `TPConfidentialite (${username})`
//   });
// }

// /**
//  * Vérifie un code TOTP avec le secret
//  * @param {string} token
//  * @param {string} secret
//  * @returns {boolean}
//  */
// function verifyTOTP(token, secret) {
//   return speakeasy.totp.verify({
//     secret,
//     encoding: "base32",
//     token,
//     window: 1 // tolérance d’un intervalle avant/après
//   });
// }

// /**
//  * Génère un QR code Data URL pour Google Authenticator
//  * @param {string} otpauth_url
//  * @returns {Promise<string>} QR code Data URL
//  */
// async function generateQRCode(otpauth_url) {
//   return qrcode.toDataURL(otpauth_url);
// }

// module.exports = { generateMfaSecret, verifyTOTP, generateQRCode };

const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

function generateMfaSecret(username) {
  return speakeasy.generateSecret({ name: `TPConfidentialite (${username})` });
}
const decryptedSecret = decrypt(user.mfaSecret);
function verifyTOTP(token, decryptedSecret) {
  return speakeasy.totp.verify({
    decryptedSecret,
    encoding: "base32",
    token,
    window: 1
  });
}

async function generateQRCode(otpauth_url) {
  return qrcode.toDataURL(otpauth_url);
}

module.exports = { generateMfaSecret, verifyTOTP, generateQRCode };
