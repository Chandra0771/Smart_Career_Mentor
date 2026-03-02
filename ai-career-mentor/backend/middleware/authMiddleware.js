// Middleware to protect routes using JWT authentication.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Expecting "Authorization: Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, token missing or invalid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach authenticated user to the request (without password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = protect;

