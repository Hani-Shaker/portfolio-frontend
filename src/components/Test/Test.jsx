// src/Test.jsx
import { useState, useEffect } from 'react';
import './Test.css'

function Test() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  // Load counter on mount
  useEffect(() => {
    loadCounter();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadCounter, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadCounter = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/count');
      const data = await response.json();
      setCount(data.count);
      setLoading(false);
    } catch (error) {
      console.error('Error loading counter:', error);
      setStatus('❌ Failed to load counter');
      setLoading(false);
    }
  };

  const increment = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/increment', {
        method: 'POST',
        headers: {
          'Content-Type': 'Testlication/json'
        }
      });
      
      const data = await response.json();
      setCount(data.count);
      setStatus('✅ Counter updated!');
      
      setTimeout(() => setStatus(''), 2000);
    } catch (error) {
      console.error('Error incrementing counter:', error);
      setStatus('❌ Failed to update');
    }
  };

  return (
    <div className="counter-container">
      <h1>🌍 Global Click Counter</h1>
      <p>This counter is shared by all visitors!</p>
      <div className="counter-display">
        {loading ? 'Loading...' : count}
      </div>
      <button className="btn" onClick={increment} disabled={loading}>
        Click Me! +
      </button>
      {status && <div className="status">{status}</div>}
    </div>
  );
}

export default Test;