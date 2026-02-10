import "./Navbar.css";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [smallNav, setSmallNav] = useState(false);
  const activeIcons = ({ isActive }) => ({
    color: isActive ? "hsl(187 80% 50%)" : "",
  });


  const navItems = [
    { id: "home", to: "/", label: "Home" },
    { id: "about", to:"/about", label: "About" },
    { id: "projects", to:"/projects", label: "Projects" },
    { id: "skills", to:"/skills", label: "Skills" },
    { id: "contact", to:"/contact", label: "Contact" },
  ];

  const handleClickNav = () => {
    setSmallNav(!smallNav);
  };

  return (
    <nav className="nav-bar gradient-animation px-20 h-20 w-full shadow-2xl fixed flex items-center justify-between z-50 backdrop-blur-md">
      <NavLink className="text-2xl relative font-bold cursor-pointer" to="/">HANI</NavLink>
      <button onClick={handleClickNav} className="small-nav"><i className={` text-3xl ${smallNav ? "fas fa-xmark" : "fas fa-bars"}`}></i></button>
      <div className={`nav-links flex items-center justify-center gap-10 font-bold ${smallNav ? "small-nav-active" : ""}`}>
        <ul className="flex gap-6">
          {navItems.map((item) => (
            <li key={item.id}>
              <NavLink to={item.to} className={`relative pb-1 transition`} style={activeIcons}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>         
      <div className="btns flex justify-center items-center">
        <button className="hover:text-black w-30 h-10 rounded-xl font-bold"> <a href="https://drive.google.com/file/d/19b4AEvxOKXq2do3ODTdSH8AURhUR8jQQ/view?usp=sharing" target="_blank" rel="noopener noreferrer">Resume</a></button>
      </div>
    </nav>
  );
}

export default Navbar;
