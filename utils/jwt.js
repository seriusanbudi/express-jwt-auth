const jwt = require("jsonwebtoken");

function encode(payload, secret) {
  const token = jwt.sign(payload, secret);

  return token;
}

function decode(token, secret) {
  const decoded = jwt.verify(token, secret);

  return decoded;
}

module.exports = { encode, decode };
