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
import { Toaster } from 'react-hot-toast';
import AdminPanel from './pages/AdminPanel/AdminPanel';


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
     {/* مكون الـ Toasts - يضاف مرة واحدة */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          // الإعدادات الافتراضية
          duration: 3000,
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '16px',
          },
          // Success
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          // Error
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      /> {/* ✅ */}

      {showSurvey && <SurveyModal onComplete={handleSurveyComplete} />}
      <VisitorCounter />
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
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
          {/* صفحة الخطأ */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;