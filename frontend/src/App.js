import { useEffect, useState } from 'react';
import api from './services/api';
import './App.css';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');

  useEffect(() => {
    // Test backend connection
    api.get('/')
      .then(() => setConnectionStatus('✅ Backend connected'))
      .catch(() => setConnectionStatus('❌ Backend connection failed'));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Manager App</h1>
        <p>Django + React Setup Complete!</p>
        <p>Backend Status: {connectionStatus}</p>
        <p>Django: <a href="http://localhost:8000">localhost:8000</a></p>
        <p>React: <a href="http://localhost:3000">localhost:3000</a></p>
      </header>
    </div>
  );
}

export default App;