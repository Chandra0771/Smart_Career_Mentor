// User profile routes (protected).

const express = require("express");
const { getProfile, updateProfile } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// /api/users/me
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);

module.exports = router;

