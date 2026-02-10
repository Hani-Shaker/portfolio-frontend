import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Projects from './components/Projects/Projects';
import Skills from './components/Skills/Skills';
import Home from './components/Home/Home';
import MainLayout from "./layouts/MainLayout";

// import Navbar from "./components/Navbar/Navbar";
function App() {
  return (

      <Router>
      <Routes>
        {/* Layout فيه Navbar و Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Layout بدون Navbar و Footer
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route> */}

        {/* صفحة الخطأ */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  )
}

export default App
