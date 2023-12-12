import { ArcgisScene } from '@arcgis/map-components-react';

export default function SimpleScene() {
  return <ArcgisScene basemap="gray-vector" center="-90.3353,47.7496" zoom={2} />;
}
