/**
 * MR Location Service (Full & Optimized for Mapbox)
 * Author: Aman Kumar Singh
 */
import mongoose from "mongoose";
import MrGPS from "./mr.location.model";
import Order from "../orders/order.model";
import { redis } from "../../config/redis";
import { getIO } from "../../socket/socket";

const MR_LOCATION_KEY = (id: string) => `mr_location:${id}`;
const MR_STATUS_KEY = (id: string) => `mr_status:${id}`;

const getDistanceInKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const toRad = (val: number) => (val * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

//  UPDATE LOCATION SERVICE
export const updateMRLocationService = async (
  userId: mongoose.Types.ObjectId,
  lat: number,
  lng: number,
  speed?: number,
  accuracy?: number,
  batteryLevel?: number,
  isMockLocation?: boolean
) => {
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) throw new Error("Invalid coordinates");
  if (isMockLocation) throw new Error("Fake location detected");

  const rateKey = `rate:${userId}`;
  const count = await redis.incr(rateKey);
  if (count === 1) await redis.expire(rateKey, 1);
  if (count > 5) return null;

  const prevData = await redis.get(MR_LOCATION_KEY(userId.toString()));
  const prev = prevData ? JSON.parse(prevData) : null;
  
  let distance = 0;
  if (prev) {
    distance = getDistanceInKm(prev.lat, prev.lng, lat, lng);
    if (distance < 0.005) return prev; 
  }

  const liveLocation = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [lng, lat], 
    },
    properties: {
      userId: userId.toString(),
      lat,
      lng,
      speed: speed || 0,
      isMoving: speed ? speed > 2 : false,
      batteryLevel,
      timestamp: Date.now(),
    }
  };

  await redis.set(MR_LOCATION_KEY(userId.toString()), JSON.stringify(liveLocation.properties), { EX: 300 });
  await redis.set(MR_STATUS_KEY(userId.toString()), "online", { EX: 120 });

  await redis.geoAdd("mr_live_locations", {
    longitude: lng,
    latitude: lat,
    member: userId.toString(),
  });

  await redis.rPush(`mr_path:${userId}`, JSON.stringify({ lng, lat, time: Date.now() }));
  await redis.lTrim(`mr_path:${userId}`, -100, -1);
  await redis.expire(`mr_path:${userId}`, 3600);

  if (!prev || distance > 0.05) { 
    await MrGPS.updateMany({ userId, isLatest: true }, { $set: { isLatest: false } });
    await MrGPS.create({
      userId,
      location: { type: "Point", coordinates: [lng, lat] },
      speed, accuracy, batteryLevel, isMockLocation,
      isMoving: speed ? speed > 2 : false,
      timestamp: new Date(),
      isLatest: true,
    });
  }

  try {
    const io = getIO();
    io.to(`mr_${userId}`).emit("mr_location_update", liveLocation);
  } catch (err) {}

  return liveLocation;
};

// GET LATEST LOCATION
export const getLatestMRLocationService = async (mrId: string) => {
  const data = await redis.get(MR_LOCATION_KEY(mrId));
  return data ? JSON.parse(data) : null;
};

//  GET NEARBY MRS
export const getNearbyMRs = async (lat: number, lng: number) => {
  const result = await redis.sendCommand([
    "GEORADIUS",
    "mr_live_locations",
    String(lng),
    String(lat),
    "5",
    "km",
    "WITHDIST",
    "COUNT",
    "20"
  ]) as any[];

  return result.map((item: any) => ({
    mrId: item[0],
    distance: item[1],
  }));
};

//  GET PATH (LineString for Mapbox)
export const getMRPathService = async (mrId: string) => {
  const pathData = await redis.lRange(`mr_path:${mrId}`, 0, -1);
  if (!pathData.length) return { type: "Feature", geometry: { type: "LineString", coordinates: [] } };

  const coordinates = pathData.map((p) => {
    const point = JSON.parse(p);
    return [point.lng, point.lat];
  });

  return {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: coordinates,
    },
    properties: { mrId }
  };
};

//  USER ORDER TRACKING SERVICE
export const getUserOrderMRLocationService = async (orderId: string, userId: string) => {
  const order = await Order.findOne({
    _id: new mongoose.Types.ObjectId(orderId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!order) throw new Error("Order not found");

  const mrId = order.assignedTo;
  if (!mrId) throw new Error("No MR assigned to this order");

  const data = await redis.get(MR_LOCATION_KEY(mrId.toString()));
  if (!data) throw new Error("MR is currently offline or location not available");

  return {
    orderId: order._id,
    mrId,
    location: JSON.parse(data),
  };
};