import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 text-black font-sans">
      <div className="text-xl font-extrabold tracking-tighter">
        <Link to="/">MOODIFY</Link>
      </div>
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link className="hover:text-gray-500 transition-colors" to="/explore">Explore</Link>
        <Link className="hover:text-gray-500 transition-colors" to="/login">Login</Link>
        <Link className="rounded-full bg-black px-5 py-2 text-white transition-transform hover:scale-105" to="/profile">
          Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
