import { useState, useEffect } from "react";
import './VisitorCounter.css';
import { getApiUrl } from '../../utils/api';

function VisitorCounter() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitorCount();
  }, []);


const fetchVisitorCount = async () => {
  try {
    const res = await fetch(getApiUrl('/api/survey-count'));  // ✅
    const data = await res.json();
    setCount(data.totalVisitors);
  } catch (error) {
    console.error("❌ Visitor count error:", error);
    setCount(0);
  } finally {
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