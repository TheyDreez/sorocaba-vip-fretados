import fs from 'fs';
import path from 'path';
import MapWrapper from '@/components/MapWrapper';

export default function AdminMapPage() {
  // Read routes.json directly from the filesystem on the server side
  const routesPath = path.join(process.cwd(), 'src/data/routes.json');
  const routesData = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

  return (
    <main>
      <MapWrapper routesData={routesData} />
    </main>
  );
}
