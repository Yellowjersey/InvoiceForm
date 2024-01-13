import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import { BrowserRouter as Router } from 'react-router-dom';
import Root from './root';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Root />
    </Router>
  </React.StrictMode>
);
