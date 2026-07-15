const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
} = require("../controllers/authController");

const validateToken = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", validateToken, getUser);
router.post("/logout", validateToken, logoutUser);

module.exports = router;
