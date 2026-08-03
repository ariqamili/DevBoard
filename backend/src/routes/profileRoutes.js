const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/authMiddleware");
const {
  getMyProfile,
  createMyProfile,
  updateMyProfile,
} = require("../controllers/profileController");

// POST  /api/profile      -> create my profile (once)
// GET   /api/profile/me   -> retrieve my profile
// PUT   /api/profile/me   -> update my profile
router.post("/", validateToken, createMyProfile);
router.get("/me", validateToken, getMyProfile);
router.put("/me", validateToken, updateMyProfile);

module.exports = router;
