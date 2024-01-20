const jwt = require("jsonwebtoken");

function encode(payload, secret, options = {}) {
  const token = jwt.sign(payload, secret, options);

  return token;
}

function decode(token, secret) {
  const decoded = jwt.verify(token, secret);

  return decoded;
}

module.exports = { encode, decode };
