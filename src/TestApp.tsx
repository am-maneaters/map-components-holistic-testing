import { useEffect, useState } from 'react';

import './App.css';
import {
  ArcgisMap,
  ArcgisSketch,
  ArcgisZoom,
} from '@arcgis/map-components-react';
import * as test from '@arcgis/map-components/dist/esm/component-utils-2ebdae59';
console.log(test);

import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import teamsJson from './teams.geojson?url';
import { CalciteOption, CalciteSelect } from '@esri/calcite-components-react';
import Basemap from '@arcgis/core/Basemap';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

function App() {
  // const [view, setView] = useState<__esri.MapView>();
  const [basemap, setBasemap] = useState('gray-vector');
  const [teamsLayerView, setTeamsLayerView] =
    useState<__esri.GeoJSONLayerView>();

  // #TODO: ArcgisMapCustomEvent type is not exported from @arcgis/map-components-react
  const handleViewReady = (view: __esri.MapView) => {
    const geoJsonLayer = new GeoJSONLayer({
      url: teamsJson,
    });
    view.map.add(geoJsonLayer);

    view.whenLayerView(geoJsonLayer).then((layerView) => {
      setTeamsLayerView(layerView as __esri.GeoJSONLayerView);
    });
    // setView(view);
  };

  const handleMapMouseMove = (
    e: React.MouseEvent<HTMLArcgisMapElement, MouseEvent>
  ) => {
    const { view } = e.currentTarget;

    const mapPoint = e.currentTarget.view.toMap(e.nativeEvent);

    view
      .hitTest(e.nativeEvent, { include: teamsLayerView?.layer })
      .then(({ results }) => {
        view.container.style.cursor =
          results.length > 0 ? 'pointer' : 'default';
      });
    console.log(mapPoint);
    // view.graphics.removeAll();
    // view.graphics.add({
    //   symbol: {
    //     type: 'simple-marker',
    //     color: 'red',
    //     size: '10px',
    //     outline: {
    //       color: [255, 255, 255],
    //       width: 2,
    //     },
    //   },
    //   geometry: mapPoint,
    // });
  };
  // useEffect(() => {
  //   if (view?.map) view.map.basemap = new Basemap({id: basemap});
  // }, [basemap, view]);

  return (
    <div style={{ width: '90vw', height: '90vh', position: 'relative' }}>
      <CalciteSelect
        label="Basemap Select"
        onCalciteSelectChange={(e) => setBasemap(e.target.value)}
        value={basemap}
      >
        <CalciteOption value="gray-vector" selected>
          Light Gray
        </CalciteOption>
        <CalciteOption value="dark-gray-vector">Dark Gray</CalciteOption>
        <CalciteOption value="streets">Streets</CalciteOption>
      </CalciteSelect>

      <ArcgisMap
        basemap={basemap}
        onMouseMove={handleMapMouseMove}
        id="test1"
        onViewReady={(e) => handleViewReady(e.target.view)}
      >
        <ArcgisSketch position="top-right" activeTool="rectangle-selection" />
      </ArcgisMap>

      <ArcgisZoom referenceElement={'#test1'} />
    </div>
  );
}

// Test if the app re-renders every time the view is updated
function RenderTest() {
  const [view, setView] = useState<__esri.MapView>();

  const [showView, setShowView] = useState(true);

  return (
    <div style={{ width: 500, height: 500 }}>
      <button onClick={() => setShowView((show) => !show)}>
        {showView ? 'Hide' : 'Show'} View
      </button>
      {showView && (
        <ArcgisMap
          basemap="gray-vector"
          onViewReady={(e) => setView(e.target.view)}
        />
      )}
      <ArcgisSketch
        referenceElement={'#test1'}
        position="top-right"
        activeTool="rectangle-selection"
        creationMode="update"
        layer={new GraphicsLayer()}
        onSketchCreate={(e) => {
          console.log(e);
        }}
      />
      <div>{view?.extent?.xmax}</div>
    </div>
  );
}

export default RenderTest;
