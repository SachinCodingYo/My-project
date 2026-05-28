import Earning, { EarningStatus } from "./earning.model";
import Order from "../orders/order.model";
import { EARNING_CONFIG } from "../../config/earning.config";
import { getLatestMRLocationService } from "../mr/mr.location.service";


const calculateDistanceInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};


export const calculateAndSaveMREarning = async (
  orderId: string,
  mrId: string,
) => {
  try {
 
    const existingEarning = await Earning.findOne({
      orderId,
    });

    if (existingEarning) {
      console.log("Earning already exists");
      return;
    }

 
    const order = await Order.findById(orderId).populate(
      "addressId",
    );

    if (!order) {
      throw new Error("Order not found");
    }

   
    const address = order.addressId as any;

    if (!address?.location?.coordinates) {
      throw new Error(
        "Customer address location missing",
      );
    }

  
    const mrLiveLocation =
      await getLatestMRLocationService(mrId);

    if (!mrLiveLocation) {
      throw new Error("MR live location not found");
    }

  
    const customerLongitude =
      address.location.coordinates[0];

    const customerLatitude =
      address.location.coordinates[1];

   
    const mrLatitude = mrLiveLocation.lat;

    const mrLongitude = mrLiveLocation.lng;

    /**
     * Total distance
     */
    const totalDistance = calculateDistanceInKm(
      mrLatitude,
      mrLongitude,
      customerLatitude,
      customerLongitude,
    );

    /**
     * Base earning
     */
    const baseEarning =
      EARNING_CONFIG.BASE_EARNING;

    /**
     * Extra KM calculation
     */
    let extraDistanceKm = 0;

    if (
      totalDistance >
      EARNING_CONFIG.FIXED_DISTANCE_KM
    ) {
      extraDistanceKm =
        totalDistance -
        EARNING_CONFIG.FIXED_DISTANCE_KM;
    }

    /**
     * Distance earning
     */
    const distanceEarning =
      extraDistanceKm *
      EARNING_CONFIG.PER_KM_RATE;

    /**
     * Incentive
     */
    let incentive = 0;

    /**
     * Delivery incentive
     */
    if ((order.deliveryCharge || 0) > 0) {
      incentive +=
        EARNING_CONFIG.DELIVERY_INCENTIVE;
    }

    /**
     * High value bonus
     */
    if (
      order.totalAmount >=
      EARNING_CONFIG.HIGH_VALUE_ORDER_THRESHOLD
    ) {
      incentive +=
        EARNING_CONFIG.HIGH_VALUE_BONUS;
    }

    /**
     * Long distance bonus
     */
    if (
      totalDistance >=
      EARNING_CONFIG.LONG_DISTANCE_THRESHOLD
    ) {
      incentive +=
        EARNING_CONFIG.LONG_DISTANCE_BONUS;
    }

    /**
     * Final total earning
     */
    const totalEarning =
      baseEarning +
      distanceEarning +
      incentive;

    /**
     * Rounded values
     */
    const roundedTotalEarning =
      Math.round(totalEarning);

    /**
     * Save earning
     */
    await Earning.create({
      mrId,

      orderId,

      baseEarning,

      fixedDistanceKm:
        EARNING_CONFIG.FIXED_DISTANCE_KM,

      actualDistanceKm: Number(
        totalDistance.toFixed(2),
      ),

      extraDistanceKm: Number(
        extraDistanceKm.toFixed(2),
      ),

      perKmRate:
        EARNING_CONFIG.PER_KM_RATE,

      distanceEarning: Number(
        distanceEarning.toFixed(2),
      ),

      incentive,

      totalEarning: roundedTotalEarning,

      status: EarningStatus.PENDING,
    });

    console.log(
      `Earning tracked successfully | MR: ${mrId} | Order: ${orderId}`,
    );

    console.log({
      totalDistance,

      extraDistanceKm,

      distanceEarning,

      incentive,

      totalEarning:
        roundedTotalEarning,
    });

  } catch (error: any) {
    console.error(
      "Error calculating MR earning:",
      error.message,
    );
  }
};

/**
 * MR Dashboard Summary
 */
export const getMRDashboardSummary = async (
  mrId: string,
) => {
  const earnings = await Earning.find({
    mrId,
  });

  let totalEarned = 0;

  let pendingPayout = 0;

  let paidAmount = 0;

  let totalDistanceTravelled = 0;

  earnings.forEach((earn: any) => {
    totalEarned += earn.totalEarning;

    totalDistanceTravelled +=
      earn.actualDistanceKm || 0;

    /**
     * Pending or Approved
     */
    if (
      earn.status ===
        EarningStatus.PENDING ||
      earn.status ===
        EarningStatus.APPROVED
    ) {
      pendingPayout +=
        earn.totalEarning;
    }

    /**
     * Paid amount
     */
    else if (
      earn.status ===
      EarningStatus.PAID
    ) {
      paidAmount +=
        earn.totalEarning;
    }
  });

  return {
    totalEarned,

    pendingPayout,

    paidAmount,

    totalDeliveries:
      earnings.length,

    totalDistanceTravelled: Number(
      totalDistanceTravelled.toFixed(2),
    ),
  };
};