/**
 * Socket.IO Setup for Real-time MR Tracking
 * Updated for Mapbox Path History and Room Management
 * Author: Aman Kumar Singh
 */
import { Server as SocketIOServer } from "socket.io";
import { redis } from "../config/redis";

let io: SocketIOServer;

export const initSocket = (server: any) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);

    /**
     * MR Tracking Room (Admin/Manager ke liye)
     * Jab koi MR ko live track karega, ye room join karega
     */
    socket.on("join_mr_room", async (mrId: string) => {
      const room = `mr_${mrId}`;
      socket.join(room);
      console.log(`Socket ${socket.id} joined MR room: ${room}`);

      try {
        const pathData = await redis.lRange(`mr_path:${mrId}`, 0, -1);
        
        if (pathData && pathData.length > 0) {
          const path = pathData.map((p) => JSON.parse(p));
          
          socket.emit("mr_initial_path", {
            mrId,
            path: path 
          });
        }
      } catch (error) {
        console.error("Error fetching initial path from Redis:", error);
      }
    });
    socket.on("join_order_room", (orderId: string) => {
      const room = `order_${orderId}`;
      socket.join(room);
      console.log(`Socket ${socket.id} joined order room: ${room}`);
    });

    socket.on("leave_mr_room", (mrId: string) => {
      const room = `mr_${mrId}`;
      socket.leave(room);
      console.log(`Socket ${socket.id} left MR room: ${room}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket Disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};