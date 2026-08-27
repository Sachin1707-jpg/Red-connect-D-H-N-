import React from 'react';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';

// Teal circular icon for available donors matching reference design
const createDonorIcon = (available) =>
  L.divIcon({
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background: ${available ? '#10B981' : '#94A3B8'};
        border: 2.5px solid #FFFFFF;
        border-radius: 50%;
        box-shadow: 0 3px 10px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
        </svg>
      </div>
    `,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
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
