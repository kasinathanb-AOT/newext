import React from 'react';
// Style
import "./App.css";
// Browser router
import { BrowserRouter as Router } from 'react-router-dom';
// Contexts
import { ScribeProvider } from 'contexts/ScribeContext';
// Hooks
import { useChromeMessageListener } from "hooks/useListenerForWebPage";
import { useAPIMode } from "hooks/useAPIMode";
// Components
import Header from 'components/Header/Header';
import AppRoutes from './AppRoutes';

function App() {
  useAPIMode();

  useChromeMessageListener((message) => {
    if (message.type === 'BUTTON_CLICKED') {
      console.log('Button clicked:', message.details);
    }
  });
 
  return (
    <ScribeProvider>
      <Router>
        <Header />
        <AppRoutes />
      </Router>
    </ScribeProvider>
  )
}

export default App;
