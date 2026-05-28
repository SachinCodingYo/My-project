/**
 * GPS Location Event Controller
 * Author: Aman Kumar Singh
 */
import { Request, Response } from "express";
import { producer } from "../../config/kafka";
import { IAuthenticatedReq } from "../../common/types/express";

// const gpsLocationEvent = async (req : IAuthenticatedReq , res : Response) => {
//   try {
//     const {userId , role} = req?.user || {};
//     if(!userId) throw new Error("Unauthorized")
//      const {points } = req.body;
//     await producer.send({
//       topic: "gps-location-events",
//       messages: [
//         {
//           key: String(userId),
//           value: JSON.stringify({ userId, points }),
//         },
//       ],
//     });

//     res.json({ success: true });
//   } catch (error) {}
// };

export const gpsLocationEvent = async (req: IAuthenticatedReq, res: Response) => {
  try {
    const { userId, role } = req.user || {};

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { points } = req.body;

    if (!Array.isArray(points) || points.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Points must be a non-empty array",
      });
    }

    // Strong validation
    const isValid = points.every(
      (p: any) =>
        typeof p.lat === "number" &&
        typeof p.lng === "number" &&
        typeof p.timestamp !== "undefined"
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid GPS points format",
      });
    }

    const hasMock = points.some((p: any) => p.isMockLocation === true);

    const payload = {
      userId,
      role,
      points,
      eventType: "GPS_UPDATE",
      timestamp: new Date().toISOString(), // better format
      hasMock,
    };

    // Kafka retry (basic)
    let retries = 3;
    while (retries > 0) {
      try {
        await producer.send({
          topic: "gps-location-events",
          messages: [{ key: String(userId), value: JSON.stringify(payload) }],
        });
        break;
      } catch (err) {
        retries--;
        if (retries === 0) throw err;
      }
    }

    return res.json({ success: true });

  } catch (error: any) {
    console.error("GPS Error:", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


