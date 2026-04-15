import http, { Server } from "http";
import dotenv from "dotenv";
import { ExpressApplication } from "./app";
import { config } from "../shared/config/env";

dotenv.config();

const PORT = config.PORT || 3000;

// Create HTTP server with Express app
const server: Server = http.createServer(ExpressApplication);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Shutdown function
function shutdown(server: Server) {
  server.close(() => {
    console.log("Server closed. Exiting process...");
    process.exit(0);
  });
}

// Handle termination signals
process.on("SIGINT", () => shutdown(server));
process.on("SIGTERM", () => shutdown(server));
