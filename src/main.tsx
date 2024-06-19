import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App.tsx';
import 'tailwindcss/tailwind.css';

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
