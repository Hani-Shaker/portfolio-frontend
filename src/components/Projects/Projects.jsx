import { useState, useEffect } from "react";
import "./Projects.css";
import { ProjectSkeleton } from '../Skeleton/Skeleton';

// ✅ Helper function
const getApiUrl = (endpoint) => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
  // const cleanUrl = baseUrl.replace(/\/$/, '');
  // const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${endpoint}`;
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [openId, setOpenId] = useState(null);
  const [likes, setLikes] = useState({});
  const [views, setViews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'Full Stack', label: 'Full Stack' },
    { value: 'Frontend', label: 'Frontend' },
    { value: 'Backend', label: 'Backend' },
    { value: 'Mobile', label: 'Mobile' }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(getApiUrl('/api/projects'));  // ✅
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("📦 Projects data:", data);
      
      setProjects(data);

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
    } catch (error) {
      console.error("❌ Error:", error);
      setError(error.message);
    } finally {
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
      const res = await fetch(getApiUrl(`/api/projects-like?id=${projectId}`), {  // ✅
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      
      setLikes(prev => ({
        ...prev,
        [projectId]: { 
          count: data.likes, 
          liked: data.liked 
        }
      }));
    } catch (error) {
      console.error('❌ Like error:', error);
    }
  };

  const handleView = async (projectId) => {
    try {
      const res = await fetch(getApiUrl(`/api/projects-view?id=${projectId}`), {  // ✅
        method: "POST"
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      
      setViews(prev => ({
        ...prev,
        [projectId]: data.views
      }));
    } catch (error) {
      console.error('❌ View error:', error);
    }
  };

  const viewMore = (id) => {
    setOpenId(prev => prev === id ? null : id);
  };

  const handleLoadMore = () => setVisibleCount(prev => prev + 3);

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || 
                           project.category === selectedCategory;
    
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tools?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.body?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <section id="projects">
        <h2 className="font-bold text-4xl text-center h-40 flex items-center justify-center">
          Projects
        </h2>
        <div className="projects-cont w-9/10 mx-auto py-20 flex flex-wrap justify-center items-center gap-15">
          {[1, 2, 3].map(i => (
            <ProjectSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">❌ Error loading projects</p>
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchProjects}
            className="bg-[#19cee6] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#15b8cc] transition"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section id="projects" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-2">📭 No projects found</p>
          <p className="opacity-70">Add projects from Admin Panel</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects">
      <h2 className="font-bold text-4xl text-center h-40 flex items-center justify-center">
        Projects ({filteredProjects.length})
      </h2>

      <div className="projects-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search for a project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-20">
          <i className="fas fa-search text-6xl opacity-50 mb-4"></i>
          <p className="text-2xl mb-2">No results found</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="bg-[#19cee6] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#15b8cc] transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="projects-cont w-9/10 mx-auto py-20 flex flex-wrap flex-col justify-center items-center gap-15">
          {filteredProjects.slice(0, visibleCount).map(item => (
            <div
              key={item._id} 
              className="project w-80 transition hover:scale-105 rounded-4xl overflow-hidden flex justify-center flex-col relative"
            >
              <div className="love absolute top-3 right-3 z-10 flex flex-col justify-center items-center rounded-4xl p-2 bg-[#0a0a0a]/80 backdrop-blur-sm">
                <div className="flex flex-col items-center mb-2">
                  <i className="fa-solid fa-eye text-[#19cee6] text-2xl"></i>
                  <span className="text-[#19cee6] font-bold">{views[item._id] || 0}</span>
                </div>
                
                <div 
                  onClick={() => handleLike(item._id)} 
                  className="cursor-pointer flex flex-col items-center hover:scale-110 transition"
                >
                  <i className={`fa-heart ${likes[item._id]?.liked ? 'fa-solid' : 'fa-regular'} text-[#19cee6] text-2xl`}></i>
                  <span className="text-[#19cee6] font-bold">{likes[item._id]?.count || 0}</span>
                </div>
              </div>

              <div className="top-product relative flex justify-center items-center overflow-hidden">
                <img 
                  src={item.urlImg || 'https://placehold.co/400x300?text=No+Image'} 
                  alt={item.title}
                  className="project-img rounded-4xl w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/400x300/1a1a1a/19cee6?text=No+Image';
                  }}
                />
              </div>

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
                        onClick={() => handleView(item._id)}
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
          
          {visibleCount < filteredProjects.length && (
            <button 
              onClick={handleLoadMore} 
              className="cursor-pointer bg-[#19cee6] text-black font-bold px-8 py-3 rounded-2xl hover:bg-[#15b8cc] transition"
            >
              Load More ({filteredProjects.length - visibleCount} remaining)
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default Projects;