import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 text-black font-sans pointer-events-auto">
      <div className="text-xl font-extrabold tracking-tighter">
        <Link to="/">MOODIFY</Link>
      </div>
      <div className="flex items-center gap-6 text-sm font-medium">
        {!isAuthenticated ? (
          <>
            <Link className="hover:text-gray-500 transition-colors" to="/explore">Explore</Link>
            <Link className="hover:text-gray-500 transition-colors" to="/login">Login</Link>
          </>
        ) : (
          <>
            <span className="text-gray-700">Hi, {user?.name || user?.email}</span>
            <button onClick={handleLogout} className="hover:text-gray-500 transition-colors">Logout</button>
          </>
        )}
        <Link className="rounded-full bg-black px-5 py-2 text-white transition-transform hover:scale-105" to="/profile">
          Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
