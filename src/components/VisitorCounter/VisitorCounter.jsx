import { useState, useEffect } from "react";
import './VisitorCounter.css';

function VisitorCounter() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitorCount();
  }, []);

  const fetchVisitorCount = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const res = await fetch(`${API_URL}/api/survey/visitor-count`);
      const data = await res.json();
      setCount(data.totalVisitors);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching visitor count:", error);
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="visitor-counter">
      <i className="fas fa-eye"></i>
      <div className="visitor-info">
        <p className="visitor-count">{count.toLocaleString('ar-EG')}</p>
        <p className="visitor-label">زائر</p>
      </div>
    </div>
  );
}

export default VisitorCounter;