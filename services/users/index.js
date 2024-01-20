const { users } = require("../../db");

function getUserById(id) {
  const user = users.find((user) => user.id === id);

  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

module.exports = { getUserById };
