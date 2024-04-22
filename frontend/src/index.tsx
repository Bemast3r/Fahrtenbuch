import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { UserProvider } from './Components/Context/UserContext';
import { FahrtProvider } from './Components/Context/FahrtenContext';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <UserProvider >
      <FahrtProvider>
        <App />
      </FahrtProvider>
    </UserProvider>
  </React.StrictMode>
);
