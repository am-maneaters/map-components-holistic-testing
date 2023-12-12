import MapView from '@arcgis/core/views/MapView';
import { ArcgisMap } from '@arcgis/map-components-react';
import { CalciteButton } from '@esri/calcite-components-react';
import { RefObject, useEffect, useRef, useState } from 'react';

export default function ChildViewAccess() {
  return (
    <ArcgisMap zoom={2} basemap="gray-vector" className="flex-1">
      <ChildComponent />
    </ArcgisMap>
  );
}

function ChildComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const view = useArcgisView(ref);
  const handleClick = () => {
    view?.goTo({
      center: [Math.random() * 360 - 180, Math.random() * 180 - 90],
      zoom: Math.random() * 5,
    });
  };

  return (
    <div ref={ref} className="bg-background p-4 flex flex-col">
      <CalciteButton onClick={handleClick}>GoTo random</CalciteButton>
    </div>
  );
}

/**
 * A custom hook that gets the view from the parent arcgis-map component.
 * @param ref - A ref to the element that will be added to the view
 * @returns - The view
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */
const useArcgisView = (ref: RefObject<HTMLElement>) => {
  const [view, setView] = useState<MapView>();

  useEffect(() => {
    // set up event listener to check for parent arcgis-map
    const observer = new MutationObserver(() => {
      const parentMap = ref.current?.closest('arcgis-map');
      if (parentMap) {
        setView(parentMap.view);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return view;
};
