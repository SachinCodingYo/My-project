import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { MapPinned, Navigation, RefreshCcw, Send, Radio } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { PageHeader, Button, EmptyState } from "../components/common";
import { useAssignedOrders, useUpdateLocation } from "../hooks/useOrders";
import { useCurrentPosition } from "../hooks/useCurrentPosition";
import { buildMapsUrl, formatAddress } from "../utils/format";

// Fix Leaflet default marker icons (broken with bundlers)
// delete (L.Icon.Default.prototype as any)._getIconUrl;
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const mrIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const destIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ef4444"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const AUTO_INTERVAL_MS = 30_000;

// Recenter map when MR position changes
const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
};

const MapPage = () => {
  const { data } = useAssignedOrders();
  const { latitude, longitude, speed, accuracy, loading, error, refreshLocation } =
    useCurrentPosition();
  const updateLocation = useUpdateLocation();
  const [isAutoTracking, setIsAutoTracking] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeOrder = useMemo(
    () =>
      (data?.data ?? []).find((order) =>
        ["ASSIGNED", "OUT_FOR_DELIVERY", "APPROVED"].includes(order.status)
      ) ?? data?.data?.[0],
    [data?.data]
  );

  const sendLocation = useCallback(() => {
    if (latitude === null || longitude === null) return;

    updateLocation.mutate({
      lat: latitude,
      lng: longitude,
      speed: speed ?? undefined,
      accuracy: accuracy ?? undefined,
    });
  }, [latitude, longitude, speed, accuracy, updateLocation]);

  useEffect(() => {
  if (isAutoTracking) {
    sendLocation();

    intervalRef.current = setInterval(
      sendLocation,
      AUTO_INTERVAL_MS
    );
  } else {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
}, [isAutoTracking, sendLocation]);

  // Destination coords from order address
  const destCoords = useMemo(() => {
    const loc = activeOrder?.address?.location;
    if (loc?.coordinates?.length === 2) {
      return { lat: loc.coordinates[1], lng: loc.coordinates[0] };
    }
    return null;
  }, [activeOrder]);

  if (!activeOrder) {
    return (
      <EmptyState
        icon={MapPinned}
        title="No active delivery route"
        description="Your map tools will show up here as soon as an order is assigned."
      />
    );
  }

  const hasPosition = latitude !== null && longitude !== null;

  return (
    <div className="space-y-4 animate-fadeIn">
      <PageHeader title="Live Location" subtitle="Track and share your field position." />

      {/* Info card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
        <div className="bg-gradient-to-br from-brand-600 via-brand-500 to-violet-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-white/80">Current position</div>
            {isAutoTracking && (
              <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-green-300" />
                Live
              </span>
            )}
          </div>
          <div className="mt-2 text-2xl font-bold">
            {hasPosition
              ? `${latitude!.toFixed(5)}, ${longitude!.toFixed(5)}`
              : "Waiting for GPS"}
          </div>
          <div className="mt-1 flex gap-4 text-xs text-white/70">
            {speed !== null && <span>Speed: {speed?.toFixed(1) ?? "—"} m/s</span>}
            {accuracy !== null && <span>Accuracy: ±{accuracy?.toFixed(0)} m</span>}
          </div>
          <p className="mt-2 max-w-lg text-sm text-white/85">
            {error ?? (isAutoTracking
              ? `Auto-updating every ${AUTO_INTERVAL_MS / 1000}s`
              : "Enable live tracking or update manually.")}
          </p>
        </div>

        {/* Live map */}
        <div className="h-64 w-full">
          {hasPosition ? (
            <MapContainer
              center={[latitude!, longitude!]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <RecenterMap lat={latitude!} lng={longitude!} />
              <Marker position={[latitude!, longitude!]} icon={mrIcon}>
                <Popup>Your current position</Popup>
              </Marker>
              {destCoords && (
                <Marker position={[destCoords.lat, destCoords.lng]} icon={destIcon}>
                  <Popup>Delivery destination</Popup>
                </Marker>
              )}
            </MapContainer>
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-500">
              {loading ? "Getting GPS position…" : "GPS unavailable"}
            </div>
          )}
        </div>

        <div className="space-y-4 p-5">
          {/* Order destination info */}
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Active order destination
            </div>
            <div className="mt-2 text-sm font-medium text-slate-800">
              {activeOrder.orderNumber}
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {formatAddress(activeOrder.address)}
            </div>
          </div>

          {/* Live tracking toggle */}
          <button
            type="button"
            onClick={() => setIsAutoTracking((v) => !v)}
            className={[
              "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition",
              isAutoTracking
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-slate-200 bg-white text-slate-700",
            ].join(" ")}
          >
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4" />
              Live Auto-Tracking
            </div>
            <div
              className={[
                "relative h-5 w-9 rounded-full transition",
                isAutoTracking ? "bg-green-500" : "bg-slate-300",
              ].join(" ")}
            >
              <div
                className={[
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                  isAutoTracking ? "translate-x-4" : "translate-x-0.5",
                ].join(" ")}
              />
            </div>
          </button>

          <div className="grid gap-3 md:grid-cols-3">
            <Button variant="secondary" onClick={refreshLocation} loading={loading}>
              <RefreshCcw className="h-4 w-4" />
              Refresh GPS
            </Button>

            <Button
              onClick={sendLocation}
              loading={updateLocation.isPending}
              disabled={!hasPosition}
            >
              <Send className="h-4 w-4" />
              Update Once
            </Button>

            <a
              href={buildMapsUrl(activeOrder.address)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
            >
              <Navigation className="h-4 w-4" />
              Navigate
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
