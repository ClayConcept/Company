import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-white border-b-2 border-black font-mono">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold uppercase tracking-wider">
              BRUTAL.DESIGN
            </Link>
          </div>
          
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="px-4 py-2 text-sm font-bold uppercase tracking-wider hover:underline"
                >
                  Dashboard
                </Link>
                <div className="mx-2 border-r border-black h-6"></div>
                <Button 
                  variant="text" 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm"
                >
                  Logout
                </Button>
                <div className="ml-4 px-3 py-1 bg-black text-white text-xs font-bold uppercase">
                  {user?.subscription || 'Free'}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-bold uppercase tracking-wider hover:underline"
                >
                  Login
                </Link>
                <Link to="/register">
                  <Button size="sm" className="ml-2">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t-2 border-black">
          <div className="container mx-auto px-4 py-2">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block py-2 text-sm font-bold uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block py-2 text-sm font-bold uppercase tracking-wider"
                >
                  Logout
                </button>
                <div className="mt-2 inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase">
                  {user?.subscription || 'Free'}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block py-2 text-sm font-bold uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block py-2 text-sm font-bold uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;