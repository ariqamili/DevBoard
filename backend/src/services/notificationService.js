const Notification = require("../models/Notification");
const { emitToUser } = require("../socket/socket");

/**
 * Creates a Notification document AND emits it in real time to the
 * recipient if they're currently connected. Controllers should call this
 * instead of touching Notification/emitToUser separately, so the two
 * never drift out of sync (e.g. saved but never emitted, or vice versa).
 */
const notifyUser = async ({ recipient, type, message, application }) => {
  const notification = await Notification.create({
    recipient,
    type,
    message,
    application,
  });

  emitToUser(recipient, "notification", {
    _id: notification._id,
    type: notification.type,
    message: notification.message,
    read: notification.read,
    createdAt: notification.createdAt,
  });

  return notification;
};

module.exports = { notifyUser };
