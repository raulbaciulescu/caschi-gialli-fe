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
  }>;
  onLocationSelect?: (lat: number, lng: number) => void;
  showRadius?: boolean;
  radius?: number;
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

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

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

      // Add radius circle for CG markers
      if (marker.type === 'cg' && showRadius) {
        L.circle(marker.position, {
          radius: radius * 1000, // Convert km to meters
          fillColor: '#EAB308',
          fillOpacity: 0.1,
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