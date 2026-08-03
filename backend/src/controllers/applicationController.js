const Application = require("../models/Application");
const Job = require("../models/Job");
const CompanyProfile = require("../models/CompanyProfile");
const DeveloperProfile = require("../models/DeveloperProfile");
const { notifyUser } = require("../services/notificationService");

// POST /api/applications/:jobId
// Developer applies to a job.
const createApplication = async (req, res) => {
  try {
    if (req.user.role !== "developer") {
      return res.status(403).json({
        success: false,
        message: "Only developers can apply to jobs",
      });
    }

    const { jobId } = req.params;
    const { coverLetter } = req.body;

    const job = await Job.findById(jobId).populate({
      path: "companyProfile",
      select: "user",
    });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const application = await Application.create({
      user: req.user.id,
      job: jobId,
      coverLetter: coverLetter || "",
    });

    // Notify the company that owns this job, if we can resolve who that is.
    if (job.companyProfile?.user) {
      await notifyUser({
        recipient: job.companyProfile.user,
        type: "NEW_APPLICATION",
        message: `New application received for "${job.title}"`,
        application: application._id,
      });
    }

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    // Duplicate application (unique index on user+job)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied to this job",
      });
    }
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/applications/my
// Developer sees their own applications.
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate({
        path: "job",
        select: "title location companyProfile",
        populate: {
          path: "companyProfile",
          select: "companyName",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/applications/company
// Company sees applications for jobs posted under their CompanyProfile.
const getCompanyApplications = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Only companies can view applicant lists",
      });
    }

    const companyProfile = await CompanyProfile.findOne({
      user: req.user.id,
    });

    if (!companyProfile) {
      // No profile yet means no jobs posted yet — empty list, not an error.
      return res.status(200).json({ success: true, data: [] });
    }

    const companyJobs = await Job.find({
      companyProfile: companyProfile._id,
    }).select("_id");
    const jobIds = companyJobs.map((job) => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("job", "title")
      .populate("user", "email")
      .sort({ createdAt: -1 });

    // Application.user only references User (email), not DeveloperProfile.
    // Batch-fetch the profiles for all applicants in one query instead of
    // one query per application, then attach fullName where available.
    const applicantUserIds = applications.map((app) => app.user?._id);
    const developerProfiles = await DeveloperProfile.find({
      user: { $in: applicantUserIds },
    }).select("user fullName");

    const profileByUserId = new Map(
      developerProfiles.map((profile) => [profile.user.toString(), profile]),
    );

    const enrichedApplications = applications.map((app) => {
      const plain = app.toObject();
      const profile = app.user
        ? profileByUserId.get(app.user._id.toString())
        : null;
      plain.applicantName = profile?.fullName || null;
      return plain;
    });

    res.status(200).json({ success: true, data: enrichedApplications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/applications/:id/status
// Company updates an application's status.
const updateApplicationStatus = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Only companies can update application status",
      });
    }

    const { status } = req.body;
    const allowedStatuses = ["pending", "reviewed", "accepted", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const application = await Application.findById(req.params.id).populate({
      path: "job",
      select: "title companyProfile",
      populate: {
        path: "companyProfile",
        select: "user",
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Make sure this company owns the job being applied to — prevents one
    // company from updating another company's applications.
    if (
      !application.job?.companyProfile?.user ||
      application.job.companyProfile.user.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this application",
      });
    }

    application.status = status;
    await application.save();

    await notifyUser({
      recipient: application.user,
      type: "APPLICATION_STATUS",
      message: `Your application for "${application.job.title}" was ${status}`,
      application: application._id,
    });

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getCompanyApplications,
  updateApplicationStatus,
};
