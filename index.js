const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const users = require("./db");
const jwt = require("jsonwebtoken");

const port = 3000;
const secret = "SUPER_SECRET_TEXT";

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send({ success: true });
});

app.post("/auth/sign-in", (req, res) => {
  const { email = null, password = null } = req.body;

  if (email === null || password === null) {
    return res.status(422).send({ error: "Email or password is empty" });
  }

  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(403).send({ error: "No user found" });
  }

  if (user.password !== password) {
    return res
      .status(403)
      .send({ error: "Email and password combination error" });
  }

  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const token = jwt.sign(payload, secret);

  return res.send({ success: true, jtw: token });
});

app.get("/me", (req, res) => {
  const { authorization = null } = req.headers;

  if (!authorization) {
    return res.status(403).send({ error: "No authorization header found" });
  }

  const token = authorization.split(" ")[1] ?? null;

  if (!token) {
    return res.status(403).send({ error: "Token not valid" });
  }

  const decoded = jwt.verify(token, secret);
  const user = users.find((user) => user.id === decoded.id);

  res.send({
    id: user.id,
    username: user.username,
    email: user.email,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
