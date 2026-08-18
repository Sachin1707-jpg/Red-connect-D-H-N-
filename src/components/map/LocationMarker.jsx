import React from 'react';
import { CircleMarker, Popup } from 'react-leaflet';

/**
 * LocationMarker — shows the user's current GPS position on the map.
 * Uses a pulsing circle rather than a pin to distinguish it from data markers.
 *
 * @param {{ latitude: number, longitude: number, accuracy: number }} props
 */
const LocationMarker = ({ latitude, longitude, accuracy }) => {
  if (!latitude || !longitude) return null;

  return (
    <>
      {/* Accuracy radius */}
      {accuracy && (
        <CircleMarker
          center={[latitude, longitude]}
          radius={Math.min(accuracy / 5, 80)}
          pathOptions={{
            color: '#3B82F6',
            fillColor: '#3B82F6',
            fillOpacity: 0.08,
            weight: 1,
            dashArray: '4 4',
          }}
        />
      )}
      {/* Position dot */}
      <CircleMarker
        center={[latitude, longitude]}
        radius={10}
        pathOptions={{
          color: '#2563EB',
          fillColor: '#3B82F6',
          fillOpacity: 0.9,
          weight: 3,
        }}
      >
        <Popup>
          <div className="text-center p-1">
            <p className="font-bold text-blue-700 text-sm">📍 Your Location</p>
            {accuracy && (
              <p className="text-xs text-slate-500 mt-1">
                Accuracy: ±{Math.round(accuracy)} m
              </p>
            )}
          </div>
        </Popup>
      </CircleMarker>
    </>
  );
};

export default LocationMarker;
