import { useState } from "react";
import { Crosshair, Loader2, MapPin, Search } from "lucide-react";
import Modal from "../common/modal/Modal";
import { useNearbyMRSearch } from "../../hooks/useMRs";
import type { MR, NearbyMRResult } from "../../common/types/types";

type Props = {
  mrs: MR[];
  onClose: () => void;
};

const NearbyMRSearchModal = ({ mrs, onClose }: Props) => {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const search = useNearbyMRSearch();

  const results: NearbyMRResult[] = search.data?.data ?? [];

  const getMRName = (mrId: string) => {
    const mr = mrs.find((m) => m._id === mrId);
    return mr ? mr.fullName : mrId;
  };

  const getMRInfo = (mrId: string) => {
    return mrs.find((m) => m._id === mrId) ?? null;
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setGeoError(null);
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setGeoLoading(false);
      },
      () => {
        setGeoError("Unable to retrieve your location.");
        setGeoLoading(false);
      }
    );
  };

  const handleSearch = () => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (isNaN(latNum) || isNaN(lngNum)) return;
    search.mutate({ lat: latNum, lng: lngNum });
  };

  const isValid = lat.trim() !== "" && lng.trim() !== "" && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng));

  return (
    <Modal onClose={onClose} width="480px">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Nearby MR Search</h2>
          <p className="text-sm text-gray-400 mt-0.5">Find online MRs within 5 km of a location</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-300 transition-colors text-xl leading-none"
        >
          &times;
        </button>
      </div>

      {/* Coordinate Inputs */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="e.g. 28.6139"
              className="w-full bg-[#020617] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="e.g. 77.2090"
              className="w-full bg-[#020617] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {geoError && (
          <p className="text-xs text-red-400">{geoError}</p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={geoLoading}
            className="flex items-center gap-2 px-3 py-2 text-xs bg-[#020617] border border-gray-700 rounded-lg text-gray-300 hover:border-indigo-500 hover:text-indigo-400 transition-colors disabled:opacity-50"
          >
            {geoLoading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Crosshair size={13} />
            )}
            Use My Location
          </button>

          <button
            type="button"
            onClick={handleSearch}
            disabled={!isValid || search.isPending}
            className="flex items-center gap-2 px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors disabled:opacity-50 ml-auto"
          >
            {search.isPending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Search size={13} />
            )}
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      {search.isSuccess && (
        <div className="mt-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
            {results.length > 0
              ? `${results.length} MR${results.length === 1 ? "" : "s"} found within 5 km`
              : "No online MRs found within 5 km"}
          </p>

          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((item, idx) => {
                const mr = getMRInfo(item.mrId);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-[#020617] border border-gray-800 rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <MapPin size={15} className="text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {getMRName(item.mrId)}
                        </p>
                        {mr && (
                          <p className="text-xs text-gray-500">{mr.mobile}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-green-400">
                        {parseFloat(item.distance).toFixed(2)} km
                      </span>
                      {mr && (
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${mr.isOnline ? "bg-green-400" : "bg-gray-500"}`}
                          />
                          <span className="text-xs text-gray-500">
                            {mr.isOnline ? "Online" : "Offline"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {search.isError && (
        <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <p className="text-sm text-red-400">Failed to fetch nearby MRs. Please try again.</p>
        </div>
      )}
    </Modal>
  );
};

export default NearbyMRSearchModal;
