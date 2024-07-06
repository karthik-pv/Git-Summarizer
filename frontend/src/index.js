// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { EmailProvider } from './context/EmailContext'; // Import EmailProvider

ReactDOM.render(
  <React.StrictMode>
    <EmailProvider> {/* Wrap the App component with EmailProvider */}
      <App />
    </EmailProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
