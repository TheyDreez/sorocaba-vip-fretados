'use client';
import { useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Stop {
  name: string;
  lat: number;
  lng: number;
}

interface Line {
  id: string;
  name: string;
  color: string;
  boardingStops: Stop[];
  dropoffStops: Stop[];
}

export default function DraggableMap({ routesData }: { routesData: any }) {
  const [data, setData] = useState(routesData);
  const [jsonOutput, setJsonOutput] = useState('');

  const updateStop = (lineId: string, type: 'boardingStops' | 'dropoffStops', index: number, lat: number, lng: number) => {
    setData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev)); // deep copy
      const line = newData.lines.find((l: any) => l.id === lineId);
      if (line) {
        line[type][index].lat = parseFloat(lat.toFixed(6));
        line[type][index].lng = parseFloat(lng.toFixed(6));
      }
      return newData;
    });
  };

  const generateJson = () => {
    setJsonOutput(JSON.stringify(data, null, 2));
  };

  const center = { lat: -23.5015, lng: -47.4581 }; // Sorocaba

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#111', color: '#fff' }}>
      <div style={{ padding: '20px', background: '#000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Calibração de GPS (Batata Fretados)</h2>
          <p style={{ color: '#aaa' }}>Arraste os pinos para a localização exata das paradas.</p>
        </div>
        <button 
          onClick={generateJson}
          style={{ padding: '12px 24px', background: 'var(--accent-gold)', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Exportar JSON Atualizado
        </button>
      </div>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1 }}>
          <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            
            {data.lines.map((line: Line) => (
              <div key={line.id}>
                {line.boardingStops.map((stop, i) => (
                  <DraggableMarker 
                    key={`${line.id}-b-${i}`} 
                    stop={stop} 
                    lineName={line.name} 
                    type="Embarque"
                    onDragEnd={(lat, lng) => updateStop(line.id, 'boardingStops', i, lat, lng)} 
                  />
                ))}
                {line.dropoffStops.map((stop, i) => (
                  <DraggableMarker 
                    key={`${line.id}-d-${i}`} 
                    stop={stop} 
                    lineName={line.name} 
                    type="Desembarque"
                    onDragEnd={(lat, lng) => updateStop(line.id, 'dropoffStops', i, lat, lng)} 
                  />
                ))}
              </div>
            ))}
          </MapContainer>
        </div>
        
        {jsonOutput && (
          <div style={{ width: '400px', background: '#222', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <h3>Código Gerado</h3>
            <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '10px' }}>Copie este texto e envie para a equipe de desenvolvimento.</p>
            <textarea 
              readOnly 
              value={jsonOutput}
              style={{ flex: 1, width: '100%', background: '#000', color: '#0f0', fontFamily: 'monospace', padding: '10px', border: '1px solid #444', resize: 'none' }}
            />
            <button 
              onClick={() => navigator.clipboard.writeText(jsonOutput)}
              style={{ padding: '10px', marginTop: '10px', background: '#444', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              Copiar para a Área de Transferência
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DraggableMarker({ stop, lineName, type, onDragEnd }: { stop: Stop, lineName: string, type: string, onDragEnd: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState({ lat: stop.lat, lng: stop.lng });
  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          setPosition(latLng);
          onDragEnd(latLng.lat, latLng.lng);
        }
      },
    }),
    [onDragEnd]
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Popup minWidth={90}>
        <strong style={{ color: '#000' }}>{stop.name}</strong><br />
        <span style={{ color: '#555', fontSize: '0.9rem' }}>{lineName} - {type}</span>
      </Popup>
    </Marker>
  );
}
