import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  center: [number, number];
  zoom: number;
  markers?: Array<{
    position: [number, number];
    popup?: string;
    type?: 'client' | 'cg';
    radius?: number; // Individual radius for each marker (for CG service radius)
  }>;
  onLocationSelect?: (lat: number, lng: number) => void;
  showRadius?: boolean;
  radius?: number; // Global radius (for search radius)
  className?: string;
}

const Map: React.FC<MapProps> = ({
                                   center,
                                   zoom,
                                   markers = [],
                                   onLocationSelect,
                                   showRadius = false,
                                   radius = 5,
                                   className = "h-64 w-full"
                                 }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add click handler for location selection
    if (onLocationSelect) {
      map.on('click', (e) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      });
    }

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Clear existing markers and circles
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Add global search radius circle first (if enabled)
    if (showRadius && radius > 0) {
      L.circle(center, {
        radius: radius * 1000, // Convert km to meters
        fillColor: '#3B82F6', // Blue for search radius
        fillOpacity: 0.1,
        color: '#3B82F6',
        weight: 2,
        dashArray: '5, 5' // Dashed line to distinguish from CG radius
      }).addTo(map);
    }

    // Add markers
    markers.forEach((marker) => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="w-6 h-6 rounded-full ${
            marker.type === 'cg' ? 'bg-yellow-500' : 'bg-blue-500'
        } border-2 border-white shadow-lg flex items-center justify-center">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const markerInstance = L.marker(marker.position, { icon }).addTo(map);

      if (marker.popup) {
        markerInstance.bindPopup(marker.popup);
      }

      // CRITICAL FIX: Add individual radius circle for CG markers using their specific radius
      if (marker.type === 'cg' && marker.radius && marker.radius > 0) {
        console.log(`Adding yellow circle for CG at ${marker.position} with radius ${marker.radius}km`);
        L.circle(marker.position, {
          radius: marker.radius * 1000, // Convert km to meters - USE MARKER'S INDIVIDUAL RADIUS
          fillColor: '#EAB308', // Yellow for CG service radius
          fillOpacity: 0.15,
          color: '#EAB308',
          weight: 2
        }).addTo(map);
      }
    });

    // Update map center
    map.setView(center, zoom);
  }, [center, zoom, markers, showRadius, radius]);

  return <div ref={mapRef} className={className} />;
};

export default Map;