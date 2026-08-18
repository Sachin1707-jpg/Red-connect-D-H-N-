import { useState, useCallback } from 'react';

/**
 * useGeolocation — one-shot browser Geolocation hook.
 *
 * Returns: { latitude, longitude, accuracy, loading, error }
 * Call `requestLocation()` to trigger the GPS prompt.
 * Does NOT continuously track the user — single-use by design.
 */
export function useGeolocation() {
  const [state, setState] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: false,
    error: null,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser.',
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      // Success
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null,
        });
      },
      // Error
      (err) => {
        let message;
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = 'Location permission denied. Please allow location access in your browser settings.';
            break;
          case err.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable. Please try again.';
            break;
          case err.TIMEOUT:
            message = 'Location request timed out. Please try again.';
            break;
          default:
            message = 'An unknown error occurred while fetching your location.';
        }
        setState((prev) => ({ ...prev, loading: false, error: message }));
      },
      // Options
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Cache position for 1 min — avoids repeated GPS hits
      }
    );
  }, []);

  return { ...state, requestLocation };
}
