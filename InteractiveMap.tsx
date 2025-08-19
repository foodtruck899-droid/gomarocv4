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

const InteractiveMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([44.85, -0.57], 5);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Libourne coordinates
    const libourneCoords: [number, number] = [44.9131, -0.2417];
    // Meknes coordinates  
    const meknesCoords: [number, number] = [33.8935, -5.5473];

    // Create custom icons
    const frenchStationIcon = L.divIcon({
      html: `<div style="background: #3b82f6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🇫🇷</div>`,
      className: 'custom-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const moroccanStationIcon = L.divIcon({
      html: `<div style="background: #dc2626; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🇲🇦</div>`,
      className: 'custom-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // Add markers
    const libourneMarker = L.marker(libourneCoords, { icon: frenchStationIcon })
      .addTo(map.current)
      .bindPopup(`
        <div style="font-family: system-ui; max-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">🇫🇷 Libourne</h3>
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Gare Routière de Libourne</p>
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">📍 Place Joffre, 33500 Libourne</p>
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">📞 +33 5 57 51 15 04</p>
          <div style="margin-top: 8px;">
            <span style="background: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 4px; font-size: 11px;">WiFi</span>
            <span style="background: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-left: 4px;">Parking</span>
          </div>
        </div>
      `);

    const meknesMarker = L.marker(meknesCoords, { icon: moroccanStationIcon })
      .addTo(map.current)
      .bindPopup(`
        <div style="font-family: system-ui; max-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">🇲🇦 Meknès</h3>
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Gare Routière de Meknès</p>
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">📍 Avenue des Forces Armées Royales, Meknès</p>
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">📞 +212 5 35 52 14 69</p>
          <div style="margin-top: 8px;">
            <span style="background: #fecaca; color: #991b1b; padding: 2px 6px; border-radius: 4px; font-size: 11px;">WiFi</span>
            <span style="background: #fecaca; color: #991b1b; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-left: 4px;">Restauration</span>
          </div>
        </div>
      `);

    // Add a line connecting the two cities
    const routeLine = L.polyline([libourneCoords, meknesCoords], {
      color: '#8b5cf6',
      weight: 3,
      opacity: 0.8,
      dashArray: '10, 10'
    }).addTo(map.current);

    // Fit map to show both markers
    const group = new L.FeatureGroup([libourneMarker, meknesMarker, routeLine]);
    map.current.fitBounds(group.getBounds().pad(0.1));

    // Add control for fullscreen-like behavior
    const customControl = L.Control.extend({
      onAdd: function() {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        container.style.backgroundColor = 'white';
        container.style.width = '30px';
        container.style.height = '30px';
        container.style.cursor = 'pointer';
        container.innerHTML = '🗺️';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.fontSize = '16px';
        
        container.onclick = function() {
          if (map.current) {
            map.current.fitBounds(group.getBounds().pad(0.1));
          }
        };
        
        return container;
      }
    });

    map.current.addControl(new customControl({ position: 'topright' }));

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div ref={mapContainer} className="w-full h-96 rounded-lg shadow-lg" />
  );
};

export default InteractiveMap;