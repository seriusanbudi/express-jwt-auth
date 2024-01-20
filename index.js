require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const { signIn } = require("./services/auth");
const { encode, decode } = require("./utils/jwt");
const { getUserById } = require("./services/users");
const authorization = require("./middleware/authorization");

const port = process.env.PORT || 3000;

const refreshTokens = [];

app.use(bodyParser.json());

// Public routes
app.get("/", (req, res) => {
  res.send({ success: true });
});

app.post("/auth/sign-in", (req, res) => {
  const { email = null, password = null } = req.body;

  if (email === null || password === null) {
    return res.status(422).send({ error: "Email or password is empty" });
  }

  const user = signIn(email, password);

  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const accessToken = encode(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1m",
  });
  const refreshToken = encode(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  refreshTokens.push(refreshToken);

  return res.send({
    success: true,
    access_token: accessToken,
    refresh_token: refreshToken,
  });
});

app.post("/auth/refresh-token", (req, res) => {
  const { refresh_token: refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).send({ error: "Token not valid" });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).send({ error: "Token not valid" });
  }

  let decoded;
  try {
    decoded = decode(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return res.status(403).send({ error: "Token not valid" });
  }

  const payload = {
    id: decoded.id,
    username: decoded.username,
    email: decoded.email,
  };

  const accessToken = encode(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1m",
  });

  return res.send({
    success: true,
    access_token: accessToken,
  });
});

// Private routes
app.get("/me", authorization, (req, res) => {
  const userId = req.user.id;
  const user = getUserById(userId);

  res.send({
    id: user.id,
    username: user.username,
    email: user.email,
  });
});

app.post("/auth/sign-out", authorization, (req, res) => {
  const { refresh_token: refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).send({ error: "Token not valid" });
  }

  const index = refreshTokens.indexOf(refreshToken);
  if (index !== -1) {
    refreshTokens.splice(index, 1);
  }

  return res.send({ success: true });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
