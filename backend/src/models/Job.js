const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    companyProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyProfile",
      required: true,
    },

    location: {
      type: String,
      default: "Remote",
    },

    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      default: "full-time",
    },

    experienceLevel: {
      type: String,
      enum: ["junior", "mid", "senior", "lead"],
      default: "junior",
    },

    requiredSkills: {
      type: [String],
      default: [],
    },

    niceToHaveSkills: {
      type: [String],
      default: [],
    },

    benefits: {
      type: [String],
      default: [],
    },

    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: "EUR",
      },
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Job", jobSchema);
