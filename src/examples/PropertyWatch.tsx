/**
 * This example uses a custom hook, useWatchEffect, 
 * to watch the zoom property of the view.
 * 
 * The hook is defined at the bottom of this file.
 */
export default function PropertyWatch() {
  const [view, setView] = useState<MapView>();
  const [zoom, setZoom] = useState<number>();

  useWatchEffect(
    () => view?.zoom,
    (newValue) => {
      setZoom(newValue);
    }
  );

  return (
    <>
      Zoom: {zoom}
      <ArcgisMap
        zoom={2}
        basemap={'gray-vector'}
        onViewReady={(e) => setView(e.target.view)}
      />
    </>
  );
}

/**
 * Watches an ArcGIS Accessor and calls a callback when the value changes
 * @param getValue - A function that returns the value to watch (e.g. () => view.zoom)
 * @param callback - A function to call when the value changes
 * @param options - Options to pass to the watch function
 */
function useWatchEffect<T>(
  getValue: () => T,
  callback: (newValue: T, oldValue: T) => void,
  options?: __esri.ReactiveWatchOptions
) {
  useEffect(() => {
    // Watch for changes to value
    const handle = watch(getValue, callback, { initial: true, ...options });

    // Remove watch when component unmounts
    return () => handle.remove();
  }, [callback, getValue, options]);
}

/** IMPORTS */

import { useEffect, useState } from 'react';
import { watch } from '@arcgis/core/core/reactiveUtils';

import { ArcgisMap } from '@arcgis/map-components-react';
import MapView from '@arcgis/core/views/MapView';
