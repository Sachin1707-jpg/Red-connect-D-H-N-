import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useMap } from 'react-leaflet';
import { Search, X, Loader2, MapPin } from 'lucide-react';
import { searchAddress } from '../../services/nominatimService';

/**
 * MapSearch — address search bar with Nominatim-powered autocomplete.
 *
 * Debounces input at 600 ms to respect Nominatim usage policy (max 1 req/sec).
 * Displays results in a dropdown. On select: flies the map to the location.
 *
 * @param {{ onLocationSelect?: Function }} props
 */
const MapSearch = ({ onLocationSelect }) => {
  const map = useMap();
  const [query, setQuery]         = useState('');
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [isOpen, setIsOpen]       = useState(false);
  const debounceRef               = useRef(null);
  const containerRef              = useRef(null);

  // Debounced search — 600 ms respects Nominatim rate limit
  const handleInput = useCallback((value) => {
    setQuery(value);
    setError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim() || value.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchAddress(value, 5);
        setResults(data);
        setIsOpen(data.length > 0);
      } catch {
        setError('Search failed. Check your connection and try again.');
        setResults([]);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    }, 600);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result) => {
    setQuery(result.displayName.split(',').slice(0, 2).join(', '));
    setIsOpen(false);
    setResults([]);

    // Fly map to selected location
    map.flyTo([result.latitude, result.longitude], 15, { duration: 1.2 });

    if (onLocationSelect) {
      onLocationSelect(result);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', zIndex: 1000, width: '100%' }}>
      {/* Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'white',
        borderRadius: '12px',
        border: '2px solid #e2e8f0',
        padding: '6px 12px',
        gap: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'border-color 0.2s',
      }}>
        {loading
          ? <Loader2 size={16} style={{ color: '#E53935', flexShrink: 0, animation: 'spin 1s linear infinite' }} />
          : <Search size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
        }
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search location... (e.g. AIIMS Delhi)"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '13px',
            color: '#1e293b',
            background: 'transparent',
            minWidth: 0,
          }}
        />
        {query && (
          <button onClick={handleClear} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: '4px',
          padding: '6px 10px',
          background: '#FEF2F2',
          borderRadius: '8px',
          border: '1px solid #FCA5A5',
          fontSize: '11px',
          color: '#DC2626',
        }}>
          {error}
        </div>
      )}

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          maxHeight: '220px',
          overflowY: 'auto',
        }}>
          {results.map((result, idx) => (
            <button
              key={`${result.osmId}-${idx}`}
              onClick={() => handleSelect(result)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px 12px',
                background: 'none',
                border: 'none',
                borderBottom: idx < results.length - 1 ? '1px solid #f1f5f9' : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#FFF5F5'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <MapPin size={14} style={{ color: '#E53935', marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: '#334155', lineHeight: '1.4' }}>
                {result.displayName}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapSearch;
