import "./App.css";
import React from 'react';
import Index from './pages/Index';
import useChromeMessageListener from "./hooks/useListenerForWebPage";

function App() {

  useChromeMessageListener((message) => {
    if (message.type === 'BUTTON_CLICKED') {
      console.log('Button clicked:', message.details);
    }
  });

  return <Index />
}

export default App;