import './Home.css'
import TextType from '../../assets/animations/TextType.jsx';
import profile from "../../assets/images/profile.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ProjectSkeleton } from '../Skeleton/Skeleton';

const getApiUrl = (endpoint) => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
  return `${baseUrl}${endpoint}`;
};

function Home() {
  const mediaItems = [
    { id: "facebook", url: "https://www.facebook.com/hany.hany.955312?rdid=mrUgFZTu92y69E3N&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1XJZShHphQ%2F#" , icon:"fab fa-facebook-f"},
    { id: "linkedin", url: "https://www.linkedin.com/in/hani-shaker-81656034b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" , icon:"fab fa-linkedin-in"},
    { id: "github", url: "https://github.com/Hani-Shaker" , icon:"fab fa-github"},
  ];
  const [projects, setProjects] = useState([]);

  const [openId, setOpenId] = useState(null);
  const [likes, setLikes] = useState({});
  const [views, setViews] = useState({});
  useEffect(() => {
    fetchProjects();
  }, []);

    const fetchProjects = async () => {

    
    try {
      const res = await fetch(getApiUrl('/api/projects'));  // ✅
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      // console.log("📦 Projects data:", data);
      
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

const filteredProjects = [...projects] // ✅ نسخة جديدة
  .sort((a, b) => {
    const likesA = a.likedBy?.length || 0;
    const likesB = b.likedBy?.length || 0;
    return likesB - likesA;
  })
  .slice(0, 3);

  return (
    <section className='home relative flex overflow-hidden flex-col' id='home'>
      <div className='relative main-section w-8/10 h-xl-dvh mx-auto flex items-center'>
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30 animate-pulse-glow" 
                style={{ background: 'var(--gradient-glow)' }} />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-20 animate-pulse-glow"
                style={{ background: 'radial-gradient(ellipse at center, hsl(270 70% 60% / 0.2), transparent 70%)', animationDelay: '1.5s' }} />
        </div>
        <div className="home-content  flex h-full">
            <div className="left-home h-full px-10 py-30 flex flex-col gap-5">
              <h2 className="font-bold text-4xl">Welcome</h2>
              <h3 className="font-bold text-3xl">I 'M HANI SHAKER</h3>
              <div className="work flex gap-1 font-bold text-2xl">
                ,I am<div className="switch-words">
                        <TextType 
                          text={["a Frontend Developer", "a Backend Developer", "a Node.js Developer", "using React", "using MongoDB"]}
                          typingSpeed={75}
                          pauseDuration={1500}
                          showCursor={true}
                          cursorCharacter="|"
                        />
                  </div>
              </div>
              <div className="short-about">I’m a <h6>junior web developer</h6> who loves building websites and working with others. <h6>welcome to website.</h6></div>

              <Link to="/contact"
                className="hire-me" onClick={() =>
                  document.getElementById("contact").scrollIntoView({ behavior: "smooth" })
                }>Hire Me</Link>
              <div className="media">
                <ul className='flex gap-2.5'>
                  {mediaItems.map((item) => (
                    <li key={item.id} className='w-12 h-12 font-bold text-2xl flex justify-center items-center rounded-4xl'>
                      <a href={item.url} target="_blank">
                        <span><i className={item.icon}></i></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="right-home w-1/2 h-full flex justify-center items-center">
                <div className="flex items-center h-full">
                  <img src={profile} alt="img" className='profile w-100 m-15'/>
                </div>
            </div>
        </div>
      </div>
      <div className='featured-projects'>
        <h2 className='font-bold text-4xl'>Featured Projects</h2>
        {filteredProjects.length === 0 ? (
        <div className="text-center py-20">
          <i className="fas fa-search text-6xl opacity-50 mb-4"></i>
          <p className="text-2xl mb-2">No results found</p>
        </div>
      ) : (
        <div className="projects-cont w-9/10 mx-auto py-20 flex flex-wrap justify-center items-center gap-10">
          {filteredProjects.map(item => (
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
        </div>
      )}
      </div>
    </section>
  )
}

export default Home
