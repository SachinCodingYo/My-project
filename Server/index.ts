/**
 * Main Server Entry File
 * Author: Aman Kumar Singh & Uday Pratap Chauhan
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import connectDB from "./src/config/db";
import routes from "./routes";
// import { connectProducer } from "./src/config/kafka";
import { connectRedis } from "./src/config/redis";
import { applyHelmet } from "./src/config/security";
import { applyLogger } from "./src/config/logger";
import { applyRateLimiter } from "./src/config/rateLimit";
import { initSocket } from "./src/socket/socket";
import { warmupZetexaAuth } from "./src/modules/internationalEsim/zetexa/zetexa.auth";
import { registerEsimSyncJobs } from "./src/modules/internationalEsim/jobs/syncPackages.job";

dotenv.config();

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

const app = express();
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
applyHelmet(app);
applyLogger(app);
applyRateLimiter(app);

app.use("/api/v1", routes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectRedis();
    await connectDB();
    console.log("MongoDB Connected");

    // await connectProducer();
    // console.log("Kafka Connected");

    const server = http.createServer(app);

    initSocket(server);

    // app.listen(PORT, () => {  // only api request handle

    // server i used because i apply websocket that's why i applied
    // aap.listen used only for api calling and i applied server.listen it's work for api+websocket that's why i used this server.listen

    server.listen(PORT, async () => {
      await warmupZetexaAuth();
      registerEsimSyncJobs();
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
