// Configure environment variables
import "dotenv/config";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

// Set's our port to the PORT environment variable, or 3000 by default if the env is not configured.
const PORT = process.env.PORT ?? 3000;

// Creates the express server
const app = express();

// Configure middleware (logging, CORS support, JSON parsing support, static files support)
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Import and use our application routes.
import apiRoutes from "./routes/api.js";
app.use("/api", apiRoutes);

// Use Google's DNS servers to avoid DNS resolution issues in some environments.
// Uncomment the following lines if you encounter DNS resolution issues when connecting to the database. This is a workaround for environments where the default DNS servers may not resolve the database host correctly.
// import dns from "node:dns/promises";
// dns.setServers(["8.8.8.8", "130.216.1.1"]); // Google's public DNS servers and University's DNS server

// Start the DB running. Then, once it's connected, start the server.
await mongoose.connect(process.env.DB_URL);
app.listen(PORT, () => console.log(`App server listening on port ${PORT}!`));
