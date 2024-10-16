import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('react-chrome-extension');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("No div found to render the React app");
}