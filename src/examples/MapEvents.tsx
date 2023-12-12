import { ArcgisMap } from '@arcgis/map-components-react';
import Graphic from '@arcgis/core/Graphic';

type MapMouseEvent = React.MouseEvent<HTMLArcgisMapElement, MouseEvent>;

export default function MapEvents() {
  const handleMapMouseMove = (e: MapMouseEvent) => {
    const { view } = e.currentTarget;
    const mapPoint = view.toMap(e.nativeEvent);
    const newGraphic = new Graphic({ geometry: mapPoint });

    view.graphics.removeAll();
    view.graphics.add(newGraphic);
  };

  return <ArcgisMap zoom={2} basemap={'gray-vector'} onMouseMove={handleMapMouseMove} />;
}
