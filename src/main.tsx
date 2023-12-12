import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import './index.css';
import '@arcgis/core/assets/esri/themes/dark/main.css';
import { defineCustomElements as defineMapElements } from '@arcgis/map-components/dist/loader';
import { defineCustomElements as defineCalciteComponents } from '@esri/calcite-components/dist/loader';
import '@esri/calcite-components/dist/calcite/calcite.css';
import { ThemeProvider } from './contexts/ThemeProvider.tsx';

defineMapElements();
defineCalciteComponents(window);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
