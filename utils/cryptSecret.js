const crypto = require("crypto");

const ALGO = "aes-256-cbc";
const KEY = crypto.randomBytes(32);   // À mettre dans config un jour
const IV = crypto.randomBytes(16);

function encrypt(text) {
  const cipher = crypto.createCipheriv(ALGO, KEY, IV);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted + ":" + IV.toString("hex");
}

function decrypt(data) {
  const parts = data.split(":");
  const encryptedText = parts[0];
  const iv = Buffer.from(parts[1], "hex");

  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encrypt, decrypt };
