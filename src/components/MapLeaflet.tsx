'use client';
import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function BoundsUpdater({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      import('leaflet').then((L) => {
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [50, 50] });
      });
    }
  }, [map, points]);
  return null;
}

export default function MapLeaflet({ center, zoom, origin, dest, route }: any) {
  const points: [number, number][] = [];
  if (origin) points.push([origin.lat, origin.lng]);
  if (dest) points.push([dest.lat, dest.lng]);
  if (route?.boarding) points.push([route.boarding.lat, route.boarding.lng]);
  if (route?.dropoff) points.push([route.dropoff.lat, route.dropoff.lng]);

  const lineColor = route?.line?.color || '#D4AF37';

  return (
    <MapContainer 
      center={[center.lat, center.lng]} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%', borderRadius: '16px', zIndex: 1 }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {points.length > 0 && <BoundsUpdater points={points} />}

      {/* Origin Point */}
      {origin && (
        <CircleMarker center={[origin.lat, origin.lng]} radius={6} pathOptions={{ color: '#000', weight: 2, fillColor: '#fff', fillOpacity: 1 }} />
      )}
      
      {/* Dest Point */}
      {dest && (
        <CircleMarker center={[dest.lat, dest.lng]} radius={6} pathOptions={{ color: '#000', weight: 2, fillColor: '#fff', fillOpacity: 1 }} />
      )}

      {/* Route Stops and Line */}
      {route && (
        <>
          <CircleMarker center={[route.boarding.lat, route.boarding.lng]} radius={8} pathOptions={{ color: '#000', weight: 2, fillColor: lineColor, fillOpacity: 1 }} />
          <CircleMarker center={[route.dropoff.lat, route.dropoff.lng]} radius={8} pathOptions={{ color: '#000', weight: 2, fillColor: lineColor, fillOpacity: 1 }} />
          <Polyline positions={[[route.boarding.lat, route.boarding.lng], [route.dropoff.lat, route.dropoff.lng]]} pathOptions={{ color: lineColor, weight: 4, opacity: 0.8, dashArray: '8, 8' }} />
        </>
      )}
    </MapContainer>
  );
}
