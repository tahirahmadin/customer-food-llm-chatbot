// src/App.tsx
import React from 'react';
import { ChatProvider } from './context/ChatContext';
import { DunkinOrderApp } from './components/DunkinOrderApp';

function App() {
  return (
    <ChatProvider>
      <DunkinOrderApp />
    </ChatProvider>
  );
}

export default App;