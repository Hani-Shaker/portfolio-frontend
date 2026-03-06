import { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/api';
import './VisitorCounter.css';

function VisitorCounter() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitorCount();
  }, []);

  const fetchVisitorCount = async () => {
    try {
      const res = await fetch(getApiUrl('/api/survey-count'));
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      setCount(data.totalVisitors);
    } catch (error) {
      console.error("❌ Visitor count error:", error);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="visitor-counter">
      <div className="counter-content">
        <i className="fas fa-users counter-icon"></i>
        <div className="counter-text">
          <span className="counter-number">
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              count.toLocaleString()
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VisitorCounter;