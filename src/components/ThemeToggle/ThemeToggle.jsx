import { Theme } from '../../context/ThemeContext';
import './ThemeToggle.css';

function ThemeToggle() {
  const { theme, toggleTheme } = Theme();

  return (
    <button onClick={toggleTheme}  className="theme-toggle" aria-label="Toggle theme">
      {theme === 'light' ? (<i className="fas fa-sun"></i>) : (<i className="fas fa-moon"></i>)}
    </button>
  );
}

export default ThemeToggle;