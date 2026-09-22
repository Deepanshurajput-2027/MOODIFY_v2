import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// Import your logout action here if you have one

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-8 py-4 md:py-6 text-black font-sans bg-white/80 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none">
      <div className="text-lg md:text-xl font-extrabold tracking-tighter">
        <Link to="/">MOODIFY</Link>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm font-medium">
        {isAuthenticated ? (
          <>
            <span className="hidden sm:block text-gray-500 truncate max-w-[150px] lg:max-w-xs">
              Hi, {user?.email || 'User'}
            </span>
            <button className="hover:text-gray-500 transition-colors">Logout</button>
            <Link className="rounded-full bg-black px-4 py-2 md:px-5 md:py-2 text-white transition-transform hover:scale-105" to="/profile">
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link className="hover:text-gray-500 transition-colors hidden sm:block" to="/explore">Explore</Link>
            <Link className="hover:text-gray-500 transition-colors" to="/login">Login</Link>
            <Link className="rounded-full bg-black px-4 py-2 md:px-5 md:py-2 text-white transition-transform hover:scale-105" to="/register">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
