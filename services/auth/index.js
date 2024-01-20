const { users } = require("../../db");

function signIn(email, password) {
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(403).send({ error: "No user found" });
  }

  if (user.password !== password) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

module.exports = { signIn };
