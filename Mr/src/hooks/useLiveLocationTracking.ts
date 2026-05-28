import { useEffect, useRef } from "react";
import { useUpdateLocation } from "./useOrders";

type Coordinates = {
  lat: number;
  lng: number;
};

type Options = {
  enabled: boolean;
  minIntervalMs?: number;
  minDistanceMeters?: number;
};

const toRadians = (value: number) => (value * Math.PI) / 180;

const getDistanceMeters = (from: Coordinates, to: Coordinates) => {
  const earthRadiusMeters = 6371000;
  const latDistance = toRadians(to.lat - from.lat);
  const lngDistance = toRadians(to.lng - from.lng);
  const startLat = toRadians(from.lat);
  const endLat = toRadians(to.lat);

  const haversine =
    Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
    Math.cos(startLat) *
      Math.cos(endLat) *
      Math.sin(lngDistance / 2) *
      Math.sin(lngDistance / 2);

  return (
    earthRadiusMeters *
    2 *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
};

export const useLiveLocationTracking = ({
  enabled,
  minIntervalMs = 25_000,
  minDistanceMeters = 25,
}: Options) => {
  const { mutate } = useUpdateLocation();
  const mutateRef = useRef(mutate);
  const lastSentAtRef = useRef(0);
  const lastSentPositionRef = useRef<Coordinates | null>(null);
  const isSendingRef = useRef(false);

  useEffect(() => {
    mutateRef.current = mutate;
  }, [mutate]);

  useEffect(() => {
    if (!enabled || !navigator.geolocation) return;

    const watcherId = navigator.geolocation.watchPosition(
      (position) => {
        const currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const now = Date.now();
        const lastSentPosition = lastSentPositionRef.current;
        const isIntervalReached = now - lastSentAtRef.current >= minIntervalMs;
        const hasMovedEnough = lastSentPosition
          ? getDistanceMeters(lastSentPosition, currentPosition) >=
            minDistanceMeters
          : true;

        if (isSendingRef.current || (!isIntervalReached && !hasMovedEnough)) {
          return;
        }

        isSendingRef.current = true;

        mutateRef.current(
          {
            ...currentPosition,
            speed: position.coords.speed ?? undefined,
            accuracy: position.coords.accuracy ?? undefined,
          },
          {
            onSettled: () => {
              lastSentAtRef.current = Date.now();
              lastSentPositionRef.current = currentPosition;
              isSendingRef.current = false;
            },
          }
        );
      },
      () => {
        isSendingRef.current = false;
      },
      {
        enableHighAccuracy: true,
        timeout: 15_000,
        maximumAge: 10_000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watcherId);
    };
  }, [enabled, minDistanceMeters, minIntervalMs]);
};
