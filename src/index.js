import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; // <-- Correct import for React 18
import { Provider } from 'react-redux';
import App from './App';
import './index.css'; // Import your CSS file here
import Store from './ReduxStore';


const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  
  <StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </StrictMode>
);
