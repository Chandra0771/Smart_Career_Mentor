// Small helper to generate a JWT for a given user ID.

const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d" // Token is valid for 7 days
  });
};

module.exports = generateToken;

