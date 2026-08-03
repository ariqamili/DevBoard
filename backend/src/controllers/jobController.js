const Job = require("../models/Job");
const CompanyProfile = require("../models/CompanyProfile");

const COMPANY_PROFILE_POPULATE = {
  path: "companyProfile",
  select: "companyName logoUrl website industry location user",
  populate: {
    path: "user",
    select: "email",
  },
};

// @desc    Get all jobs
// @route   GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate(COMPANY_PROFILE_POPULATE);
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      COMPANY_PROFILE_POPULATE,
    );
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create job
// @route   POST /api/jobs
// Requires validateToken + role "company". The job is linked to the
// authenticated user's CompanyProfile, never taken from the request body.
const createJob = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Only company accounts can post jobs",
      });
    }

    const companyProfile = await CompanyProfile.findOne({
      user: req.user.id,
    });

    if (!companyProfile) {
      return res.status(400).json({
        success: false,
        message: "Please complete your company profile before posting a job.",
      });
    }

    const job = await Job.create({
      ...req.body,
      companyProfile: companyProfile._id,
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// Only the company that owns the linked CompanyProfile may update it.
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "companyProfile",
      "user",
    );
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.companyProfile.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to edit this job",
      });
    }

    // Prevent the client from reassigning ownership via the update body.
    const { companyProfile, ...updates } = req.body;

    Object.assign(job, updates);
    await job.save();

    res.json({ success: true, data: job });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// Only the company that owns the linked CompanyProfile may delete it.
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "companyProfile",
      "user",
    );
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.companyProfile.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this job",
      });
    }

    await job.deleteOne();
    res.json({ success: true, message: "Job deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getJobs, getJob, createJob, updateJob, deleteJob };
