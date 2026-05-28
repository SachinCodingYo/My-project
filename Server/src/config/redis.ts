/**
 * Module: Redis Client Configuration
 * Description: Initializes Redis client with connection, retry strategy, and event handling
 * Author: Aman Kumar Singh
 */
import { createClient } from "redis";

export const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",

  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.error("Redis retry attempts exhausted");
        return new Error("Retry attempts exhausted");
      }
      return Math.min(retries * 100, 3000);
    },
    connectTimeout: 10000,
  },
});

redis.on("connect", () => {
  console.log("Redis Connected");
});

// redis.on("ready", () => {
//   console.log("Redis Ready to use");
// });

redis.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

redis.on("reconnecting", () => {
  console.log("Redis Reconnecting...");
});

redis.on("end", () => {
  console.log("Redis Connection Closed");
});

// Connect function
export const connectRedis = async () => {
  try {
    if (!redis.isOpen) {
      await redis.connect();
    }
  } catch (error) {
    console.error("Redis Connection Failed:", error);
  }
};

export const closeRedis = async () => {
  try {
    if (redis.isOpen) {
      await redis.quit();
      console.log("Redis Disconnected gracefully");
    }
  } catch (error) {
    console.error("Error closing Redis:", error);
  }
};