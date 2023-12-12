import MapView from '@arcgis/core/views/MapView';
import { ArcgisMap } from '@arcgis/map-components-react';
import { CalciteButton } from '@esri/calcite-components-react';
import React, { useEffect, useRef, useState } from 'react';

export default function CustomUI() {
  const [view, setView] = useState<MapView>();

  return (
    <div className="h-full flex flex-col">
      <ArcgisMap
        zoom={2}
        onViewReady={(e) => setView(e.target.view)}
        basemap="gray-vector"
        className="flex-1"
      >
        {view && (
          <ArcUI
            position="top-right"
            view={view}
            className="bg-background p-4 flex flex-col"
          >
            My custom UI
            <CalciteButton>A button!</CalciteButton>
          </ArcUI>
        )}
      </ArcgisMap>
    </div>
  );
}

/**
 * A custom hook that adds a UI element to the view.
 * @param view - The view to add the UI to
 * @param position - The position of the UI element
 * @returns - A ref to the UI element
 */
const useArcUI = (
  // TODO: Get the view by using element.closest('arcgis-map') instead
  view: __esri.MapView,
  position: __esri.UIAddPosition['position']
) => {
  const widgetRef = useRef<HTMLDivElement>(null);

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
  view: __esri.MapView;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * A component that adds UI to the view.
 */
const ArcUI: React.FC<ArcUIProps> = ({
  position,
  children,
  view,
  ...divProps
}) => {
  const widgetRef = useArcUI(view, position);

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
