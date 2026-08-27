import React from 'react';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';

// Blue circular icon for verified hospitals matching reference design
const hospitalIcon = L.divIcon({
  html: `
    <div style="
      width: 30px;
      height: 30px;
      background: #3B82F6;
      border: 2.5px solid #FFFFFF;
      border-radius: 50%;
      box-shadow: 0 3px 10px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" ry="3" fill="#3B82F6" stroke="white" stroke-width="2" />
        <path d="M12 7v10M7 12h10" stroke="white" stroke-width="2.5" stroke-linecap="round" />
      </svg>
    </div>
  `,
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
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
