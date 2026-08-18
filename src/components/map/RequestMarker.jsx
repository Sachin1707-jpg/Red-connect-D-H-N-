import React from 'react';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';

// Critical requests get a pulsing red icon, others get an amber icon
const requestIconSvg = (isCritical) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="${isCritical ? 42 : 36}" height="${isCritical ? 52 : 44}" viewBox="0 0 36 44">
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="${isCritical ? 3 : 2}" flood-color="${isCritical ? '#DC2626' : '#D97706'}" flood-opacity="0.5"/>
    </filter>
    <path filter="url(#shadow)"
      d="M18 2 C9.163 2 2 9.163 2 18 C2 29 18 42 18 42 C18 42 34 29 34 18 C34 9.163 26.837 2 18 2Z"
      fill="${isCritical ? '#DC2626' : '#D97706'}"
    />
    <text x="18" y="23" text-anchor="middle" font-size="14" fill="white" font-family="Arial">${isCritical ? '🚨' : '🩸'}</text>
  </svg>
`;

const createRequestIcon = (isCritical) =>
  L.divIcon({
    html: requestIconSvg(isCritical),
    className: isCritical ? 'leaflet-request-critical' : '',
    iconSize: isCritical ? [42, 52] : [36, 44],
    iconAnchor: isCritical ? [21, 52] : [18, 44],
    popupAnchor: [0, isCritical ? -52 : -44],
  });

const urgencyColors = {
  Critical: '#DC2626',
  High:     '#D97706',
  Medium:   '#2563EB',
  Low:      '#059669',
};

/**
 * RequestMarker — red/amber pin for blood requests.
 * Critical requests use a larger icon.
 *
 * @param {{ request: object, isSelected?: boolean, onClick?: Function }} props
 */
const RequestMarker = ({ request, isSelected, onClick }) => {
  if (!request.latitude || !request.longitude) return null;

  const isCritical = request.urgency === 'Critical';
  const icon = createRequestIcon(isCritical);
  const urgencyColor = urgencyColors[request.urgency] || '#6B7280';

  return (
    <Marker
      position={[request.latitude, request.longitude]}
      icon={icon}
      eventHandlers={{ click: onClick ? () => onClick(request) : undefined }}
    >
      <Popup minWidth={220}>
        <div className="p-1 min-w-[200px]">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow"
              style={{ background: urgencyColor }}
            >
              {request.bloodGroup}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-tight">
                {request.hospitalName}
              </p>
              <p className="text-[11px] font-semibold" style={{ color: urgencyColor }}>
                {isCritical && '🚨 '}
                {request.urgency} Priority
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Blood Group</span>
              <span className="font-black text-red-600">{request.bloodGroup}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Units Required</span>
              <span className="font-semibold text-slate-700">{request.unitsRequired} units</span>
            </div>
            {request.unitsPledged !== undefined && (
              <div className="flex justify-between">
                <span className="text-slate-500">Pledged</span>
                <span className="font-semibold text-emerald-600">{request.unitsPledged} units</span>
              </div>
            )}
            {request.description && (
              <p className="text-slate-600 mt-1 pt-1 border-t border-slate-100 leading-relaxed">
                {request.description.slice(0, 100)}
                {request.description.length > 100 ? '…' : ''}
              </p>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default RequestMarker;
