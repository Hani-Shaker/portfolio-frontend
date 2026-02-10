import Navbar from '../components/Navbar/Navbar.jsx';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> 
      </main>
    </>
  );
};

export default MainLayout;
