import React from 'react';
import ReactDOM from 'react-dom/client';

import DemoPage from './DemoPage';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <DemoPage />
  </React.StrictMode>,
);
