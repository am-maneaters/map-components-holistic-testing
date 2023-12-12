import { ArcgisMap, ArcgisSketch } from '@arcgis/map-components-react';
import { useRef } from 'react';

/**
 * The referenceElement prop can be a CSS selector or a DOM element. This
 * example shows how to use both. (Note: the DOM element via ref does not work.)
 */
export default function ReferenceElement() {
  const cssSelector = (
    <>
      {/* Set the ID of the ArcgisMap to "myMap" */}
      <ArcgisMap id="myMap" basemap="gray-vector" className="flex-1" />
      {/* Reference element queries the CSS selector to attach to a map */}
      <ArcgisSketch referenceElement="#myMap" />
    </>
  );

  const mapRef = useRef<HTMLArcgisMapElement>(null);
  const reactRef = (
    <>
      {/* Set the ref of the ArcgisMap */}
      <ArcgisMap ref={mapRef} basemap="gray-vector" className="flex-1" />
      {/* Use the current mapRef as the map, this does not work... */}
      <ArcgisSketch referenceElement={mapRef.current ?? undefined} />
    </>
  );

  return (
    <div className="h-full flex gap-4">
      <div className="h-full flex flex-col text-2">
        CSS Selector
        {cssSelector}
      </div>
      <div className="h-full flex flex-col text-2">
        React useRef
        {reactRef}
      </div>
    </div>
  );
}
