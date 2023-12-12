import { ArcgisMap, ArcgisSketch } from '@arcgis/map-components-react';
import { useRef, useState } from 'react';

export default function Home() {
  const mapRef = useRef<HTMLArcgisMapElement>(null);
  const [showView, setShowView] = useState(true);

  const [sketchLog, setSketchLog] = useState<string[]>([]);

  const handleAddLog = (log: string) => {
    setSketchLog((logs) => [...logs, log]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toggle map on and off */}
      <button onClick={() => setShowView((show) => !show)}>
        {showView ? 'Hide' : 'Show'} View
      </button>

      {showView && (
        <ArcgisMap ref={mapRef} basemap="gray-vector" className="h-1/2" />
      )}

      <ArcgisSketch
        referenceElement={mapRef.current ?? undefined}
        position="top-right"
        activeTool="rectangle-selection"
        creationMode="update"
        onSketchCreate={() => handleAddLog('Sketch Create')}
        onSketchDelete={() => handleAddLog('Sketch Delete')}
        onSketchRedo={() => handleAddLog('Sketch Redo')}
        onSketchUndo={() => handleAddLog('Sketch Undo')}
        onSketchUpdate={() => handleAddLog('Sketch Update')}
      />

      <div className="flex flex-col flex-1 overflow-auto">
        {sketchLog.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
}
