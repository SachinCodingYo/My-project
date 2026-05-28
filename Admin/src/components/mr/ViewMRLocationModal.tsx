import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { ExternalLink, LocateFixed, RefreshCcw, Wifi, WifiOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MR, MRLocation, MRPathPoint } from "../../common/types/types";
import { useMRLocation, useMRPath } from "../../hooks/useMRs";
import Modal from "../common/modal/Modal";
import { io, type Socket } from "socket.io-client";

// Fix Leaflet default marker icons broken by bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const mrIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(
      `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#6366f1"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="white"/></svg>`
    ),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -20],
});

const getHost = () => {
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1"
    ? "http://localhost:5000"
    : `http://192.168.1.10:5000`;
};

// Auto-pan map to updated MR position
const PanToMarker = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
};

type Props = {
  mr: MR;
  onClose: () => void;
};

const ViewMRLocationModal = ({ mr, onClose }: Props) => {
  const { data, isLoading, isFetching, isError, refetch } = useMRLocation(mr._id, true);
  const { data: pathData } = useMRPath(mr._id, true);

  const [liveLocation, setLiveLocation] = useState<MRLocation | null>(null);
  const [livePath, setLivePath] = useState<MRPathPoint[]>([]);
  const [isLive, setIsLive] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const staticLocation = data?.data as MRLocation | undefined;
  const location = liveLocation ?? staticLocation ?? null;

  // Build initial path from HTTP response, then append live updates
  const pathPoints: MRPathPoint[] = livePath.length > 0 ? livePath : (pathData?.data?.path ?? []);

  useEffect(() => {
    const socket = io(getHost(), { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_mr_room", mr._id);
      setIsLive(true);
    });

    socket.on("disconnect", () => setIsLive(false));

    // Seed initial path from socket handshake
    socket.on("mr_initial_path", ({ path }: { mrId: string; path: MRPathPoint[] }) => {
      if (path?.length) setLivePath(path);
    });

    // Append each live update to the path
    socket.on("mr_location_update", (update: MRLocation) => {
      if (update.userId !== mr._id) return;
      setLiveLocation(update);
      setLivePath((prev) => [
        ...prev.slice(-99),
        { lat: update.lat, lng: update.lng, speed: update.speed, timestamp: update.timestamp },
      ]);
    });

    return () => {
      socket.emit("leave_mr_room", mr._id);
      socket.disconnect();
      socketRef.current = null;
      setIsLive(false);
    };
  }, [mr._id]);

  const mapUrl =
    location?.lat !== undefined && location?.lng !== undefined
      ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
      : "";

  const polylinePoints: [number, number][] = pathPoints.map((p) => [p.lat, p.lng]);

  return (
    <Modal onClose={onClose} width="560px">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">MR Live Location</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-400">{mr.fullName}</p>
            <span
              className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                isLive
                  ? "bg-green-500/15 text-green-400"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              {isLive ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-ping" />
                  <Wifi size={11} /> Live
                </>
              ) : (
                <>
                  <WifiOff size={11} /> Polling
                </>
              )}
            </span>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-2 rounded-lg bg-[#020617] border border-gray-700 hover:border-indigo-500 transition-colors disabled:opacity-50"
          title="Refresh location"
        >
          <RefreshCcw size={16} className={isFetching ? "animate-spin" : ""} />
        </button>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center bg-[#020617] border border-gray-800 rounded-xl text-sm text-gray-400">
          Loading location…
        </div>
      ) : isError && !location ? (
        <div className="bg-[#020617] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <LocateFixed size={18} className="text-red-400" />
            </div>
            <div>
              <p className="font-medium text-white">Location unavailable</p>
              <p className="text-sm text-gray-400">
                No location data found for this MR.
              </p>
            </div>
          </div>
        </div>
      ) : location ? (
        <div className="space-y-4">
          {/* Map */}
          <div className="h-64 rounded-xl overflow-hidden border border-gray-700">
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <PanToMarker lat={location.lat} lng={location.lng} />
              {/* Path history polyline */}
              {polylinePoints.length > 1 && (
                <Polyline
                  positions={polylinePoints}
                  pathOptions={{ color: "#6366f1", weight: 3, opacity: 0.7 }}
                />
              )}
              <Marker position={[location.lat, location.lng]} icon={mrIcon}>
                <Popup>
                  <strong>{mr.fullName}</strong>
                  <br />
                  {location.speed != null ? `${location.speed.toFixed(1)} km/h` : "Speed unknown"}
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#020617] border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Latitude</p>
              <p className="text-base font-medium mt-2">{location.lat.toFixed(6)}</p>
            </div>
            <div className="bg-[#020617] border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Longitude</p>
              <p className="text-base font-medium mt-2">{location.lng.toFixed(6)}</p>
            </div>
          </div>

          <div className="bg-[#020617] border border-gray-800 rounded-xl p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Speed</p>
              <p className="text-sm font-medium mt-1">
                {location.speed != null ? `${location.speed.toFixed(1)} km/h` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Last Updated</p>
              <p className="text-sm font-medium mt-1">
                {location.timestamp
                  ? new Date(location.timestamp).toLocaleTimeString()
                  : "—"}
              </p>
            </div>
          </div>

          {pathPoints.length > 0 && (
            <div className="bg-[#020617] border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                Path Points Recorded
              </p>
              <p className="text-sm font-medium">{pathPoints.length} points</p>
            </div>
          )}

          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors"
          >
            <ExternalLink size={16} />
            Open In Google Maps
          </a>
        </div>
      ) : null}

      <div className="flex justify-end mt-6">
        <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded-lg text-sm">
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ViewMRLocationModal;
