import MapView from '@arcgis/core/views/MapView';
import { ArcgisLegend, ArcgisMap } from '@arcgis/map-components-react';
import { CalciteButton } from '@esri/calcite-components-react';
import React, { RefObject, useEffect, useRef, useState } from 'react';

export default function CustomUI() {
  return (
    <ArcgisMap zoom={2} basemap="gray-vector" className="flex-1">
      <ArcUI position="top-right" className="bg-background p-4 flex flex-col">
        <p>My custom UI</p>
        <CalciteButton>A button!</CalciteButton>
      </ArcUI>
      <ArcUI position="bottom-right" className="bg-background p-4 flex flex-col">
        <p>Widgets inside custom UI do not stay inside :(</p>
        <ArcgisLegend />
      </ArcUI>
    </ArcgisMap>
  );
}

/**
 * A custom hook that gets the view from the parent arcgis-map.
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

/**
 * A custom hook that adds a UI element to the view.
 * @param view - The view to add the UI to
 * @param position - The position of the UI element
 * @returns - A ref to the UI element
 */
const useArcUI = (
  // TODO: Get the view by using element.closest('arcgis-map') instead
  position: __esri.UIAddPosition['position']
) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const view = useArcgisView(widgetRef);

  useEffect(() => {
    const ref = widgetRef.current;
    if (!ref || !view) return;

    const viewUi = view.ui;
    viewUi.add(ref, position);

    return () => {
      if (!view.destroyed) viewUi.remove(ref);
    };
  }, [position, view]);

  return widgetRef;
};

type ArcUIProps = {
  position: __esri.UIAddPosition['position'];
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * A component that adds UI to the view. This must be a
 * child of an ArcgisMap component.
 */
const ArcUI = ({ position, children, ...divProps }: ArcUIProps) => {
  const widgetRef = useArcUI(position);

  return (
    // Need to wrap the UI ref in a div because the View UI will
    // use the parent element to add and remove the UI element
    <div>
      <div ref={widgetRef} {...divProps}>
        {children}
      </div>
    </div>
  );
};
