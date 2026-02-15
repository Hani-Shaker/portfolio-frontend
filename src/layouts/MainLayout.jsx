import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle.jsx'; // ✅

function MainLayout() {
  return (
    <>
      <ThemeToggle /> {/* ✅ */}
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;