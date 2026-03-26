import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, LayoutDashboard, Package } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8D5A3'}} className="sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-2 flex justify-between items-center">

        {/* Logo */}
        <Link to="/">
          <img src="/KPSlogo.png" alt="Kindled Paper Studio" className="h-18 w-auto" />
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <Link to="/shop" style={{color: '#1A1A1A'}} className="font-medium hover:opacity-70 transition">
            Shop
          </Link>

          <Link to="/cart" style={{color: '#1A1A1A'}} className="hover:opacity-70 transition">
            <ShoppingCart size={22} />
          </Link>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" style={{color: '#1A1A1A'}} className="hover:opacity-70 transition">
                  <LayoutDashboard size={22} />
                </Link>
              )}
              <Link to="/orders" style={{color: '#1A1A1A'}} className="hover:opacity-70 transition">
                <Package size={22} />
              </Link>
              <button
                onClick={handleLogout}
                style={{backgroundColor: '#C9A84C', color: '#FFFFFF'}}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90 transition font-medium"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{color: '#1A1A1A'}} className="flex items-center gap-2 font-medium hover:opacity-70 transition">
                <User size={18} />
                Login
              </Link>
              <Link
                to="/register"
                style={{backgroundColor: '#C9A84C', color: '#FFFFFF'}}
                className="px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;