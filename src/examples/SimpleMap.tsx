import { ArcgisMap } from '@arcgis/map-components-react';

export default function SimpleMap() {
  return <ArcgisMap basemap="gray-vector" center="-90.3353,47.7496" zoom={15} />;
}
