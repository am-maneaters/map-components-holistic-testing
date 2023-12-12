import arcgisDarkCss from '@arcgis/core/assets/esri/themes/dark/main.css?inline';
import arcgisLightCss from '@arcgis/core/assets/esri/themes/light/main.css?inline';
import {
  CalciteAction,
  CalciteActionBar,
  CalciteActionGroup,
  CalciteLoader,
  CalciteShell,
  CalciteShellPanel,
} from '@esri/calcite-components-react';
import { lazy, Suspense, useEffect } from 'react';

import { CodeDisplayAsync } from './components/CodeDisplay.tsx';
import { useTheme } from './contexts/ThemeProvider.tsx';
import { ActionItem, useCalciteActionBar } from './hooks/calciteHooks.tsx';

const Examples: ActionItem[] = [
  {
    name: 'SimpleMap',
    component: lazy(() => import('./examples/SimpleMap.tsx')),
    code: () => import('./examples/SimpleMap.tsx?raw'),
    icon: 'map',
  },
  {
    name: "SimpleScene",
    component: lazy(() => import('./examples/SimpleScene.tsx')),
    code: () => import('./examples/SimpleScene.tsx?raw'),
    icon: 'globe',
  },
  {
    name: 'AddLayer',
    component: lazy(() => import('./examples/AddLayer.tsx')),
    code: () => import('./examples/AddLayer.tsx?raw'),
    icon: 'layers',
  },
  {
    name: "ReferenceElement",
    component: lazy(() => import('./examples/ReferenceElement.tsx')),
    code: () => import('./examples/ReferenceElement.tsx?raw'),
    icon: "code",
  },
  {
    name: "MapEvents",
    component: lazy(() => import('./examples/MapEvents.tsx')),
    code: () => import('./examples/MapEvents.tsx?raw'),
    icon: "cursor",
  }
];

export function App() {
  const { theme, setTheme } = useTheme();

  // Set the ArcGIS theme on the document head
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = theme === 'dark' ? arcgisDarkCss : arcgisLightCss;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [theme]);

  const { currentAction, actions } = useCalciteActionBar(
    Examples,
    window.location.hash
      ? decodeURI(window.location.hash.slice(1))
      : Examples[0].name
  );

  useEffect(() => {
    if (currentAction) window.location.hash = currentAction?.name;
  }, [currentAction]);

  return (
    <div style={{ colorScheme: theme }} className={`${theme}`}>
      <CalciteShell className={`calcite-mode-${theme} bg-dotted`}>
        <CalciteShellPanel
          slot="panel-start"
          displayMode="float"
          collapsed
          className="!p-8 !pr-2"
        >
          <CalciteActionBar
            slot="action-bar"
            overflowActionsDisabled
            expanded
            className="shadow-3xl rounded-lg"
          >
            <CalciteAction
              text="Components"
              style={{
                '--calcite-font-size--1': '20px',
                '--calcite-font-weight-normal': 'bold',
              }}
              icon="globe"
            ></CalciteAction>

            {actions}

            <CalciteActionGroup slot="bottom-actions">
              <CalciteAction
                icon={theme === 'dark' ? 'brightness' : 'moon'}
                text="Toggle theme"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              />
            </CalciteActionGroup>
          </CalciteActionBar>
        </CalciteShellPanel>

        {currentAction && (
          <Suspense
            fallback={
              <div className="w-full h-full">
                <CalciteLoader label="Sample Loading" />
              </div>
            }
          >
            <div className="flex flex-col xl:justify-center xl:flex-row-reverse gap-8 p-8 bg-dotted min-h-full items-center box-border [&>*]:max-w-4xl [&>*]:w-full">
              <div className="flex-1 xl:h-full min-h-[50vh] rounded-lg overflow-hidden shadow-3xl bg-foreground-1">
                {currentAction?.component && <currentAction.component />}
              </div>
              {currentAction.code && (
                <div className="shadow-3xl overflow-auto rounded-lg xl:min-h-min xl:max-h-full xl:flex-1">
                  <CodeDisplayAsync codePromise={currentAction?.code} />
                </div>
              )}
            </div>
          </Suspense>
        )}
      </CalciteShell>
    </div>
  );
}
