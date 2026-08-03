const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io = null;

/**
 * Initializes Socket.IO on top of the existing HTTP server.
 * Call this once, in server.js, right after creating the http server.
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  // Authenticate the socket connection using the same access token the
  // client already sends on regular API requests — reuses your existing
  // JWT setup rather than inventing a separate auth mechanism.
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Not authorized"));
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    // Every user gets their own private room, named by their own id.
    // This is what lets us target notifications at exactly one person
    // via io.to(userId).emit(...), instead of broadcasting to everyone.
    socket.join(socket.userId.toString());

    socket.on("disconnect", () => {
      // No cleanup needed — Socket.IO removes the socket from all rooms
      // automatically on disconnect.
    });
  });

  return io;
};

/**
 * Emits an event to a specific user's private room. Safe to call even if
 * that user isn't currently connected — Socket.IO just delivers to nobody.
 */
const emitToUser = (userId, event, payload) => {
  if (!io) {
    console.error("Socket.IO not initialized — call initSocket() first");
    return;
  }
  io.to(userId.toString()).emit(event, payload);
};

module.exports = { initSocket, emitToUser };
