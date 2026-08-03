const DeveloperProfile = require("../models/DeveloperProfile");
const CompanyProfile = require("../models/CompanyProfile");

// Picks the right model based on the authenticated user's role.
// req.user is already the sanitized { id, email, role } shape from
// validateToken (via buildUserResponse) — see authMiddleware.js.
const getProfileModel = (role) => {
  if (role === "developer") return DeveloperProfile;
  if (role === "company") return CompanyProfile;
  return null;
};

// Fields each role is allowed to set.
// Prevents a client from injecting `user` or any other unexpected field.
const ALLOWED_FIELDS = {
  developer: [
    "fullName",
    "bio",
    "skills",
    "location",
    "githubUrl",
    "portfolioUrl",
    "experienceLevel",
  ],
  company: [
    "companyName",
    "description",
    "industry",
    "website",
    "location",
    "logoUrl",
  ],
};

const pickAllowedFields = (body, role) => {
  const allowed = ALLOWED_FIELDS[role] || [];
  return allowed.reduce((acc, field) => {
    if (body[field] !== undefined) acc[field] = body[field];
    return acc;
  }, {});
};

// GET /api/profile/me
const getMyProfile = async (req, res) => {
  try {
    const ProfileModel = getProfileModel(req.user.role);
    if (!ProfileModel) {
      return res.status(400).json({
        success: false,
        message: "This role does not have a profile type",
      });
    }

    const profile = await ProfileModel.findOne({ user: req.user.id });

    if (!profile) {
      // Not an error — the user just hasn't created their profile yet.
      return res.status(200).json({ success: true, data: null });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/profile
// Creates the profile exactly once. Rejects if one already exists —
// use PUT /api/profile/me for subsequent edits.
const createMyProfile = async (req, res) => {
  try {
    const ProfileModel = getProfileModel(req.user.role);
    if (!ProfileModel) {
      return res.status(400).json({
        success: false,
        message: "This role does not have a profile type",
      });
    }

    const existingProfile = await ProfileModel.findOne({ user: req.user.id });
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Profile already exists",
      });
    }

    const fields = pickAllowedFields(req.body, req.user.role);

    const profile = await ProfileModel.create({
      ...fields,
      user: req.user.id,
    });

    res.status(201).json({ success: true, data: profile });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/profile/me
// Updates an existing profile. Does NOT create one — that's createMyProfile's job.
const updateMyProfile = async (req, res) => {
  try {
    const ProfileModel = getProfileModel(req.user.role);
    if (!ProfileModel) {
      return res.status(400).json({
        success: false,
        message: "This role does not have a profile type",
      });
    }

    const updates = pickAllowedFields(req.body, req.user.role);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields were provided.",
      });
    }

    const profile = await ProfileModel.findOneAndUpdate(
      { user: req.user.id },
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Create one first.",
      });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyProfile,
  createMyProfile,
  updateMyProfile,
};
