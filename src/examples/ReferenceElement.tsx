import { ArcgisMap, ArcgisSketch } from '@arcgis/map-components-react';
import { useRef, useState } from 'react';

function CssSelectorExample() {
  return (
    <>
      {/* Set the ID of the ArcgisMap to "myMap" */}
      <ArcgisMap id="myMap" basemap="gray-vector" className="flex-1" />
      {/* Reference element queries the CSS selector to attach to a map */}
      <ArcgisSketch referenceElement="#myMap" />
    </>
  );
}

function RefExample() {
  const mapRef = useRef<HTMLArcgisMapElement>(null);
  return (
    <>
      {/* Set the ref of the ArcgisMap */}
      <ArcgisMap ref={mapRef} basemap="gray-vector" className="flex-1" />
      {/* Use the current mapRef as the map, this does not work... */}
      <ArcgisSketch referenceElement={mapRef.current ?? undefined} />
    </>
  );
}

function StateExample() {
  const [mapElRef, setMapElRef] = useState<HTMLArcgisMapElement>();
  return (
    <>
      {/* Get the element from onViewReady */}
      <ArcgisMap
        onViewReady={(e) => setMapElRef(e.target)}
        basemap="gray-vector"
        className="flex-1"
      />
      {/* Use the current mapRef state as reference element */}
      <ArcgisSketch referenceElement={mapElRef} />
    </>
  );
}

/**
 * The referenceElement prop can be a CSS selector or a DOM element. This
 * example shows how to use both. (Note: the DOM element via ref does not work.)
 */
export default function ReferenceElement() {
  return (
    <div className="h-full flex gap-4">
      <div className="h-full flex flex-col text-2">
        CSS Selector
        <CssSelectorExample />
      </div>
      <div className="h-full flex flex-col text-2">
        useRef
        <RefExample />
      </div>
      <div className="h-full flex flex-col text-2">
        useState
        <StateExample />
      </div>
    </div>
  );
}
