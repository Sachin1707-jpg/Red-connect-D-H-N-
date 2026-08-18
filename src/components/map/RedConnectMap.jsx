import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useMap } from 'react-leaflet';
import { Navigation, Satellite, Map } from 'lucide-react';
import LocationMarker from './LocationMarker';
import DonorMarker from './DonorMarker';
import HospitalMarker from './HospitalMarker';
import RequestMarker from './RequestMarker';
import MapSearch from './MapSearch';

// Default center: New Delhi, India
const DEFAULT_CENTER = [28.6139, 77.2090];
const DEFAULT_ZOOM   = 12;

// ─── Tile Layer Definitions ───────────────────────────────────────────────────

const TILE_LAYERS = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    maxZoom: 19,
    label: 'Street',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com" target="_blank">Esri</a> &mdash; Source: Esri, Airbus DS, USGS, NGA, NASA, CGIAR, N Robinson, NCEAS, NLS, OS, NMA, Geodatastyrelsen, Rijkswaterstaat, GSA, Geoland, FGDC, NGCC, © OpenStreetMap contributors and the GIS User Community',
    maxZoom: 18,
    label: 'Satellite',
  },
};

// ─── MapFlyTo ─────────────────────────────────────────────────────────────────

/**
 * Internal component that flies the map to userPosition when it changes.
 * Must be inside <MapContainer> to access the map context.
 */
const MapFlyTo = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.latitude, position.longitude], 14, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
};

// ─── LayerSwitcher ────────────────────────────────────────────────────────────

/**
 * Floating pill button in the bottom-right corner to toggle Street ↔ Satellite.
 * Rendered inside <MapContainer> so it has correct z-index layering.
 */
const LayerSwitcher = ({ activeLayer, onChange }) => {
  const isSatellite = activeLayer === 'satellite';

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '28px',
        right: '12px',
        zIndex: 1000,
        display: 'flex',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.22)',
        border: '2px solid rgba(255,255,255,0.25)',
      }}
    >
      {/* Street button */}
      <button
        onClick={() => onChange('street')}
        title="Street view"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '7px 12px',
          fontSize: '11px',
          fontWeight: 700,
          cursor: 'pointer',
          border: 'none',
          transition: 'background 0.2s, color 0.2s',
          background: !isSatellite ? '#E53935' : 'rgba(255,255,255,0.92)',
          color:  !isSatellite ? '#ffffff' : '#374151',
        }}
      >
        <Map size={13} />
        Street
      </button>

      {/* Satellite button */}
      <button
        onClick={() => onChange('satellite')}
        title="Satellite view"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '7px 12px',
          fontSize: '11px',
          fontWeight: 700,
          cursor: 'pointer',
          border: 'none',
          borderLeft: '1px solid rgba(0,0,0,0.08)',
          transition: 'background 0.2s, color 0.2s',
          background: isSatellite ? '#E53935' : 'rgba(255,255,255,0.92)',
          color:  isSatellite ? '#ffffff' : '#374151',
        }}
      >
        <Satellite size={13} />
        Satellite
      </button>
    </div>
  );
};

// ─── SearchControl ────────────────────────────────────────────────────────────

/**
 * Floating search + "My Location" overlay rendered inside <MapContainer>.
 */
const SearchControl = ({ onLocationSelect, onMyLocation }) => (
  <div
    style={{
      position: 'absolute',
      top: '12px',
      left: '12px',
      right: '12px',
      zIndex: 1000,
      display: 'flex',
      gap: '8px',
      alignItems: 'flex-start',
      pointerEvents: 'auto',
    }}
    className="leaflet-top"
  >
    <div style={{ flex: 1 }}>
      <MapSearch onLocationSelect={onLocationSelect} />
    </div>
    <button
      onClick={onMyLocation}
      title="Jump to my location"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '8px 14px',
        background: 'white',
        border: '2px solid #E53935',
        borderRadius: '12px',
        color: '#E53935',
        fontWeight: 700,
        fontSize: '12px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(229,57,53,0.2)',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      <Navigation size={14} />
      My Location
    </button>
  </div>
);

// ─── MapInternals ─────────────────────────────────────────────────────────────

/**
 * Everything that must live inside <MapContainer> (has access to map context).
 */
const MapInternals = ({
  activeLayer,
  onLayerChange,
  donors,
  hospitals,
  requests,
  matchedMap,
  userPosition,
  selectedRequest,
  onRequestClick,
  onMyLocation,
  onLocationSelect,
}) => (
  <>
    {/* Active tile layer */}
    <TileLayer
      key={activeLayer}                           // force re-mount on switch
      url={TILE_LAYERS[activeLayer].url}
      attribution={TILE_LAYERS[activeLayer].attribution}
      maxZoom={TILE_LAYERS[activeLayer].maxZoom}
    />

    {/* Auto-center when user location changes */}
    {userPosition && <MapFlyTo position={userPosition} />}

    {/* Floating controls */}
    <SearchControl onLocationSelect={onLocationSelect} onMyLocation={onMyLocation} />
    <LayerSwitcher activeLayer={activeLayer} onChange={onLayerChange} />

    {/* User GPS position */}
    {userPosition && (
      <LocationMarker
        latitude={userPosition.latitude}
        longitude={userPosition.longitude}
        accuracy={userPosition.accuracy}
      />
    )}

    {/* Hospital markers */}
    {hospitals.map((h) => <HospitalMarker key={h.id} hospital={h} />)}

    {/* Blood request markers */}
    {requests.map((r) => (
      <RequestMarker
        key={r.id}
        request={r}
        isSelected={selectedRequest?.id === r.id}
        onClick={onRequestClick}
      />
    ))}

    {/* Donor markers */}
    {donors.map((d) => {
      const match = matchedMap[d.id];
      return (
        <DonorMarker
          key={d.id}
          donor={d}
          distanceKm={match?.distanceKm}
          durationMinutes={match?.durationMinutes}
        />
      );
    })}
  </>
);

// ─── RedConnectMap (public API) ───────────────────────────────────────────────

/**
 * RedConnectMap — main reusable map component.
 *
 * Props:
 *  - donors          {Array}    Donor objects with latitude/longitude
 *  - hospitals       {Array}    Hospital objects
 *  - requests        {Array}    Blood request objects
 *  - matchedDonors   {Array}    Output of findNearbyDonors()
 *  - userPosition    {object}   { latitude, longitude, accuracy }
 *  - selectedRequest {object}   Currently selected blood request
 *  - onRequestClick  {Function}
 *  - onMyLocation    {Function}
 *  - onLocationSelect {Function}
 *  - className       {string}
 */
const RedConnectMap = ({
  donors = [],
  hospitals = [],
  requests = [],
  matchedDonors = [],
  userPosition = null,
  selectedRequest = null,
  onRequestClick,
  onMyLocation,
  onLocationSelect,
  className = '',
}) => {
  const [activeLayer, setActiveLayer] = useState('street');

  // Build lookup: donor id → matched route info
  const matchedMap = {};
  matchedDonors.forEach((m) => { matchedMap[m.donor.id] = m; });

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700 ${className}`}
    >
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        attributionControl={true}
      >
        <MapInternals
          activeLayer={activeLayer}
          onLayerChange={setActiveLayer}
          donors={donors}
          hospitals={hospitals}
          requests={requests}
          matchedMap={matchedMap}
          userPosition={userPosition}
          selectedRequest={selectedRequest}
          onRequestClick={onRequestClick}
          onMyLocation={onMyLocation}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>
    </div>
  );
};

export default RedConnectMap;
