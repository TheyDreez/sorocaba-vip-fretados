'use client';
import dynamic from 'next/dynamic';

const DraggableMap = dynamic(() => import('./DraggableMap'), { 
  ssr: false,
  loading: () => <div style={{ padding: '40px', color: '#fff', textAlign: 'center' }}>Carregando mapa interativo...</div>
});

export default function MapWrapper({ routesData }: { routesData: any }) {
  return <DraggableMap routesData={routesData} />;
}
