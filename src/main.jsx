import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import App from './App.jsx';
import { EntitiesProvider } from './context/EntitiesContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <EntitiesProvider>
        <App />
      </EntitiesProvider>
    </BrowserRouter>
  </StrictMode>,
);
