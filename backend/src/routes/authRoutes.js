const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
  refreshToken,
} = require("../controllers/authController");

const validateToken = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.get("/me", validateToken, getUser);

module.exports = router;
