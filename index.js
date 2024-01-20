require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { signIn } = require("./services/auth");
const { encode, decode } = require("./utils/jwt");
const { getUserById } = require("./services/users");
const authorization = require("./middleware/authorization");

const port = process.env.PORT || 3000;

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

  const token = encode(payload, process.env.JWT_SECRET);

  return res.send({ success: true, jtw: token });
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
