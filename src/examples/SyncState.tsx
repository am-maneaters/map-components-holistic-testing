/**
 * This example uses a custom hook, useArcState, to 
 * synchronize the zoom property of the ArcGIS view 
 * with the state of the React component.
 *
 * The hook, useArcState, is used in the Zoom component.
 */
export default function PropertyWatch() {
  const [view, setView] = useState<MapView>();

  return (
    <>
      {view && <Zoom view={view} />}
      <ArcgisMap
        zoom={2}
        basemap={'gray-vector'}
        onViewReady={(e) => setView(e.target.view)}
      />
    </>
  );
}

function Zoom({ view }: { view: MapView }) {
  const [zoom, setZoom] = useArcState(view, 'zoom');

  return (
    <div className="flex p-2 justify-between">
      Zoom: {zoom}
      <div>
        <CalciteButton
          onClick={() => setZoom((zoom) => zoom + 1)}
          iconStart="plus"
        />
        <CalciteButton
          onClick={() => setZoom((zoom) => zoom - 1)}
          iconStart="minus"
        />
      </div>
    </div>
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

/**
 * Watches and sets state for an ArcGIS Accessor
 * @param acc - An ArcGIS Accessor
 * @param property - The property to sync with
 * @returns - A tuple of the state and a setter for the state, same as useState
 */
function useArcState<T extends __esri.Accessor, Property extends keyof T>(
  acc: T,
  property: Property
): [T[Property], React.Dispatch<React.SetStateAction<T[Property]>>] {
  const [state, setState] = useState<T[Property]>(acc[property]);

  useWatchEffect(() => acc[property], setState);

  const setArcState = useCallback(
    (newValue: React.SetStateAction<T[keyof T]>) => {
      if (typeof newValue === 'function') {
        newValue = (newValue as (oldValue: T[Property]) => T[Property])(
          acc[property]
        );
      }

      acc.set(property as string, newValue);
      setState(newValue as T[Property]);
    },
    [acc, property]
  ) as React.Dispatch<React.SetStateAction<T[Property]>>;

  return [state, setArcState];
}

/** IMPORTS */

import { useCallback, useEffect, useState } from 'react';

import { watch } from '@arcgis/core/core/reactiveUtils';
import MapView from '@arcgis/core/views/MapView';

import { ArcgisMap } from '@arcgis/map-components-react';
import { CalciteButton } from '@esri/calcite-components-react';
