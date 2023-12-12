import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import { ArcgisMap } from '@arcgis/map-components-react';
import type { ArcgisMapCustomEvent } from '@arcgis/map-components/dist/types';
import type MapView from '@arcgis/core/views/MapView';

type MapReadyEvent = ArcgisMapCustomEvent<{ view: MapView }>;

const geoJsonUrl =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

export default function AddLayer() {
    
  const handleViewReady = (e: MapReadyEvent) => {
    const geoJsonLayer = new GeoJSONLayer({ url: geoJsonUrl });

    const { view } = e.target;
    view.map.add(geoJsonLayer);
  };

  return <ArcgisMap onViewReady={handleViewReady} basemap="gray-vector" />;
}
