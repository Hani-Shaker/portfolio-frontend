import { useState, useEffect } from "react";
import "./Projects.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [openId, setOpenId] = useState(null);
  const [likes, setLikes] = useState({});
  const [views, setViews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const res = await fetch(`${API_URL}/api/projects`);      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("📦 Projects data:", data); // للتأكد
      
      setProjects(data);

      // تحضير الـ likes والـ views
      const userId = getUserId();
      const initialLikes = {};
      const initialViews = {};
      
      data.forEach(p => {
        initialLikes[p._id] = {
          count: p.likedBy?.length || 0,
          liked: p.likedBy?.includes(userId) || false
        };
        initialViews[p._id] = p.views || 0;
      });
      
      setLikes(initialLikes);
      setViews(initialViews);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const getUserId = () => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem("userId", userId);
    }
    return userId;
  };

  const handleLike = async (projectId) => {
    const userId = getUserId();

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const res = await fetch(`${API_URL}/api/projects/${projectId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      
      const data = await res.json();

      setLikes(prev => ({
        ...prev,
        [projectId]: { count: data.likes, liked: data.liked }
      }));
    } catch (error) {
      console.error("❌ Error toggling like:", error);
    }
  };

  const handleView = async (projectId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const res = await fetch(`${API_URL}/api/projects/${projectId}/view`, {
        method: "POST"
      });
      
      const data = await res.json();
      
      setViews(prev => ({
        ...prev,
        [projectId]: data.views
      }));
    } catch (error) {
      console.error("❌ Error incrementing view:", error);
    }
  };

  const viewMore = (id) => {
    setOpenId(prev => prev === id ? null : id);
    // if (openId !== id) {
      // handleView(id);
    // }
  };

  const handleLoadMore = () => setVisibleCount(prev => prev + 3);

  // حالة التحميل
  if (loading) {
    return (
      <section id="projects" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#19cee6] mx-auto mb-4"></div>
          <p className="text-xl">Loading projects...</p>
        </div>
      </section>
    );
  }

  // حالة الخطأ
  if (error) {
    return (
      <section id="projects" className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-2xl mb-4">❌ Error loading projects</p>
          <p>{error}</p>
          <button 
            onClick={fetchProjects}
            className="mt-4 bg-[#19cee6] text-black px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // لو مفيش مشاريع
  if (projects.length === 0) {
    return (
      <section id="projects" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl">📭 No projects found</p>
          <p className="mt-2 opacity-70">Add projects from MongoDB Atlas</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects">
      <h2 className="font-bold text-4xl text-center h-40 flex items-center justify-center">
        Projects ({projects.length})
      </h2>
      
      <div className="projects-cont w-9/10 mx-auto py-20 flex flex-wrap flex-col justify-center items-center gap-15">
        {projects.slice(0, visibleCount).map(item => (
          <div 
            key={item._id} 
            className="project w-80 transition hover:scale-105 rounded-4xl overflow-hidden flex justify-center flex-col relative"
          >
            {/* Love & Views Section */}
            <div className="love absolute top-3 right-3 z-10 flex flex-col justify-center items-center rounded-4xl p-2 bg-[#0a0a0a]/80 backdrop-blur-sm">
              {/* Views */}
              <div className="flex flex-col items-center mb-2">
                <i className="fa-solid fa-eye text-[#19cee6] text-2xl"></i>
                <span className="text-[#19cee6] font-bold">{views[item._id] || 0}</span>
              </div>
              
              {/* Likes */}
              <div 
                onClick={() => handleLike(item._id)} 
                className="cursor-pointer flex flex-col items-center hover:scale-110 transition"
              >
                <i className={`fa-heart ${likes[item._id]?.liked ? 'fa-solid' : 'fa-regular'} text-[#19cee6] text-2xl`}></i>
                <span className="text-[#19cee6] font-bold">{likes[item._id]?.count || 0}</span>
              </div>
            </div>

            {/* Image */}
            <div className="top-product relative flex justify-center items-center overflow-hidden">
              <img 
                src={item.urlImg || 'https://via.placeholder.com/400x300?text=No+Image'} 
                alt={item.title}
                className="project-img rounded-4xl w-full h-64 object-cover"
              />
            </div>

            {/* Body */}
            <div className={`project-body flex flex-col gap-1 p-3 ${openId === item._id ? "expanded" : ""}`}>
              <div className="h-9/12">
                <div className="flex justify-between items-center px-2">
                  <h6 className="font-bold text-xl">{item.title}</h6>
                  <h3 className="text-sm bg-[#19cee6]/20 px-2 py-1 rounded">{item.category}</h3>
                </div>
                <div className="flex justify-end px-2">
                  <h6 className="text-sm opacity-80">{item.tools}</h6>
                </div>
                {openId === item._id && (
                  <p className="mt-2 text-sm opacity-80 px-2">{item.body}</p>
                )}
              </div>

              {/* Links */}
              <div className="links flex justify-between items-center mt-2">
                <div className="flex gap-2">
                  {item.repo && (
                    <a 
                      href={item.repo} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="size-10 flex justify-center items-center rounded-full bg-[#19cee6]/10 hover:bg-[#19cee6]/20 transition"
                    >
                      <i className="fa-brands fa-github text-2xl"></i>
                    </a>
                  )}
{item.view && (
  <a 
    href={item.view} 
    target="_blank" 
    rel="noopener noreferrer" 
    onClick={() => handleView(item._id)} // ✅ زيادة Views عند الضغط
    className="size-10 flex justify-center items-center rounded-full bg-[#19cee6]/10 hover:bg-[#19cee6]/20 transition"
  >
    <i className="fa-solid fa-link text-2xl"></i>
  </a>
)}
                </div>
                <div>
                  <button 
                    onClick={() => viewMore(item._id)} 
                    className="size-10 flex justify-center items-center rounded-full text-[#19cee6] hover:bg-[#19cee6]/10 transition"
                  >
                    <i className={`fas fa-caret-down text-3xl transition-transform ${openId === item._id ? "rotate-180" : ""}`}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {visibleCount < projects.length && (
          <button 
            onClick={handleLoadMore} 
            className="cursor-pointer bg-[#19cee6] text-black font-bold px-8 py-3 rounded-2xl hover:bg-[#15b8cc] transition"
          >
            Load More Projects ({projects.length - visibleCount} remaining)
          </button>
        )}
      </div>
    </section>
  );
}

export default Projects;