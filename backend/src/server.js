const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
require("dotenv").config();
const { initSocket } = require("./socket/socket");

const PORT = process.env.PORT || 5000;

// Express apps are technically request handlers — wrapping in a plain
// http server lets Socket.IO attach to the SAME server/port instead of
// needing a second one, so the frontend only ever talks to one origin.
const server = http.createServer(app);
initSocket(server);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
