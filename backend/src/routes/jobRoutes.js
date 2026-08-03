const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/authMiddleware");
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

router.get("/", getJobs);
router.post("/", validateToken, createJob);
router.route("/:id").get(getJob).put(updateJob).delete(deleteJob);

module.exports = router;
