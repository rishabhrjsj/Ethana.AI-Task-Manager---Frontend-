import { Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ title, subtitle }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-sm">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
        </div>
        <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
