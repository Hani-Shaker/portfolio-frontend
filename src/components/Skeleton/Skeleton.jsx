import './Skeleton.css';

function Skeleton({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  className = ''
}) {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

// Skeleton للمشروع
export function ProjectSkeleton() {
  return (
    <div className="project-skeleton">
      <Skeleton height="200px" borderRadius="20px" className="skeleton-image" />
      <div className="skeleton-content">
        <Skeleton width="70%" height="24px" className="skeleton-title" />
        <Skeleton width="40%" height="16px" className="skeleton-category" />
        <Skeleton width="100%" height="60px" className="skeleton-desc" />
        <div className="skeleton-actions">
          <Skeleton width="80px" height="40px" borderRadius="8px" />
          <Skeleton width="80px" height="40px" borderRadius="8px" />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;