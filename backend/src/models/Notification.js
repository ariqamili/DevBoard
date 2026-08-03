const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["APPLICATION_STATUS", "NEW_APPLICATION"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    // Optional pointer back to the relevant application, so the frontend
    // can link the notification to something clickable later if desired.
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
