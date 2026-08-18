import React from 'react';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';

// Custom blue SVG icon for hospitals
const hospitalIconSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#2563EB" flood-opacity="0.4"/>
    </filter>
    <path filter="url(#shadow)"
      d="M18 2 C9.163 2 2 9.163 2 18 C2 29 18 42 18 42 C18 42 34 29 34 18 C34 9.163 26.837 2 18 2Z"
      fill="#2563EB"
    />
    <text x="18" y="23" text-anchor="middle" font-size="15" fill="white" font-family="Arial">🏥</text>
  </svg>
`;

const hospitalIcon = L.divIcon({
  html: hospitalIconSvg,
  className: '',
  iconSize: [36, 44],
  iconAnchor: [18, 44],
  popupAnchor: [0, -44],
});

/**
 * HospitalMarker — blue pin for hospitals.
 *
 * @param {{ hospital: object }} props
 */
const HospitalMarker = ({ hospital }) => {
  if (!hospital.latitude || !hospital.longitude) return null;

  return (
    <Marker
      position={[hospital.latitude, hospital.longitude]}
      icon={hospitalIcon}
    >
      <Popup minWidth={210}>
        <div className="p-1 min-w-[190px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-base">
              🏥
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-tight">{hospital.name}</p>
              <p className="text-[11px] text-slate-500">Hospital</p>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            {hospital.address && (
              <div className="flex justify-between gap-2">
                <span className="text-slate-500 shrink-0">Address</span>
                <span className="text-slate-700 text-right">{hospital.address}</span>
              </div>
            )}
            {hospital.phone && (
              <div className="flex justify-between">
                <span className="text-slate-500">Phone</span>
                <a href={`tel:${hospital.phone}`} className="text-blue-600 font-semibold hover:underline">
                  {hospital.phone}
                </a>
              </div>
            )}
            {hospital.rating && (
              <div className="flex justify-between">
                <span className="text-slate-500">Rating</span>
                <span className="font-semibold text-amber-600">⭐ {hospital.rating}</span>
              </div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default HospitalMarker;
