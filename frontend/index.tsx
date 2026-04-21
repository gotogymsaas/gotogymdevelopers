import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/GoToGymDeveloperConsole.css';

if (typeof window !== 'undefined') {
  window.__APP_ENV__ = import.meta.env as Record<string, string>;
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
