import React from 'react';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';

// Custom green SVG icon for available donors, grey for unavailable
const donorIconSvg = (available) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="${available ? '#059669' : '#94a3b8'}" flood-opacity="0.4"/>
    </filter>
    <path filter="url(#shadow)"
      d="M18 2 C9.163 2 2 9.163 2 18 C2 29 18 42 18 42 C18 42 34 29 34 18 C34 9.163 26.837 2 18 2Z"
      fill="${available ? '#059669' : '#94a3b8'}"
    />
    <text x="18" y="22" text-anchor="middle" font-size="14" fill="white" font-family="Arial">👤</text>
  </svg>
`;

const createDonorIcon = (available) =>
  L.divIcon({
    html: donorIconSvg(available),
    className: '',
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  });

/**
 * DonorMarker — Map Marker & Popup for Blood Donors.
 * Displays Donor Name, Blood Group, Availability, Distance, and Travel Time.
 *
 * @param {{ donor: object, distanceKm?: number, durationMinutes?: number }} props
 */
const DonorMarker = ({ donor, distanceKm, durationMinutes }) => {
  const lat = Number(donor.latitude ?? donor.lat);
  const lng = Number(donor.longitude ?? donor.lng ?? donor.lon);

  if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

  const isAvailable =
    donor.available === true ||
    donor.isAvailable === true ||
    donor.availabilityStatus === 'Available' ||
    donor.availability === 'Available';

  const name = donor.name || donor.donorName || 'Donor';
  const bloodGroup = donor.bloodGroup || 'O+';
  const icon = createDonorIcon(isAvailable);

  const displayDistance = distanceKm ?? donor.distanceKm;
  const displayDuration = durationMinutes ?? donor.durationMinutes;

  return (
    <Marker position={[lat, lng]} icon={icon}>
      <Popup minWidth={210}>
        <div className="p-1 min-w-[190px]">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black shadow"
              style={{ background: isAvailable ? '#059669' : '#94a3b8' }}
            >
              {bloodGroup}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-tight">{name}</p>
              <p className="text-[11px] text-slate-500 font-medium">Registered Blood Donor</p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Blood Group</span>
              <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">{bloodGroup}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Availability</span>
              <span
                className="font-bold px-1.5 py-0.5 rounded text-[11px]"
                style={{
                  color: isAvailable ? '#059669' : '#ef4444',
                  backgroundColor: isAvailable ? '#ecfdf5' : '#fef2f2',
                }}
              >
                {isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
            {displayDistance != null && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Distance</span>
                <span className="font-bold text-slate-800">{displayDistance} km</span>
              </div>
            )}
            {displayDuration != null && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Estimated Travel Time</span>
                <span className="font-bold text-slate-800">{displayDuration} min</span>
              </div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default DonorMarker;
