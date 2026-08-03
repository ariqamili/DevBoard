const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/authMiddleware");
const {
  createApplication,
  getMyApplications,
  getCompanyApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

// POST   /api/applications/:jobId       -> developer applies to a job
// GET    /api/applications/my           -> developer's own applications
// GET    /api/applications/company      -> applications for company's jobs
// PATCH  /api/applications/:id/status   -> company updates status
router.post("/:jobId", validateToken, createApplication);
router.get("/my", validateToken, getMyApplications);
router.get("/company", validateToken, getCompanyApplications);
router.patch("/:id/status", validateToken, updateApplicationStatus);

module.exports = router;
