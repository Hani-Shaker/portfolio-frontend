import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react"; // ✅
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Projects from './components/Projects/Projects';
import Skills from './components/Skills/Skills';
import Home from './components/Home/Home';
import MainLayout from "./layouts/MainLayout";
import SurveyModal from './components/SurveyModal/SurveyModal'; // ✅
import VisitorCounter from './components/VisitorCounter/VisitorCounter'; // ✅

function App() {
  const [showSurvey, setShowSurvey] = useState(false); // ✅

  useEffect(() => {
    // التحقق من إكمال الاستبيان
    const surveyCompleted = localStorage.getItem("surveyCompleted");
    if (!surveyCompleted) {
      // تأخير 1 ثانية قبل عرض الاستبيان (optional)
      setTimeout(() => {
        setShowSurvey(true);
      }, 1000);
    }
  }, []); // ✅

  const handleSurveyComplete = () => {
    setShowSurvey(false);
  }; // ✅

  return (
    <>
      {/* الاستبيان - يظهر فوق كل حاجة */}
      {showSurvey && <SurveyModal onComplete={handleSurveyComplete} />} {/* ✅ */}
      
      {/* عداد الزوار - يظهر في كل الصفحات */}
      <VisitorCounter /> {/* ✅ */}

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
          {/* صفحة الخطأ */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;