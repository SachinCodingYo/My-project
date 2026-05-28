/**
 * MR Location Service
 * Description: Finds nearby MRs using Redis GEOSEARCH within a 5km radius
 * Author: Aman Kumar Singh
 */
import { redis } from "../../config/redis";

export const getNearbyMRs = async (lat: number, lng: number) => {
  const result = await redis.sendCommand([
    "GEOSEARCH",
    "mr_live_locations",
    "FROMLONLAT",
    String(lng),
    String(lat),
    "BYRADIUS",
    "5",
    "km",
    "WITHDIST"
  ]);

  return result;
};