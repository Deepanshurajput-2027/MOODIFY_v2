import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Face Scan', to: '/dashboard/scan' },
  { label: 'Upload', to: '/dashboard/upload' },
  { label: 'History', to: '/dashboard/history' },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  if (location.pathname.startsWith('/dashboard')) {
    return null;
  }

  const handleLogout = async () => {
    setMobileOpen(false);
    await dispatch(logoutUser());
    navigate('/login');
  };

  const displayName = user?.profile?.displayName || user?.username || user?.email || 'User';

  // ── Authenticated (dark) ──────────────────────────────────────────
  if (isAuthenticated) {
    return (
      <>
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-4 md:py-5 text-black font-sans bg-white backdrop-blur-xl border-b border-white/10">
          {/* Logo */}
          <Link to="/dashboard" className="text-lg md:text-xl font-extrabold tracking-tighter">
            MOODIFY
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-12 text-md font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-400 hover:text-black transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right section */}
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <span className="hidden lg:block text-gray-500 truncate max-w-[150px]">
              {displayName}
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white hover:bg-red-500 p-2 rounded-full transition-colors duration-200 cursor-pointer"
            >
              Logout
            </button>
            <Link
              to="/profile"
              className="rounded-full bg-black px-4 py-2 text-white text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105"
            >
              Profile
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden text-white cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile overlay menu */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-20 px-8 flex flex-col gap-6 text-white font-sans md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-bold tracking-tight text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-4 border-t border-white/10 pt-6 flex flex-col gap-4">
              <span className="text-gray-500 text-sm truncate">{displayName}</span>
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="rounded-full bg-white px-5 py-2.5 text-black text-xs font-bold uppercase tracking-widest text-center transition-transform hover:scale-105"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // ── Unauthenticated (light / landing page) ────────────────────────
  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-4 md:py-6 text-black font-sans bg-white/80 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none">
      <div className="text-lg md:text-xl font-extrabold tracking-tighter">
        <Link to="/">MOODIFY</Link>
      </div>

      <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm font-medium">
        <Link className="hover:text-gray-500 transition-colors hidden sm:block" to="/explore">Explore</Link>
        <Link className="hover:text-gray-500 transition-colors" to="/login">Login</Link>
        <Link className="rounded-full bg-black px-4 py-2 md:px-5 md:py-2 text-white transition-transform hover:scale-105" to="/register">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

