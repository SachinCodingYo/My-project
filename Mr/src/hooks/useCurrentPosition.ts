import { useEffect, useState } from "react";

interface PositionState {
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: PositionState = {
  latitude: null,
  longitude: null,
  speed: null,
  accuracy: null,
  loading: true,
  error: null,
};

export const useCurrentPosition = () => {
  const [state, setState] = useState<PositionState>(initialState);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setState({
        latitude: null,
        longitude: null,
        speed: null,
        accuracy: null,
        loading: false,
        error: "Geolocation is not supported in this browser.",
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed ?? null,
          accuracy: position.coords.accuracy ?? null,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState({
          latitude: null,
          longitude: null,
          speed: null,
          accuracy: null,
          loading: false,
          error: error.message || "Unable to fetch location.",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15_000,
        maximumAge: 10_000,
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return { ...state, refreshLocation: getCurrentLocation };
};
